import User from '../../Models/User.js';
import { writeAudit } from '../../services/audit.js';

const SetStaffActive = async (req, res) => {
  const actif = req.body?.actif;

  if (req.user.role !== 'client') {
    return res.status(403).json({
      message: 'Seuls les clients peuvent activer ou désactiver leur équipe',
      type: 'danger',
    });
  }

  if (typeof actif !== 'boolean') {
    return res.status(400).json({
      message: 'Indiquez si le compte doit être actif',
      type: 'danger',
    });
  }

  try {
    const staff = await User.findById(req.params.userId);
    if (!staff || String(staff.createdBy || '') !== String(req.user._id)) {
      return res.status(404).json({
        message: 'Compte introuvable',
        type: 'danger',
      });
    }

    staff.actif = actif;
    await staff.save();

    await writeAudit({
      action: actif ? 'account_activated' : 'account_deactivated',
      actorId: req.user._id,
      actorEmail: req.user.email,
      targetId: staff._id,
      targetEmail: staff.email,
      details: actif ? 'Compte réactivé par le client' : 'Compte désactivé par le client',
    });

    return res.status(200).json({
      message: actif ? 'Compte activé' : 'Compte désactivé',
      actif,
      type: 'success',
    });
  } catch (error) {
    console.error('Erreur statut staff :', error);
    return res.status(500).json({
      message: 'Impossible de modifier le statut',
      type: 'danger',
    });
  }
};

export default SetStaffActive;
