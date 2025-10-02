import Invite from "../../Models/Invite.js";

const AddInvite = async (req, res) => {
    const {titre ,nom, prenom, telephone, nomTable, status} = req.body;
    //console.log("Données de l'invité :", req.body);
    try {
        if (!nom || !prenom || !telephone) {
            return res.status(400).json({
                message: "Tous les champs sont requis",
                type: "danger"
            });
        }

        const newInvite = new Invite({
            titre,
            nom,
            prenom,
            telephone,
            nomTable,
            status,
            image: req.file ? req.file.filename : null,
            userId: req.user._id
        });

        await newInvite.save();
        res.status(201).json({
            message: "Invité ajouté avec succès!",
            type: "success",
            invite: newInvite
        });

    } catch (err) {
        console.error("Erreur lors de l'enregistrement :", err);
        res.status(400).json({
            message: err.message,
            type: "danger"
        });
    }
};


export default AddInvite;