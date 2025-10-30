
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLoginEmail(email) {
    const now = new Date();
    const dateLocale = now.toLocaleDateString('fr-FR');
    const heureLocale = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });


    const { error } = await resend.emails.send({
        from: 'WEDD SECURITE <wedd@resend.dev>',
        to: email,
        subject: 'Connexion détectée à votre compte WEDD',
        html: `
      <p>Bonjour,</p>
      <p>Une connexion à votre compte WEDD a été détectée le <strong>${dateLocale}</strong> à <strong>${heureLocale}</strong>.</p>
      <p>Si ce n'était pas vous, changez votre mot de passe immédiatement.</p>
      <p>Cordialement,<br />L'équipe WEDD</p>
    `,
    });

    if (error) {
        console.error('Erreur Resend :', error);
    } else {
        console.log("Email envoyé avec succès");
    }
}
