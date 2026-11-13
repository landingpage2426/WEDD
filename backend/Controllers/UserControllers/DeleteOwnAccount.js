import bcrypt from 'bcryptjs';
import Invite from '../../Models/Invite.js';
import Reunion from '../../Models/Reunion.js';
import RoomLayout from '../../Models/RoomLayout.js';
import User from '../../Models/User.js';
import { writeAudit } from '../../services/audit.js';

const DeleteOwnAccount = async (req, res) => {
  const { password } = req.body || {};

  if (!password) {
    return res.status(400).json({
      message: 'Confirmez avec votre mot de passe',
      type: 'danger',
    });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur non trouvé',
        type: 'danger',
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: 'Mot de passe incorrect',
        type: 'danger',
      });
    }

    await writeAudit({
      action: 'account_deleted',
      actorId: user._id,
      actorEmail: user.email,
      targetId: user._id,
      targetEmail: user.email,
      details: 'Suppression par le titulaire du compte',
    });

    if (user.role === 'client') {
      await Invite.deleteMany({ userId: user._id });
      await Reunion.deleteMany({ userId: user._id });
      await RoomLayout.deleteMany({ userId: user._id });
      await User.deleteMany({ createdBy: user._id });
    }

    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      message: 'Compte supprimé',
      deleted: true,
      type: 'success',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte :', error);
    return res.status(500).json({
      message: 'Impossible de supprimer le compte',
      type: 'danger',
    });
  }
};

export default DeleteOwnAccount;
