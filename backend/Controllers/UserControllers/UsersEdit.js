import User from "../../Models/User.js";

const UsersEdit = async (req, res) => {
  const { id } = req.params;
  const {
    nom,
    prenom,
    email,
    telephone,
    nomTable,
    status,
    dateMariage,
    lieuMariage,
    couleurSite,
    themeMariage,
    role,
  } = req.body;

  try {
    const updatedFields = {
      nom,
      prenom,
      email,
      telephone,
      nomTable,
      status,
      dateMariage,
      lieuMariage,
      couleurSite,
      themeMariage,
      role,
    };

    const updatedUsers = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedUsers) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        type: "danger",
      });
    }

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès !",
      type: "success",
      invite: updatedUsers,
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour",
      type: "danger",
    });
  }
};

export default UsersEdit;
