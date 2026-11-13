import dns from 'dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = process.env.PORT || 5000;

mongoose.connection.on('error', (error) => {
  console.error('Erreur MongoDB :', error);
});

const startServer = async () => {
  if (!process.env.DB_URI) {
    console.error('DB_URI est manquant. Ajoute-le dans les variables d\'environnement Render.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 30000,
    });
    console.log('Connexion à la base de données réussie !');
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('Serveur à l\'écoute sur le port', PORT);
  });
};

startServer();
