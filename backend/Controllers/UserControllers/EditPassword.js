import User from "../../Models/User.js";
import bcrypt from "bcryptjs";
import { writeAudit } from "../../services/audit.js";


const EditPassword = async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;

  try {
    // Vérification des données reçues
    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({
        message: "Tous les champs sont requis",
        type: "danger",
      });
    }

    // Vérification de la confirmation
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Les nouveaux mots de passe ne correspondent pas",
        type: "danger",
      });
    }

    // Récupération de l'utilisateur connecté
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        type: "danger",
      });
    }

    // Hashage et mise à jour
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;
    await user.save();

    await writeAudit({
      action: "password_changed",
      actorId: user._id,
      actorEmail: user.email,
      targetId: user._id,
      targetEmail: user.email,
      details: "Mot de passe modifié par le titulaire",
    });

    return res.status(200).json({
      message: "Mot de passe mis à jour avec succès!",
      type: "success",
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du mot de passe :", err);
    return res.status(500).json({
      message: "Erreur serveur",
      type: "danger",
    });
  }
};


export default EditPassword;