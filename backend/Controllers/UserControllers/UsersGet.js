import AuditLog from "../../Models/AuditLog.js";
import Invite from "../../Models/Invite.js";
import User from "../../Models/User.js";

const UsersGet = async (req, res) => {
    try {
        const users = await User.find({})
            .select("-password -plainPassword")
            .populate("createdBy", "nom prenom email")
            .sort({ createdAt: -1 });

        const logs = await AuditLog.find({
            action: "login_success",
            actorId: { $in: users.map((user) => user._id) },
        })
            .sort({ createdAt: -1 })
            .select("actorId createdAt");

        const lastLogins = new Map();
        for (const log of logs) {
            const key = String(log.actorId);
            if (!lastLogins.has(key)) lastLogins.set(key, log.createdAt);
        }

        const inviteStats = await Invite.aggregate([
            {
                $group: {
                    _id: "$userId",
                    total: { $sum: 1 },
                    billetsEnvoyes: { $sum: { $cond: [{ $eq: ["$billetEnvoye", true] }, 1, 0] } },
                    presents: { $sum: { $cond: [{ $eq: ["$status", "P"] }, 1, 0] } },
                    absents: { $sum: { $cond: [{ $eq: ["$status", "A"] }, 1, 0] } },
                },
            },
        ]);
        const statsByUser = new Map(inviteStats.map((row) => [String(row._id), row]));

        res.status(200).json({
            message: "Utilisateurs récupérés avec succès",
            type: "success",
            users: users.map((user) => ({
                ...user.toObject(),
                actif: user.actif !== false,
                lastLogin: lastLogins.get(String(user._id)) || null,
                inviteStats: statsByUser.get(String(user._id)) || {
                    total: 0,
                    billetsEnvoyes: 0,
                    presents: 0,
                    absents: 0,
                },
            })),
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des Utilisateurs :", err);
        res.status(500).json({
            message: "Erreur lors de la récupération des Utilisateurs",
            type: "danger"
        });
    }
}


export default UsersGet;
