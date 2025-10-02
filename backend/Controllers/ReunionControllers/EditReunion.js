import Reunion from "../../Models/Reunion.js";

const EditReunion = async (req, res) => {
    const { reunionId } = req.params;
    const { titre, dateHeure, lieu } = req.body;

    try {
        // Vérification des données
        if (!titre || !dateHeure || !lieu) {
            return res.status(400).json({
                message: "Tous les champs sont requis",
                type: "danger"
            });
        }

        // Mise à jour de la réunion
        const updatedReunion = await Reunion.findByIdAndUpdate(
            reunionId,
            { titre, dateHeure, lieu },
            { new: true }
        );

        if (!updatedReunion) {
            return res.status(404).json({
                message: "Réunion non trouvée",
                type: "danger"
            });
        }

        res.status(200).json({
            message: "Réunion mise à jour avec succès!",
            type: "success",
            reunion: updatedReunion
        });

    } catch (err) {
        console.error("Erreur lors de la mise à jour de la réunion :", err);
        res.status(400).json({
            message: err.message,
            type: "danger"
        });
    }
}



export default EditReunion;