import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  actorEmail: { type: String, default: null },
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  targetEmail: { type: String, default: null },
  details: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

auditLogSchema.index({ action: 1, actorId: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
