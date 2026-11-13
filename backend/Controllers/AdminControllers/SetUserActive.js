import User from '../../Models/User.js';
import { writeAudit } from '../../services/audit.js';

const SetUserActive = async (req, res) => {
  const actif = req.body?.actif;

  if (typeof actif !== 'boolean') {
    return res.status(400).json({
      message: 'Indiquez si le compte doit être actif',
      type: 'danger',
    });
  }

  if (req.user._id.toString() === req.params.id && actif === false) {
    return res.status(400).json({
      message: 'Vous ne pouvez pas désactiver votre propre compte',
      type: 'danger',
    });
  }

  try {
    const target = await User.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Compte introuvable', type: 'danger' });
    }

    target.actif = actif;
    await target.save();

    await writeAudit({
      action: actif ? 'account_activated' : 'account_deactivated',
      actorId: req.user._id,
      actorEmail: req.user.email,
      targetId: target._id,
      targetEmail: target.email,
      details: actif ? 'Compte réactivé' : 'Compte désactivé',
    });

    return res.status(200).json({
      message: actif ? 'Compte activé' : 'Compte désactivé',
      type: 'success',
      actif,
    });
  } catch (error) {
    console.error('Erreur changement de statut :', error);
    return res.status(500).json({
      message: 'Impossible de modifier le statut du compte',
      type: 'danger',
    });
  }
};

export default SetUserActive;
