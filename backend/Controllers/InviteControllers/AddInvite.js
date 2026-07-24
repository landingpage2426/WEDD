import Invite from "../../Models/Invite.js";

const AddInvite = async (req, res) => {
    const {titre ,nom, prenom, telephone, email, nomTable, status} = req.body;
    //console.log("Données de l'invité :", req.body);
    try {
        // Vérifier les permissions : seuls les clients et managers peuvent ajouter des invités
        if (req.user.role === 'protocole') {
            return res.status(403).json({
                message: "Accès refusé : vous n'avez pas les permissions pour ajouter des invités",
                type: "danger"
            });
        }
        
        if (!nom || !prenom) {
            return res.status(400).json({
                message: "Le nom et le prénom sont requis",
                type: "danger"
            });
        }

        // Déterminer le userId : client ou client parent pour les staff
        let userIdToUse = req.user._id;
        if (req.user.role !== 'client' && req.user.createdBy) {
            userIdToUse = req.user.createdBy;
        }

        const newInvite = new Invite({
            titre,
            nom,
            prenom,
            telephone: telephone || '',
            email: email || '',
            nomTable: nomTable ? String(nomTable).trim().toUpperCase() : nomTable,
            status: status === 'P' ? 'P' : 'A',
            image: req.file ? req.file.filename : null,
            userId: userIdToUse
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