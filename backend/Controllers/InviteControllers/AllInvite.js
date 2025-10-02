import Invite from "../../Models/Invite.js";

const AllInvite = async (req, res) => {
    try {
        const invites = await Invite.find({ userId: req.user._id }); // Récupérer les invités de l'utilisateur connecté
        res.status(200).json({
            message: "Invités récupérés avec succès",
            type: "success",
            invites
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des invités :", err);
        res.status(500).json({
            message: "Erreur lors de la récupération des invités",
            type: "danger"
        });
    }
}


export default AllInvite;