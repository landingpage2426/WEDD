import Invite from "../../Models/Invite.js";
import User from "../../Models/User.js";
import { writeAudit } from "../../services/audit.js";

const Presence = async (req, res) => {
  try {
    const inviteId = req.params.inviteId;
    
    if (!inviteId) {
      return res.status(400).json({ 
        message: "ID invité manquant",
        type: "danger"
      });
    }

    const invite = await Invite.findOne({ inviteId: String(inviteId).trim() });

    if (!invite) {
      return res.status(404).json({ 
        message: "Invité introuvable",
        type: "danger"
      });
    }

    // Vérification que l'invité a un userId
    if (!invite.userId) {
      console.error("Invité sans userId trouvé :", invite);
      return res.status(500).json({
        message: "Erreur : invité invalide",
        type: "danger"
      });
    }

    // Vérification que l'invité appartient à l'utilisateur connecté ou au client qui a créé le staff
    let hasAccess = false;
    if (req.user.role === 'client') {
      hasAccess = invite.userId.toString() === req.user._id.toString();
    } else if (req.user.createdBy) {
      // Pour les staff, vérifier qu'ils appartiennent au même client
      hasAccess = invite.userId.toString() === req.user.createdBy.toString();
    }
    
    if (!hasAccess) {
      return res.status(403).json({
        message: "Accès non autorisé à cet invité",
        type: "danger"
      });
    }

    if (req.user.actif === false) {
      return res.status(403).json({
        message: "Ce compte est désactivé",
        code: "ACCOUNT_DISABLED",
        type: "danger",
      });
    }

    if (req.user.createdBy) {
      const owner = await User.findById(req.user.createdBy).select("actif");
      if (owner?.actif === false) {
        return res.status(403).json({
          message: "Le compte client est désactivé",
          code: "ACCOUNT_DISABLED",
          type: "danger",
        });
      }
    }

    // Vérifier si la date du mariage est passée
    const user = await User.findById(req.user._id);
    const dateMariage = user?.dateMariage || null;
    const isDatePassed = dateMariage ? new Date(dateMariage) < new Date() : false;

    if (isDatePassed) {
      return res.status(400).json({
        dejaPresent: false,
        message: "⛔ Ce billet n'est plus valide. La date du mariage est déjà passée.",
        invite,
        type: "danger",
        isDatePassed: true
      });
    }

    const guestName = `${invite.prenom || ''} ${invite.nom || ''}`.trim();
    const markAbsent = req.body?.markAbsent === true;

    if (markAbsent) {
      if (invite.status !== 'P') {
        return res.status(200).json({
          dejaPresent: false,
          markedAbsent: false,
          message: "Cet invité n'est pas marqué présent",
          invite,
          type: "warning",
        });
      }

      await Invite.updateOne(
        { _id: invite._id },
        { $set: { status: 'A' } }
      );
      invite.status = 'A';
      await writeAudit({
        action: 'absence',
        actorId: req.user._id,
        actorEmail: req.user.email,
        targetId: invite.userId,
        details: guestName,
      });

      return res.status(200).json({
        dejaPresent: false,
        markedAbsent: true,
        message: "Invité marqué comme absent",
        invite,
        type: "success",
      });
    }

    const dejaPresent = invite.status === 'P';

    if (!dejaPresent) {
      await Invite.updateOne(
        { _id: invite._id },
        { $set: { status: 'P' } }
      );
      invite.status = 'P';
      await writeAudit({
        action: 'presence',
        actorId: req.user._id,
        actorEmail: req.user.email,
        targetId: invite.userId,
        details: guestName,
      });
    }

    return res.status(200).json({
      dejaPresent,
      markedAbsent: false,
      message: dejaPresent
        ? "❗ Cet invité était déjà présent"
        : "✅ Présence enregistrée avec succès",
      invite,
      type: "success"
    });
  } catch (err) {
    console.error("Erreur serveur lors de l'enregistrement de la présence :", err);
    return res.status(500).json({ 
      message: "Erreur serveur : " + (err.message || "Erreur inconnue"),
      type: "danger",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


export default Presence;