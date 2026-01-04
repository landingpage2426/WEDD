import User from "../../Models/User.js";

const GetStaffUsers = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est un client
    if (req.user.role !== 'client') {
      return res.status(403).json({
        message: "Accès non autorisé",
        type: "danger"
      });
    }

    // Récupérer tous les utilisateurs créés par ce client (inclure plainPassword pour l'affichage)
    const staffUsers = await User.find({ 
      createdBy: req.user._id 
    }).select("-password").sort({ createdAt: -1 });
    
    // S'assurer que plainPassword est inclus dans la réponse
    const usersWithPassword = staffUsers.map(user => {
      const userObj = user.toObject();
      return userObj;
    });

    res.status(200).json({
      message: "Utilisateurs récupérés avec succès",
      type: "success",
      users: usersWithPassword
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
      type: "danger"
    });
  }
};

export default GetStaffUsers;

