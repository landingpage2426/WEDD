import AuditLog from '../Models/AuditLog.js';

export const loginsForActors = (actorIds) =>
  AuditLog.find({
    action: { $in: ['login_success', 'login_failure'] },
    actorId: { $in: actorIds },
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
