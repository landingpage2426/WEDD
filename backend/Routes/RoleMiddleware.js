// Middleware pour vérifier les rôles des utilisateurs

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Non autorisé",
        type: "danger"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Accès refusé : vous n'avez pas les permissions nécessaires",
        type: "danger"
      });
    }

    next();
  };
};

// Middleware pour vérifier que l'utilisateur est un client
export const requireClient = requireRole('client');

// Middleware pour vérifier que l'utilisateur est un manager
export const requireManager = requireRole('manager', 'client');

// Middleware pour vérifier que l'utilisateur est chef_protocole ou client
export const requireChefProtocole = requireRole('chef_protocole', 'client');

// Middleware pour vérifier que l'utilisateur est protocole, chef_protocole ou client
export const requireProtocole = requireRole('protocole', 'chef_protocole', 'client');

