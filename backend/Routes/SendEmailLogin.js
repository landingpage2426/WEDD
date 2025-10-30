// import nodemailer from "nodemailer";
// import dotenv from 'dotenv';
// dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS, 
//     },
    
//     tls: {
//         ciphers:'SSLv3' 
//     }
// });


// export async function sendLoginEmail(email) {
//   const now = new Date();
//   const dateLocale = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
//   const heureLocale = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Notification de connexion à votre compte Arkevia',
//     html: `
//       <p>Bonjour,</p>
//       <p>Nous vous informons qu'une connexion a eu lieu sur votre compte Arkevia le ${dateLocale} à ${heureLocale}.</p>
//       <p>Cordialement,<br />L'équipe Arkevia</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
//   console.log("email envoyé à " ,email );
  
// }



import  SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();
// 1. Initialisez le client API avec votre clé
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Fonction qui remplace l'appel à transporter.sendMail() de Nodemailer
export async function sendEmailNotification(destinataire, sujet, contenuHtml) {
    
    // 2. Définissez les options de l'e-mail
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = sujet;
    sendSmtpEmail.htmlContent = contenuHtml;
    sendSmtpEmail.sender = { 
        name: "Mon Application", 
        email: "berolbertindjomo@gmail.com" // IMPORTANT: utilisez une vraie adresse !
    };
    sendSmtpEmail.to = [{ email: destinataire }];

    try {
        // 3. Envoyez l'e-mail via l'API
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('E-mail envoyé avec succès. ID du message: ' + data.messageId);
        return data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail via Brevo:', error);
        throw new Error("Échec de l'envoi de l'e-mail en production.");
    }
}

// Exemple d'utilisation:
//  sendEmailNotification("berolbertindjomo@gmail.com", 'Bienvenue !', '<h1>Bonjour !</h1>');