import Reunion from "../../Models/Reunion.js";


const AllReunion = async (req, res) => {
    try {

        const reunions = await Reunion.find({ userId: req.user._id }).sort({ dateHeure: 1 }); // Récupérer les réunions de l'utilisateur connecté
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
}


export default AllReunion;