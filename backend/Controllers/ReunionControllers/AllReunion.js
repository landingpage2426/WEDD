import Reunion from "../../Models/Reunion.js";


const AllReunion = async (req, res) => {
    try {
        let userIdToQuery = req.user._id;
        
        // Si l'utilisateur est un staff, récupérer les réunions du client qui l'a créé
        if (req.user.role !== 'client' && req.user.createdBy) {
            userIdToQuery = req.user.createdBy;
        }
        
        // Tous les rôles peuvent voir les réunions (client, manager, chef_protocole, protocole)

        const reunions = await Reunion.find({ userId: userIdToQuery }).sort({ dateHeure: 1 });
        res.status(200).json({
            message: "Réunions récupérées avec succès",
            type: "success",
            reunions
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des réunions :", err);
        res.status(500).json({
            message: "Erreur lors de la récupération des réunions",
            type: "danger"
        });
    }
};


export default AllReunion;
