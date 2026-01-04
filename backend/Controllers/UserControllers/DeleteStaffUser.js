import User from "../../Models/User.js";

const DeleteStaffUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const clientId = req.user._id;

    // Vérifier que l'utilisateur qui supprime est un client
    if (req.user.role !== 'client') {
      return res.status(403).json({
        message: "Seuls les clients peuvent supprimer des utilisateurs",
        type: "danger"
      });
    }

    // Trouver l'utilisateur à supprimer
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        type: "danger"
      });
    }

    // Vérifier que l'utilisateur appartient au client
    if (userToDelete.createdBy?.toString() !== clientId.toString()) {
      return res.status(403).json({
        message: "Vous n'avez pas le droit de supprimer cet utilisateur",
        type: "danger"
      });
    }

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Utilisateur supprimé avec succès",
      type: "success"
    });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur :", err);
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      type: "danger",
      error: err.message
    });
  }
};

export default DeleteStaffUser;

