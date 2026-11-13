import AuditLog from '../../Models/AuditLog.js';

const ACTIONS = [
  'login_success',
  'login_failure',
  'account_activated',
  'account_deactivated',
  'account_deleted',
  'password_reset',
  'password_changed',
  'presence',
  'billet_envoye',
];

const ListAudit = async (req, res) => {
  try {
    const action = typeof req.query.action === 'string' ? req.query.action : '';
    const filter = ACTIONS.includes(action) ? { action } : {};
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Erreur journal :', error);
    return res.status(500).json({
      message: 'Impossible de charger le journal',
      type: 'danger',
    });
  }
};

export default ListAudit;
