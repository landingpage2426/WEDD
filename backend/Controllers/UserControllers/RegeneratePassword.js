import User from "../../Models/User.js";
import bcrypt from "bcryptjs";

const RegeneratePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const clientId = req.user._id;

    // Vérifier que l'utilisateur qui régénère est un client
    if (req.user.role !== 'client') {
      return res.status(403).json({
        message: "Seuls les clients peuvent régénérer des mots de passe",
        type: "danger"
      });
    }

    // Trouver l'utilisateur
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        type: "danger"
      });
    }

    // Vérifier que l'utilisateur appartient au client
    if (user.createdBy?.toString() !== clientId.toString()) {
      return res.status(403).json({
        message: "Vous n'avez pas le droit de régénérer le mot de passe de cet utilisateur",
        type: "danger"
      });
    }

    // Générer un nouveau mot de passe aléatoire (8 caractères)
    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const plainPassword = generatePassword();

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    user.plainPassword = plainPassword; // Stocker le mot de passe en clair
    await user.save();

    res.status(200).json({
      message: "Mot de passe régénéré avec succès",
      type: "success",
      password: plainPassword,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        plainPassword: user.plainPassword
      }
    });
  } catch (err) {
    console.error("Erreur lors de la régénération du mot de passe :", err);
    res.status(500).json({
      message: "Erreur lors de la régénération du mot de passe",
      type: "danger",
      error: err.message
    });
  }
};

export default RegeneratePassword;

