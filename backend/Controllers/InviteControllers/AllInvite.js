import Invite from "../../Models/Invite.js";
import User from "../../Models/User.js";

const AllInvite = async (req, res) => {
    try {
        let userIdToQuery = req.user._id;
        
        // Si l'utilisateur est un staff (manager, chef_protocole, protocole), 
        // récupérer les invités du client qui l'a créé
        if (req.user.role !== 'client' && req.user.createdBy) {
            userIdToQuery = req.user.createdBy;
        }
        
        // Tous les rôles peuvent voir la liste des invités (client, manager, chef_protocole, protocole)
        // Les permissions de modification/suppression sont gérées côté frontend
        const invites = await Invite.find({ userId: userIdToQuery });
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
};


export default AllInvite;
