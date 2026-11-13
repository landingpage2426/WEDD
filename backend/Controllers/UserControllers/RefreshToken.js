import jwt from 'jsonwebtoken';
import User from '../../Models/User.js';

const ACCESS_MS = 15 * 60 * 1000;

const RefreshToken = async (req, res) => {
  const refreshToken = req.body?.refreshToken;
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Session expirée', type: 'danger' });
  }

  if (!secret) {
    return res.status(500).json({ message: 'JWT secret manquant', type: 'danger' });
  }

  try {
    const decoded = jwt.verify(refreshToken, secret);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Session expirée', type: 'danger' });
    }

    const user = await User.findById(decoded.userId).select('-password -plainPassword');
    if (!user) {
      return res.status(401).json({ message: 'Session expirée', type: 'danger' });
    }

    if (user.actif === false) {
      return res.status(403).json({
        message: 'Ce compte est désactivé',
        code: 'ACCOUNT_DISABLED',
        type: 'danger',
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      token,
      expiresIn: ACCESS_MS,
      type: 'success',
    });
  } catch (error) {
    return res.status(401).json({ message: 'Session expirée', type: 'danger' });
  }
};

export default RefreshToken;
