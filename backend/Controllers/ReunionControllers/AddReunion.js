import Reunion from "../../Models/Reunion.js";


const AddReunion = async (req, res) => {
    const { titre, dateHeure, lieu } = req.body;

    try {
        // Vérification des données
        if (!titre || !dateHeure || !lieu) {
            return res.status(400).json({
                message: "Tous les champs sont requis",
                type: "danger"
            });
        }

        // Création de la réunion
        const newReunion = new Reunion({
            titre,
            dateHeure,
            lieu,
            userId: req.user._id // Assurez-vous que l'utilisateur est authentifié et que req.user est défini
            
        })


        await newReunion.save();
        res.status(201).json({
            message: "Réunion créée avec succès!",
            type: "success",
            reunion: newReunion
        });

}catch (err) {
        console.error("Erreur lors de l'enregistrement :", err);
        res.status(400).json({
            message: err.message,
            type: "danger"
        });
    }
}


export default AddReunion;