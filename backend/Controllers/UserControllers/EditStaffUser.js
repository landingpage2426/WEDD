import User from "../../Models/User.js";
import bcrypt from "bcryptjs";

const EditStaffUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { nom, prenom, email, telephone, role } = req.body;
    const clientId = req.user._id;

    // Vérifier que l'utilisateur qui modifie est un client
    if (req.user.role !== 'client') {
      return res.status(403).json({
        message: "Seuls les clients peuvent modifier des utilisateurs",
        type: "danger"
      });
    }

    // Vérifier que le rôle est valide
    const validRoles = ['manager', 'chef_protocole', 'protocole'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        message: "Rôle invalide. Rôles autorisés: manager, chef_protocole, protocole",
        type: "danger"
      });
    }

    // Trouver l'utilisateur à modifier
    const userToEdit = await User.findById(userId);

    if (!userToEdit) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        type: "danger"
      });
    }

    // Vérifier que l'utilisateur appartient au client
    if (userToEdit.createdBy?.toString() !== clientId.toString()) {
      return res.status(403).json({
        message: "Vous n'avez pas le droit de modifier cet utilisateur",
        type: "danger"
      });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== userToEdit.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "Cet email est déjà utilisé",
          type: "danger"
        });
      }
    }

    // Mettre à jour uniquement les champs fournis (non vides)
    if (nom !== undefined && nom !== null && nom.trim() !== '') userToEdit.nom = nom.trim();
    if (prenom !== undefined && prenom !== null && prenom.trim() !== '') userToEdit.prenom = prenom.trim();
    if (email !== undefined && email !== null && email.trim() !== '') userToEdit.email = email.trim();
    if (telephone !== undefined && telephone !== null && telephone.trim() !== '') userToEdit.telephone = telephone.trim();
    if (role !== undefined && role !== null && role.trim() !== '') userToEdit.role = role.trim();

    await userToEdit.save();

    res.status(200).json({
      message: "Utilisateur modifié avec succès",
      type: "success",
      user: {
        id: userToEdit._id,
        nom: userToEdit.nom,
        prenom: userToEdit.prenom,
        email: userToEdit.email,
        telephone: userToEdit.telephone,
        role: userToEdit.role,
        plainPassword: userToEdit.plainPassword
      }
    });
  } catch (err) {
    console.error("Erreur lors de la modification de l'utilisateur :", err);
    res.status(500).json({
      message: "Erreur lors de la modification de l'utilisateur",
      type: "danger",
      error: err.message
    });
  }
};

export default EditStaffUser;

