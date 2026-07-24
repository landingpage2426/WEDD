import User from "../../Models/User.js";

const UsersGet = async (req, res) => {
    try {
        const users = await User.find({})
            .select("-password -plainPassword")
            .populate("createdBy", "nom prenom email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Utilisateurs récupérés avec succès",
            type: "success",
            users
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des Utilisateurs :", err);
        res.status(500).json({
            message: "Erreur lors de la récupération des Utilisateurs",
            type: "danger"
        });
    }
}


export default UsersGet;
