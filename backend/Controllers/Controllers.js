
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  User from "../Models/User.js";
import Reunion from '../Models/Reunion.js';
import Invite from '../Models/Invite.js';




const addReunion = async (req, res) => {
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
        //console.log("Réunion enregistrée :", newReunion);
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

const allReunion = async (req, res) => {
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

const editReunion = async (req, res) => {
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


const deleteReunion = async (req, res) => {
  const { reunionId } = req.params;

  try {
    const deleted = await Reunion.findByIdAndDelete(reunionId);

    if (!deleted) {
      return res.status(404).json({
        message: 'Réunion non trouvée',
        type: 'danger',
      });
    }

    res.status(200).json({
      message: 'Réunion supprimée avec succès',
      type: 'success',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réunion:', error);
    res.status(500).json({
      message: 'Erreur serveur lors de la suppression',
      type: 'danger',
    });
  }
};



const addInvite = async (req, res) => {
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
       
const allInvite = async (req, res) => {
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



const oneInvite  = async (req, res) => {
  const { inviteId } = req.params;

  try {
    const invite = await Invite.findOne({ inviteId });

    if (!invite) {
      return res.status(404).json({
        message: 'Invité non trouvé',
        type: 'danger'
      });
    }

    // ✅ Vérification de propriété
    if (invite.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Accès non autorisé à cet invité",
        type: "danger"
      });
    }

    res.status(200).json({
      message: 'Invité récupéré avec succès',
      type: 'success',
      invite
    });
  } catch (err) {
    console.error("Erreur lors de la récupération de l'invité :", err);
    res.status(500).json({
      message: "Erreur serveur",
      type: "danger"
    });
  }
}


const editInvite = async (req, res) => {

  const { id } = req.params; 
  const { titre ,nom, prenom, telephone, nomTable, status } = req.body;

  try {
    if (!nom || !prenom || !telephone) {
      return res.status(400).json({
        message: "Nom, prénom et téléphone sont requis",
        type: "danger",
      });
    }

    const updatedFields = {
      titre,
      nom,
      prenom,
      telephone,
      nomTable,
      status,
    };

    if (req.file) {
      updatedFields.image = req.file.filename;
    }

    const updatedInvite = await Invite.findByIdAndUpdate(
        id, 
        updatedFields,
         {
      new: true,
    });

    if (!updatedInvite) {
      return res.status(404).json({
        message: "Invité non trouvé",
        type: "danger",
      });
    }

    res.status(200).json({
      message: "Invité mis à jour avec succès !",
      type: "success",
      invite: updatedInvite,
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'invité :", err);
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour",
      type: "danger",
    });
  }
};

const deleteInvite = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Invite.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Invité non trouvé',
                type: 'danger',
            });
        }

        res.status(200).json({
            message: 'Invité supprimé avec succès',
            type: 'success',
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'invité:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la suppression',
            type: 'danger',
        });
    }
}


const presence = async (req, res) => {
  try {
    const inviteId = req.params.inviteId;
    const invite = await Invite.findOne({ inviteId });

    if (!invite) {
      return res.status(404).json({ message: "Invité introuvable" });
    }

    const dejaPresent = invite.status === 'P';

    if (!dejaPresent) {
      invite.status = 'P';
      await invite.save();
    }

    return res.status(200).json({
      dejaPresent,
      message: dejaPresent
        ? "❗ Cet invité était déjà présent"
        : "✅ Présence enregistrée avec succès",
      invite,
    });
  } catch (err) {
    console.error("Erreur serveur :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};




export {
    addReunion,
    allReunion,
    addInvite,
    allInvite,
    oneInvite,
    editInvite,
    deleteInvite,
    editReunion,
    deleteReunion,
    presence
};