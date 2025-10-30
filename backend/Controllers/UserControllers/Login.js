import User from "../../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendLoginEmail } from "../../Routes/SendEmailLogin.js";

const Login = async (req, res) => {

  const { email, password } = req.body; 
  try {
    // Vérification si l'utilisateur existe
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        message: "Email ou mot de passe incorrect",
        type: "danger",
      });
    }

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Email ou mot de passe incorrect",
        type: "danger",
      });
    }

    // Création d'un token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Le token expire après 24h
    );

    // Envoi asynchrone du mail sans bloquer la réponse
    sendLoginEmail(email).catch(err => {
      console.error("Erreur envoi email notification:", err);
    });

    // Envoi du token et des informations utilisateur
    res.status(200).json({
      message: "Connexion réussie!",
      type: "success",
      token, // Envoi du nouveau token
      expiresIn: 24 * 60 * 60 * 1000, // Durée de validité du token en millisecondes
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
        role: user.role
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
