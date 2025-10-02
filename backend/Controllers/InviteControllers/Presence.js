import Invite from "../../Models/Invite.js";

const Presence = async (req, res) => {
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


export default Presence;