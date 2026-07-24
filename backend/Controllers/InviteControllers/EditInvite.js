import Invite from "../../Models/Invite.js";


const EditInvite = async (req, res) => {

  const { id } = req.params; 
  const { titre ,nom, prenom, telephone,email, nomTable, status } = req.body;

  try {
    if (!nom || !prenom) {
      return res.status(400).json({
        message: "Nom et prénom sont requis",
        type: "danger",
      });
    }

    const updatedFields = {
      titre,
      nom,
      prenom,
      telephone: telephone || '',
      email: email || '',
      nomTable: nomTable ? String(nomTable).trim().toUpperCase() : nomTable,
      status: status === 'P' ? 'P' : 'A',
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

export default EditInvite;