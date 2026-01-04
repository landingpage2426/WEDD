import User from "../../Models/User.js";
import bcrypt from "bcryptjs";

const CreateStaffUser = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, role } = req.body;
    const createdBy = req.user._id; // L'utilisateur qui crée (le client)

    // Vérifier que l'utilisateur qui crée est un client
    if (req.user.role !== 'client') {
      return res.status(403).json({
        message: "Seuls les clients peuvent créer des utilisateurs",
        type: "danger"
      });
    }

    // Vérifier que le rôle est valide
    const validRoles = ['manager', 'chef_protocole', 'protocole'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Rôle invalide. Rôles autorisés: manager, chef_protocole, protocole",
        type: "danger"
      });
    }

    // Vérifier les champs requis
    if (!nom || !prenom || !email || !telephone || !role) {
      return res.status(400).json({
        message: "Tous les champs sont requis",
        type: "danger"
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé",
        type: "danger"
      });
    }

    // Générer un mot de passe aléatoire (8 caractères)
    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const plainPassword = generatePassword();

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Créer le nouvel utilisateur
    const newUser = new User({
      nom,
      prenom,
      email,
      telephone,
      password: hashedPassword,
      role,
      createdBy,
      plainPassword: plainPassword, // Stocker le mot de passe en clair pour l'affichage
      // Les champs de mariage ne sont pas requis pour les staff
      dateMariage: null,
      lieuMariage: null,
      couleurSite: null,
      themeMariage: null
    });

    await newUser.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      type: "success",
      user: {
        id: newUser._id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        telephone: newUser.telephone,
        role: newUser.role,
        createdBy: newUser.createdBy
      },
      password: plainPassword // Retourner le mot de passe en clair pour l'affichage
    });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur :", err);
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      type: "danger",
      error: err.message
    });
  }
};

export default CreateStaffUser;

