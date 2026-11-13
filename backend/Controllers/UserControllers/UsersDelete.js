import User from "../../Models/User.js";
import { writeAudit } from "../../services/audit.js";

const UsersDelete = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'utilisateur non trouvé',
                type: 'danger',
            });
        }

        await writeAudit({
            action: 'account_deleted',
            actorId: req.user?._id,
            actorEmail: req.user?.email,
            targetId: deleted._id,
            targetEmail: deleted.email,
            details: 'Suppression par un administrateur',
        });

        res.status(200).json({
            message: 'utilisateur supprimé avec succès',
            type: 'success',
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la suppression',
            type: 'danger',
        });
    }
}


export default UsersDelete;