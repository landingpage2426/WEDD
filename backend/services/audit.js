import AuditLog from '../Models/AuditLog.js';

export const writeAudit = async (entry) => {
  try {
    await AuditLog.create({
      action: entry.action,
      actorId: entry.actorId ?? null,
      actorEmail: entry.actorEmail ?? null,
      targetId: entry.targetId ?? null,
      targetEmail: entry.targetEmail ?? null,
      details: entry.details ?? null,
    });
  } catch (error) {
    console.error('Journal non enregistré :', error.message);
  }
};
