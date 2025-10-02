import Reunion from "../../Models/Reunion.js";

const DeleteReunion = async (req, res) => {
  const { reunionId } = req.params;

  try {
    const deleted = await Reunion.findByIdAndDelete(reunionId);

    if (!deleted) {
      return res.status(404).json({
        message: 'Réunion non trouvée',
        type: 'danger',
      });
    }

    res.status(200).json({
      message: 'Réunion supprimée avec succès',
      type: 'success',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réunion:', error);
    res.status(500).json({
      message: 'Erreur serveur lors de la suppression',
      type: 'danger',
    });
  }
};


export default DeleteReunion;