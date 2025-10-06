import { generatePdf } from '../utils/GeneratePdf';
import axios from 'axios';

export const handleSendEmail = async (invite, apiUrl, setLoadingStates) => {
  try {
    setLoadingStates(prev => ({ ...prev, [invite._id]: 'email' }));

    // Générer le PDF côté frontend
    const pdfBlob = await generatePdf(invite);
    if (!pdfBlob) throw new Error("Erreur génération PDF");

    // Préparer FormData pour envoyer le PDF au backend
    const formData = new FormData();
    formData.append("email", invite.email);
    formData.append("subject", `Invitation pour ${invite.nom} ${invite.prenom}`);
    formData.append("text",  `Bonjour ${invite.prenom},\n\n` +
  `Nous avons le plaisir de vous inviter à notre mariage. Vous trouverez votre invitation en pièce jointe.\n\n` +
  `Merci de confirmer votre présence et nous espérons vous voir à cette occasion spéciale.\n\n` +
  `Cordialement,\n`);
    formData.append("pdf", pdfBlob, `Invitation-${invite.inviteId}.pdf`);

    // Envoyer au backend
    const response = await axios.post(`${apiUrl}/api/send-email`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert(response.data.message || "Email envoyé avec succès !");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || err.message || "Erreur lors de l'envoi de l'email");
  } finally {
    setLoadingStates(prev => ({ ...prev, [invite._id]: null }));
  }
};
