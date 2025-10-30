import  SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

// Initialisez le client API avec votre clé
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Fonction qui remplace l'appel à transporter.sendMail() de Nodemailer
export async function sendEmailNotification(destinataire) {
  const now = new Date();
  const dateLocale = now.toLocaleDateString('fr-FR');
  const heureLocale = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

    // Définissez les options de l'e-mail
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = 'Connexion détectée à votre compte WEDD';
    sendSmtpEmail.htmlContent = `
      <p>Bonjour,</p>
      <p>Une connexion à votre compte WEDD a été détectée le <strong>${dateLocale}</strong> à <strong>${heureLocale}</strong>.</p>
      <p>Si ce n'était pas vous, changez votre mot de passe immédiatement.</p>
      <p>Cordialement,<br />L'équipe WEDD</p>
    `;
    sendSmtpEmail.sender = { 
        name: "WEDD SECURITE", 
        email: "contact.wedd@gmail.com" 
    };
    sendSmtpEmail.to = [{ email: destinataire }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('E-mail envoyé avec succès. ID du message:');
        return data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        throw new Error("Échec de l'envoi de l'e-mail en production.");
    }
}
