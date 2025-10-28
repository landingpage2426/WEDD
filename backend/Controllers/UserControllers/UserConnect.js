
import User from "../../Models/User.js";

const UserConnect = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "Utilisateur non trouvé",
                type: "danger"
            });
        }
        res.status(200).json({
            message: "Informations utilisateur récupérées avec succès",
            type: "success",
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
                role: user.role,
                createdAt: user.createdAt,
            }
        });
    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        res.status(500).json({
            message: "Erreur serveur",
            type: "danger"
        });
    }
}


export default UserConnect;