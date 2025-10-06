import axios from 'axios';
import { generatePdf } from './GeneratePdf';

export const handleWhatsAppShare = async (invite,apiUrl,setLoadingStates) => {
    setLoadingStates(prev => ({ ...prev, [invite._id]: 'whatsapp' }));
    try {
      const pdfBlob = await generatePdf(invite);
      if (!pdfBlob) throw new Error('PDF non généré');
      
      const file = new File(
        [pdfBlob],
        `Billet_${invite.nom}_${invite.prenom}.pdf`,
        {
          type: 'application/pdf',
        },
      );

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${apiUrl}/api/uploadPDF`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const titleMap = {
        'M': `M. ${invite.prenom} ${invite.nom}`,
        'Mme': `Mme ${invite.prenom} ${invite.nom}`,
        'Mlle': `Mlle ${invite.prenom} ${invite.nom}`,
        'couple': `M. & Mme ${invite.nom}`
      };
      
      const fileUrl = response.data.url;
      const titreTexte = titleMap[invite.titre] || `${invite.prenom} ${invite.nom}`;
      const message = `💌 Bonjour ${titreTexte},\n\nC'est avec une immense joie que nous vous t'invitons à célébrer notre union 💍.\n\n📩 Clique sur le lien ci-dessous pour télécharger ton billet d'invitation personnalisé 🎟️ :\n ${fileUrl} \n\n Merci de le conserver précieusement et de le présenter à l'entrée le jour du mariage. Ta présence à nos côtés rendra ce moment encore plus beau et inoubliable 💖.\n\nNous avons hâte de partager avec toi cette journée remplie d'amour, de joie et d'émotions ✨.\n\nAvec toute notre affection,\nLes futurs mariés 💐`;

      window.open(`https://wa.me/237${invite.telephone}?text=${encodeURIComponent(message)}`, '_blank');
    } catch (error) {
      console.error('Erreur WhatsApp:', error);
      alert("Erreur lors du partage");
    } finally {
      setLoadingStates(prev => ({ ...prev, [invite._id]: null }));
    }
  };
