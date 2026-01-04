import RoomLayout from "../../Models/RoomLayout.js";

const SaveRoomLayout = async (req, res) => {
    try {
        const userId = req.user._id;
        const { tables, colors } = req.body;

        if (!tables || !Array.isArray(tables)) {
            return res.status(400).json({
                message: "Les tables sont requises et doivent être un tableau",
                type: "danger"
            });
        }

        // Vérifier que chaque table a les propriétés requises
        for (const table of tables) {
            if (!table.nom || typeof table.x !== 'number' || typeof table.z !== 'number') {
                return res.status(400).json({
                    message: "Chaque table doit avoir un nom, x et z valides",
                    type: "danger"
                });
            }
        }

        // Chercher ou créer la disposition
        let roomLayout = await RoomLayout.findOne({ userId });

        if (roomLayout) {
            // Mettre à jour la disposition existante
            roomLayout.tables = tables;
            // Toujours mettre à jour les couleurs si elles sont fournies, sinon conserver les existantes
            if (colors) {
                roomLayout.colors = colors;
            }
            roomLayout.updatedAt = new Date();
            await roomLayout.save();
        } else {
            // Créer une nouvelle disposition
            roomLayout = new RoomLayout({
                userId,
                tables,
                colors: colors || {
                    floor: '#e8e8e8',
                    table: '#FFA500',
                    chair: '#405433'
                },
                updatedAt: new Date()
            });
            await roomLayout.save();
        }

        res.status(200).json({
            message: "Disposition de salle sauvegardée avec succès",
            type: "success",
            layout: roomLayout
        });
    } catch (err) {
        console.error("Erreur lors de la sauvegarde de la disposition :", err);
        res.status(500).json({
            message: "Erreur lors de la sauvegarde de la disposition",
            type: "danger"
        });
    }
};

export default SaveRoomLayout;

