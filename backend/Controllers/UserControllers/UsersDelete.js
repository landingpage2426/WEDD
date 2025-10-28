import User from "../../Models/User.js";

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