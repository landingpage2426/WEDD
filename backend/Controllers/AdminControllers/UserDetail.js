import AuditLog from '../../Models/AuditLog.js';
import Invite from '../../Models/Invite.js';
import Reunion from '../../Models/Reunion.js';
import User from '../../Models/User.js';
import { loginsForActors } from '../../services/loginHistory.js';

const UserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -plainPassword')
      .populate('createdBy', 'nom prenom email role');

    if (!user) {
      return res.status(404).json({ message: 'Compte introuvable', type: 'danger' });
    }

    const lastLogin = await AuditLog.findOne({
      action: 'login_success',
      actorId: user._id,
    }).sort({ createdAt: -1 });

    const payload = {
      user: {
        ...user.toObject(),
        actif: user.actif !== false,
        lastLogin: lastLogin?.createdAt || null,
      },
      invites: [],
      staff: [],
      reunions: 0,
      guestStats: { total: 0, billetsEnvoyes: 0, presents: 0, absents: 0 },
      logins: [],
    };

    if (user.role === 'client') {
      const [invites, staff, reunions] = await Promise.all([
        Invite.find({ userId: user._id })
          .select('nom prenom titre status billetEnvoye nomTable inviteId')
          .sort({ nom: 1 }),
        User.find({ createdBy: user._id })
          .select('nom prenom email role actif telephone')
          .sort({ nom: 1 }),
        Reunion.countDocuments({ userId: user._id }),
      ]);
      payload.invites = invites;
      payload.staff = staff.map((member) => ({
        ...member.toObject(),
        actif: member.actif !== false,
      }));
      payload.reunions = reunions;
      payload.guestStats = {
        total: invites.length,
        billetsEnvoyes: invites.filter((invite) => invite.billetEnvoye).length,
        presents: invites.filter((invite) => invite.status === 'P').length,
        absents: invites.filter((invite) => invite.status === 'A').length,
      };
      payload.logins = await loginsForActors([
        user._id,
        ...payload.staff.map((member) => member._id),
      ]);
    } else {
      payload.logins = await loginsForActors([user._id]);
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.error('Erreur fiche utilisateur :', error);
    return res.status(500).json({
      message: 'Impossible de charger ce compte',
      type: 'danger',
    });
  }
};

export default UserDetail;
