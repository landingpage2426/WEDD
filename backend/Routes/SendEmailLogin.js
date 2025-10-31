
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// Création du transporteur SMTP Gmail
const transporter = nodemailer.createTransport({
  // host: 'smtp.gmail.com',
  service: 'gmail',
  // port: 465,      
  // secure: true,      
  auth: {
    user: process.env.EMAIL_USER,         
    pass: process.env.EMAIL_PASS, 
  },
});

// Fonction pour envoyer un email à une seule adresse
export async function sendEmailNotification(destinataire) {
  const now = new Date();
  const dateLocale = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const heureLocale = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, 
      to: destinataire,                         
      subject: 'Notification de connexion à votre compte WEDD',
      html: `
  <p>Bonjour,</p>

<p>Nous souhaitons vous informer qu'une connexion à votre compte WEDD a été détectée le <strong>${dateLocale}</strong> à <strong>${heureLocale}</strong>.</p>

<p>Si ce n'était pas vous, nous vous recommandons de vérifier la sécurité de votre compte en changeant votre mot de passe.</p>

<p>Nous restons à votre disposition pour toute assistance.</p>

<p>Cordialement,<br />L'équipe WEDD</p>
    `,
    });
    console.log('Email envoyé avec succès');
    return info;
  } catch (error) {
    console.error('Erreur lors de l’envoi de l’email:', error);
    throw error;
  }
}

