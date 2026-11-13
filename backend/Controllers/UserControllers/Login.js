import User from "../../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmailNotification } from "../../Routes/SendEmailLogin.js";
import { writeAudit } from "../../services/audit.js";

const ACCESS_MS = 15 * 60 * 1000;

const Login = async (req, res) => {

  const { email, password } = req.body; 
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      await writeAudit({
        action: "login_failure",
        targetEmail: email,
        details: "Email ou mot de passe incorrect",
      });
      return res.status(400).json({
        message: "Email ou mot de passe incorrect",
        type: "danger",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await writeAudit({
        action: "login_failure",
        actorId: user._id,
        actorEmail: user.email,
        targetId: user._id,
        targetEmail: user.email,
        details: "Email ou mot de passe incorrect",
      });
      return res.status(400).json({
        message: "Email ou mot de passe incorrect",
        type: "danger",
      });
    }

    if (user.actif === false) {
      await writeAudit({
        action: "login_failure",
        actorId: user._id,
        actorEmail: user.email,
        targetId: user._id,
        targetEmail: user.email,
        details: "Compte désactivé",
      });
      return res.status(403).json({
        message: "Ce compte est désactivé",
        code: "ACCOUNT_DISABLED",
        type: "danger",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), type: "access" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id.toString(), type: "refresh" },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    if (process.env.NODE_ENV !== "test") {
      sendEmailNotification(email).catch(err => {
        console.error("Erreur envoi email notification:", err);
      });
    }

    await writeAudit({
      action: "login_success",
      actorId: user._id,
      actorEmail: user.email,
      targetId: user._id,
      targetEmail: user.email,
    });

    res.status(200).json({
      message: "Connexion réussie!",
      type: "success",
      token,
      refreshToken,
      expiresIn: ACCESS_MS,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        dateMariage: user.dateMariage,
        lieuMariage: user.lieuMariage,
        couleurSite: user.couleurSite,
        themeMariage: user.themeMariage,
        role: user.role,
        actif: user.actif !== false,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
    res.status(500).json({
      message: "Erreur lors de la connexion",
      type: "danger",
    });
  }
};

export default Login;
