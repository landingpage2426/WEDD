import Invite from "../../Models/Invite.js";


const OneInvite  = async (req, res) => {
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


export default OneInvite;