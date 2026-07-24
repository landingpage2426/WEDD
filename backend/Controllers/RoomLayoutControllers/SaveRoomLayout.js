import RoomLayout from "../../Models/RoomLayout.js";

const MIN_FLOOR = 10;

const normalizeDimension = (value, fallback = 50) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(MIN_FLOOR, Math.round(n));
};

const SaveRoomLayout = async (req, res) => {
    try {
        // Seuls les clients et les managers peuvent sauvegarder la disposition
        if (req.user.role !== 'client' && req.user.role !== 'manager') {
            return res.status(403).json({
                message: "Accès refusé : seuls les clients et les managers peuvent modifier la disposition de la salle",
                type: "danger"
            });
        }
        
        // Déterminer le userId : client ou client parent pour les managers
        let userId = req.user._id;
        if (req.user.role === 'manager' && req.user.createdBy) {
            userId = req.user.createdBy;
        }
        const { tables, colors, floorWidth, floorLength, floorSize } = req.body;

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

        // Compatibilité : si floorSize seul est envoyé, l'appliquer aux deux axes
        const width = normalizeDimension(
            floorWidth ?? floorSize,
            50
        );
        const length = normalizeDimension(
            floorLength ?? floorSize,
            50
        );

        // Chercher ou créer la disposition
        let roomLayout = await RoomLayout.findOne({ userId });

        if (roomLayout) {
            roomLayout.tables = tables;
            if (colors) {
                roomLayout.colors = colors;
            }
            roomLayout.floorWidth = width;
            roomLayout.floorLength = length;
            roomLayout.floorSize = Math.max(width, length);
            roomLayout.updatedAt = new Date();
            await roomLayout.save();
        } else {
            roomLayout = new RoomLayout({
                userId,
                tables,
                colors: colors || {
                    floor: '#e8e8e8',
                    table: '#FFA500',
                    chair: '#405433'
                },
                floorWidth: width,
                floorLength: length,
                floorSize: Math.max(width, length),
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
            type: "danger",
            error: err.message
        });
    }
};

export default SaveRoomLayout;
