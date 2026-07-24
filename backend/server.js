import cors from 'cors';
import dns from 'dns';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
const app = express();
import routes from "./Routes/Routes.js";
import uploadRoutes from './Routes/UploadPDF.js';
import uploadPdfMail from './Routes/UploadPdfMail.js';
const PORT = process.env.PORT || 5000;
import { fileURLToPath } from 'url';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Contourne les DNS locaux (VPN/réseau) qui refusent les requêtes SRV de Node
dns.setServers(['8.8.8.8', '1.1.1.1']);

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