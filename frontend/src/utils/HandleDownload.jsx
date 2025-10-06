  import { generatePdf } from './GeneratePdf';
  export const handleDownload = async (inviteId,invites,setLoadingStates) => {
    setLoadingStates(prev => ({ ...prev, [inviteId]: 'pdf' }));
    const invite = invites.find(i => i._id === inviteId);
    const pdfBlob = await generatePdf(invite);
    if (pdfBlob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `Invitation_${invite.nom}_${invite.prenom}.pdf`;
      link.click();
    }
    setLoadingStates(prev => ({ ...prev, [inviteId]: null }));
  };