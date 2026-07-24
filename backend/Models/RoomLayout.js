import mongoose from 'mongoose';

// Schéma pour stocker la disposition de la salle par utilisateur
const roomLayoutSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true // Un seul layout par utilisateur
    },
    tables: [{
        nom: { type: String, required: true },
        x: { type: Number, required: true },
        z: { type: Number, required: true },
        rotation: { type: Number, default: 0 },
        w: { type: Number },
        h: { type: Number },
        nbChaises: { type: Number, default: 10 }
    }],
    colors: {
        floor: { type: String, default: '#e8e8e8' },
        table: { type: String, default: '#FFA500' },
        chair: { type: String, default: '#405433' }
    },
    // Dimensions du sol (largeur = X, longueur = Z)
    floorWidth: {
        type: Number,
        default: 50,
        min: 10
    },
    floorLength: {
        type: Number,
        default: 50,
        min: 10
    },
    // Ancien champ conservé pour compatibilité
    floorSize: {
        type: Number,
        default: 50
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Index pour améliorer les performances
roomLayoutSchema.index({ userId: 1 });

const RoomLayout = mongoose.model('RoomLayout', roomLayoutSchema);

export default RoomLayout;

