import mongoose from 'mongoose';

// Schéma Invité
const inviteSchema = new mongoose.Schema({
    
    inviteId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => Math.floor(100000 + Math.random() * 900000).toString()
    },
    image: { type: String },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    nomTable: { type: String },
    titre: {
    type: String,
    enum: ['M', 'Mme', 'Mlle', 'couple'],
    default: '' 
    },
    status: { 
        type: String, 
        required: true,
        enum: ['P', 'A'],
        default: 'A'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


const Invite = mongoose.model('Invite', inviteSchema);

export default  Invite 