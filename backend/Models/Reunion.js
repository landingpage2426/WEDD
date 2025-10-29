import mongoose from 'mongoose';


// Schéma Réunion
const reunionSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    dateHeure: { type: Date, required: true },
    lieu: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});




const Reunion = mongoose.model('Reunion', reunionSchema);


export default Reunion