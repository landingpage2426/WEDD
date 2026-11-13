import User from '../../Models/User.js';
import { loginsForActors } from '../../services/loginHistory.js';

const LoginHistory = async (req, res) => {
  try {
    if (req.user.role !== 'client' && req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Accès refusé",
        type: 'danger',
      });
    }

    let actorIds = [req.user._id];
    if (req.user.role === 'client') {
      const staff = await User.find({ createdBy: req.user._id }).select('_id');
      actorIds = [req.user._id, ...staff.map((member) => member._id)];
    }

    if (req.user.role === 'admin') {
      const logs = await loginsForActors(
        (await User.find().select('_id')).map((user) => user._id)
      );
      return res.status(200).json({ logs });
    }

    const logs = await loginsForActors(actorIds);
    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Erreur historique de connexion :', error);
    return res.status(500).json({
      message: "Impossible de charger l'historique",
      type: 'danger',
    });
  }
};

export default LoginHistory;
