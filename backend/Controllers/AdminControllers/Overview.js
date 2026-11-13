import Invite from '../../Models/Invite.js';
import User from '../../Models/User.js';

const ROLES = ['admin', 'client', 'manager', 'chef_protocole', 'protocole'];

const Overview = async (_req, res) => {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const roleCounts = await Promise.all(ROLES.map((role) => User.countDocuments({ role })));
    const roles = Object.fromEntries(ROLES.map((role, index) => [role, roleCounts[index]]));

    const [registrationsThisMonth, invites, billetsEnvoyes, presents, absents] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: monthStart } }),
      Invite.countDocuments(),
      Invite.countDocuments({ billetEnvoye: true }),
      Invite.countDocuments({ status: 'P' }),
      Invite.countDocuments({ status: 'A' }),
    ]);

    return res.status(200).json({
      roles,
      totalUsers: roleCounts.reduce((sum, count) => sum + count, 0),
      registrationsThisMonth,
      invites,
      billetsEnvoyes,
      presents,
      absents,
    });
  } catch (error) {
    console.error('Erreur vue d\'ensemble admin :', error);
    return res.status(500).json({
      message: 'Impossible de charger la vue d\'ensemble',
      type: 'danger',
    });
  }
};

export default Overview;
