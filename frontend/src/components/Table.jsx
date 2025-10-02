import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiDownload, FiShare2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

function Table({ invites, apiUrl, onEditInvite, handleDeleteInvite }) {
  const [loadingStates, setLoadingStates] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);

  const generatePdf = async (invite) => {
    const apiUrlFrontend = 'https://wedd-i8ls.onrender.com';
    const imageUrl = 'assets/img/billet.png';
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'A4',
    });

    const loadImageAsBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        };
        img.onerror = () => reject("❌ Erreur de chargement de l'image");
        img.src = url;
      });
    };

    try {
      const backgroundBase64 = await loadImageAsBase64(imageUrl);
      doc.addImage(backgroundBase64, 'PNG', 0, 0, 210, 297);
      const qrText = `${apiUrlFrontend}/invites/${invite.inviteId}`;
      const qrImage = await QRCode.toDataURL(qrText);
      doc.addImage(qrImage, 'PNG', 150, 205, 40, 40);

      let titreTexte = '';
      switch (invite.titre) {
        case 'M':
          titreTexte = `M. ${invite.prenom} ${invite.nom}`;
          break;
        case 'Mme':
          titreTexte = `Mme ${invite.prenom} ${invite.nom}`;
          break;
        case 'Mlle':
          titreTexte = `Mlle ${invite.prenom} ${invite.nom}`;
          break;
        case 'couple':
          titreTexte = `M. & Mme ${invite.nom}`;
          break;
        default:
          titreTexte = `${invite.prenom} ${invite.nom}`;
      }

      doc.setTextColor(208, 108, 56);
      doc.setFont('times', 'bold');
      doc.setFontSize(28);
      const textWidth =
        (doc.getStringUnitWidth(titreTexte) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const maxWidth = 110;

      if (textWidth > maxWidth) {
        doc.text(titreTexte, 30, 220, {
          maxWidth: maxWidth,
          align: 'left',
        });
      } else {
        doc.text(titreTexte, 30, 230);
      }
      doc.setFontSize(12);
      doc.text(`ID : ${invite.inviteId}`, 170, 250, null, null, 'center');

      return doc.output('blob');
    } catch (err) {
      console.error('Erreur génération PDF avec image :', err);
      return null;
    }
  };

  const handleDownload = async (inviteId) => {
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

  const handleWhatsAppShare = async (invite) => {
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

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Invité
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                ID
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">
                Contact
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invites.length > 0 ? (
              invites.map((invite) => (
                <React.Fragment key={invite._id}>
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRowExpand(invite._id)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={`${apiUrl}/uploads/${invite.image}`}
                            alt={`${invite.nom} ${invite.prenom}`}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${invite.nom} ${invite.prenom}&background=random`;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {invite.prenom} {invite.nom}
                          </div>
                          <div className="text-sm text-gray-500 sm:hidden">
                            {invite.nomTable && `Table: ${invite.nomTable}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {invite.inviteId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      <div>+237 {invite.telephone}</div>
                      <div>{invite.nomTable && `Table ${invite.nomTable}`}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invite.status === 'P' 
                          ? 'bg-green-100 text-green-800' 
                          : invite.status === 'A' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {invite.status === 'P' ? 'Confirmé' : invite.status === 'A' ? 'Décliné' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditInvite(invite);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Modifier"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvite(invite._id);
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Supprimer"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedRow === invite._id && (
                    <motion.tr 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50"
                    >
                      <td colSpan="5" className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Détails de l'invité</h4>
                            <div className="text-sm text-gray-500 space-y-1">
                              <p><span className="font-medium">Titre:</span> {invite.titre || 'Non spécifié'}</p>
                              <p><span className="font-medium">Nom complet:</span> {invite.prenom} {invite.nom}</p>
                              <p><span className="font-medium">ID:</span> {invite.inviteId}</p>
                              <p><span className="font-medium">Téléphone:</span> +237 {invite.telephone}</p>
                              <p><span className="font-medium">Table:</span> {invite.nomTable || 'À définir'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleDownload(invite._id)}
                                disabled={loadingStates[invite._id]}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                {loadingStates[invite._id] === 'pdf' ? (
                                  <ImSpinner8 className="animate-spin mr-2" />
                                ) : (
                                  <FiDownload className="mr-2" />
                                )}
                                Télécharger PDF
                              </button>
                              <button
                                onClick={() => handleWhatsAppShare(invite)}
                                disabled={loadingStates[invite._id]}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                {loadingStates[invite._id] === 'whatsapp' ? (
                                  <ImSpinner8 className="animate-spin mr-2" />
                                ) : (
                                  <FaWhatsapp className="mr-2" />
                                )}
                                Envoyer par WhatsApp
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  Aucun invité trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;