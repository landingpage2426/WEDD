import Invite from "../../Models/Invite.js";

const DeleteInvite = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Invite.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Invité non trouvé',
                type: 'danger',
            });
        }

        res.status(200).json({
            message: 'Invité supprimé avec succès',
            type: 'success',
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'invité:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la suppression',
            type: 'danger',
        });
    }
}


export default DeleteInvite;