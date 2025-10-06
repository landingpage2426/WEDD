const cors = require('cors');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require("./Routes/Routes");
const uploadRoutes = require('./Routes/UploadPDF.js');
const uploadPdfMail = require('./Routes/UploadPdfMail.js');
// Liste des origines autorisées

const allowedOrigins = [
  "https://wedd-i8ls.onrender.com",  //ton front-end actuel
  "http://localhost:5173" // pour le dev local
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS bloqué pour l'origine :", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // pour gérer les requêtes préalables OPTIONS


// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données
mongoose.connect(process.env.DB_URI)
  .then(() => console.log("Connexion à la base de données réussie !"))
  .catch((error) => console.error("Erreur de connexion à la base de données :", error));

// Routes
app.use("/api", routes);
app.use('/uploads', express.static('uploads'));


// Servir les fichiers PDF statiquement depuis le dossier uploadPDF
app.use('/uploadPDF', express.static(path.join(__dirname, 'uploadPDF')));

app.use('/api/uploadPDF', uploadRoutes);

// Route pour envoyer le PDF et l'email
app.use('/api/send-email', uploadPdfMail);

// Lancement du serveur
app.listen(PORT, () => {
  console.log("Serveur à l'écoute sur le port", PORT);
});


// module.exports = app;