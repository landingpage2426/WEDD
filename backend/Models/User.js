// const mongoose = require('mongoose');

// // Schéma User

// const userSchema = new mongoose.Schema({
//     nom: { type: String, required: true },
//     prenom: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     telephone: { type: String, required: true },
//     password: { type: String, required: true },
//     dateMariage: { type: Date, required: true },
//     lieuMariage: { type: String, required: true },
//     couleurSite: { type: String, required: true },
//     themeMariage: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);

// module.exports =  User



const mongoose = require('mongoose');

// Définition des rôles possibles dans l'application
const ROLES = ['admin', 'client', 'manager', 'chef_protocole', 'protocole'];

// Schéma User
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },
  password: { type: String, required: true },

  // Informations spécifiques au client (mariage)
  dateMariage: { type: Date },
  lieuMariage: { type: String },
  couleurSite: { type: String },
  themeMariage: { type: String },

  // Rôle de l'utilisateur
  role: { type: String, enum: ROLES, default: 'client' },

  // Référence au client qui a créé cet utilisateur (manager, protocole, etc.)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // Date de création du compte
  createdAt: { type: Date, default: Date.now }
});

// Relations / hiérarchie des rôles
// admin => voit tous les utilisateurs
// client => voit uniquement les utilisateurs créés par lui-même
// manager => gère et envoie les billets
// chef_protocole => voit les invités et réunions
// protocole => scanne uniquement les billets

const User = mongoose.model('User', userSchema);

module.exports = User;
