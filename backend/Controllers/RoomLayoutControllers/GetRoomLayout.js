import RoomLayout from "../../Models/RoomLayout.js";

const GetRoomLayout = async (req, res) => {
    try {
        const userId = req.user._id;

        // Chercher la disposition de l'utilisateur
        let roomLayout = await RoomLayout.findOne({ userId });

        // Si aucune disposition n'existe, créer une avec les valeurs par défaut
        if (!roomLayout) {
            // Utiliser les valeurs par défaut de planTables
            const defaultTables = [
                { nom: "TABLE MARIES", x: -16, z: 0, w: 1.5, h: 5, rotation: Math.PI / 2, nbChaises: 10 },
                { nom: "B737", x: 15, z: 20, nbChaises: 10 },
                { nom: "EMBRAER170", x: 15, z: 15, nbChaises: 10 },
                { nom: "AN124", x: 10, z: 20, nbChaises: 10 },
                { nom: "EMBRAER190", x: 15, z: 10, nbChaises: 10 },
                { nom: "A340", x: -5, z: 6, nbChaises: 10 },
                { nom: "B717", x: 10, z: 15, nbChaises: 10 },
                { nom: "AN225", x: 15, z: 5, nbChaises: 10 },
                { nom: "BUFFET 2", x: -16, z: 20, nbChaises: 10 },
                { nom: "B777", x: -10, z: 6, nbChaises: 10 },
                { nom: "B747", x: -10, z: -6, nbChaises: 10 },
                { nom: "A350", x: -5, z: -6, nbChaises: 10 },
                { nom: "A320NEO", x: -5, z: 13, nbChaises: 10 },
                { nom: "A380", x: -5, z: -13, nbChaises: 10 },
                { nom: "A300", x: 0, z: -6, nbChaises: 10 },
                { nom: "B787", x: -10, z: 20, nbChaises: 10 },
                { nom: "CJR1000", x: -10, z: -20, nbChaises: 10 },
                { nom: "B767", x: -10, z: 13, nbChaises: 10 },
                { nom: "CJR700", x: -10, z: -13, nbChaises: 10 },
                { nom: "BUFFET 1", x: 15, z: -6, nbChaises: 10 },
                { nom: "A320", x: 0, z: -20, nbChaises: 10 },
                { nom: "B707", x: 5, z: -20, nbChaises: 10 },
                { nom: "A310", x: 0, z: -13, nbChaises: 10 },
                { nom: "B727", x: 5, z: -13, nbChaises: 10 },
                { nom: "TUPOLEV144", x: -5, z: 20, nbChaises: 10 },
                { nom: "A330", x: -5, z: -20, nbChaises: 10 },
                { nom: "CONCORDE", x: 5, z: -6, nbChaises: 10 },
            ];

            roomLayout = new RoomLayout({
                userId,
                tables: defaultTables
            });
            await roomLayout.save();
        }

        res.status(200).json({
            message: "Disposition de salle récupérée avec succès",
            type: "success",
            layout: roomLayout
        });
    } catch (err) {
        console.error("Erreur lors de la récupération de la disposition :", err);
        res.status(500).json({
            message: "Erreur lors de la récupération de la disposition",
            type: "danger"
        });
    }
};

export default GetRoomLayout;

