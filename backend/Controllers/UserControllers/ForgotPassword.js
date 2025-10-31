import User from "../../Models/User.js";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // 1. Vérifie si l’utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Aucun utilisateur trouvé avec cet email",
        type: "danger",
      });
    }

    // 2. Vérifie la correspondance des mots de passe
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Les mots de passe ne correspondent pas",
        type: "danger",
      });
    }

    // 3. Hash le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Met à jour dans la base de données
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({
      message: "Mot de passe modifié avec succès !",
      type: "success",
    });
  } catch (err) {
    console.error("Erreur lors de la réinitialisation:", err);
    res.status(500).json({
      message: "Erreur serveur lors du changement de mot de passe",
      type: "danger",
    });
  }
};
