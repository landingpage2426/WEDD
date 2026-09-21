import Invite from "../../Models/Invite.js";

const ToggleBilletEnvoye = async (req, res) => {
  try {
    if (!['client', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        message: "Accès refusé : vous n'avez pas les permissions pour modifier cet état",
        type: "danger",
      });
    }

    const invite = await Invite.findById(req.params.id);
    if (!invite) {
      return res.status(404).json({
        message: "Invité introuvable",
        type: "danger",
      });
    }

    let hasAccess = false;
    if (req.user.role === 'client') {
      hasAccess = invite.userId.toString() === req.user._id.toString();
    } else if (req.user.createdBy) {
      hasAccess = invite.userId.toString() === req.user.createdBy.toString();
    }

    if (!hasAccess) {
      return res.status(403).json({
        message: "Accès non autorisé à cet invité",
        type: "danger",
      });
    }

    const nextValue = req.body.billetEnvoye === undefined
      ? !invite.billetEnvoye
      : Boolean(req.body.billetEnvoye);

    await Invite.updateOne(
      { _id: invite._id },
      { $set: { billetEnvoye: nextValue } }
    );

    return res.status(200).json({
      message: nextValue ? "Billet marqué comme envoyé" : "Billet marqué comme non envoyé",
      type: "success",
      invite: { ...invite.toObject(), billetEnvoye: nextValue },
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'envoi du billet :", err);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour",
      type: "danger",
    });
  }
};

export default ToggleBilletEnvoye;
