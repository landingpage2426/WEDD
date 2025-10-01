import User from "../../Models/User.js";


const EditProfil = async (req, res) => {
    const { nom, prenom, email, telephone, dateMariage, lieuMariage, couleurSite, themeMariage } = req.body;

    try {
        // Vérification des données
        if (!nom || !prenom || !email || !telephone) {
            return res.status(400).json({
                message: "Tous les champs sont requis",
                type: "danger"
            });
        }

        // Mise à jour de l'utilisateur
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { nom, prenom, email, telephone, dateMariage, lieuMariage, couleurSite, themeMariage },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "Utilisateur non trouvé",
                type: "danger"
            });
        }

        res.status(200).json({
            message: "Profil mis à jour avec succès!",
            type: "success",
            user: updatedUser
        });

    } catch (err) {
        console.error("Erreur lors de la mise à jour du profil :", err);
        res.status(400).json({
            message: err.message,
            type: "danger"
        });
    }
}

export default EditProfil;