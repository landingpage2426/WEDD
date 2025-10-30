// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((error, success) => {
//     if (error) {
//         console.error('[SMTP TEST] Échec de la connexion SMTP :', error);
//     } else {
//         console.log('[SMTP TEST] Connexion SMTP réussie, prêt à envoyer des mails.');
//     }
// });

// console.log('[SMTP CONFIG] Utilisateur Gmail :', process.env.EMAIL_USER);


// export async function sendLoginEmail(email) {
//   const now = new Date();
//   const dateLocale = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
//   const heureLocale = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Notification de connexion à votre compte WEDD',
//     html: `
//       <p>Bonjour,</p>
//       <p>Nous souhaitons vous informer qu'une connexion à votre compte WEDD a été détectée le <strong>${dateLocale}</strong> à <strong>${heureLocale}</strong>.</p>
//       <p>Si ce n'était pas vous, nous vous recommandons de vérifier la sécurité de votre compte en changeant votre mot de passe.</p>
//       <p>Nous restons à votre disposition pour toute assistance.</p>
//       <p>Cordialement,<br />L'équipe WEDD</p>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Email envoyé avec succès");
//   } catch (error) {
//     console.error("Erreur lors de l'envoi de l'email :", error);
//   }
// }





import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Transporteur partagé avec pooling activé
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  pool: true,
  auth: {
    user: process.env.EMAIL_USER,       // Ton adresse Gmail
    pass: process.env.EMAIL_PASS,       // Mot de passe d'application Gmail
  },
});

// ✅ Vérification de la connexion SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error('[SMTP TEST] Échec de la connexion SMTP :', error);
  } else {
    console.log('[SMTP TEST] Connexion SMTP réussie, prêt à envoyer des mails.');
  }
});

console.log('[SMTP CONFIG] Utilisateur Gmail :', process.env.EMAIL_USER);

// ✅ Fonction d’envoi d’email
export async function sendLoginEmail(email) {
  const now = new Date();
  const dateLocale = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const heureLocale = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const mailOptions = {
    from: `"SUPPORT WEDD" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Notification de connexion à votre compte WEDD',
    text: `Bonjour,\n\nUne connexion à votre compte WEDD a été détectée le ${dateLocale} à ${heureLocale}.\n\nSi ce n'était pas vous, changez votre mot de passe.\n\nCordialement,\nL'équipe WEDD`,
    html: `
      <p>Bonjour,</p>
      <p>Nous souhaitons vous informer qu'une connexion à votre compte WEDD a été détectée le <strong>${dateLocale}</strong> à <strong>${heureLocale}</strong>.</p>
      <p>Si ce n'était pas vous, nous vous recommandons de vérifier la sécurité de votre compte en changeant votre mot de passe.</p>
      <p>Nous restons à votre disposition pour toute assistance.</p>
      <p>Cordialement,<br />L'équipe WEDD</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[MAIL] Email envoyé avec succès :', info.messageId);
  } catch (error) {
    console.error('[MAIL] Erreur lors de l\'envoi de l\'email :', error);
  }
}
