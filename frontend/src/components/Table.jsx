import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';
import { handleWhatsAppShare } from '../utils/HandleWhatsAppShare';
import { handleDownload } from '../utils/HandleDownload';
import { handleSendEmail } from '../utils/HandleSendEmail';
import { FiMail } from 'react-icons/fi';

function Table({ invites, apiUrl, onEditInvite, handleDeleteInvite }) {
  const [loadingStates, setLoadingStates] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
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
                              <p><span className="font-medium">Nom complet:</span> {invite.prenom || 'Non spécifié' } {invite.nom || 'Non spécifié'}</p>
                              <p><span className="font-medium">ID:</span> {invite.inviteId || 'Non spécifié'}</p>
                              <p><span className="font-medium">Téléphone:</span> +237 {invite.telephone || 'Non spécifié'}</p>
                              <p><span className="font-medium">Email:</span> {invite.email || "Non spécifié"}</p>
                              <p><span className="font-medium">Table:</span> {invite.nomTable || 'À définir'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleDownload(invite._id,invites,setLoadingStates)}
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
                                onClick={() => handleWhatsAppShare(invite,apiUrl,setLoadingStates)}
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
                              
                              <button
                                  onClick={() => handleSendEmail(invite, apiUrl, setLoadingStates)}
                                  disabled={loadingStates[invite._id] === 'email'}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                >
                                  {loadingStates[invite._id] === 'email' ? (
                                    <ImSpinner8 className="animate-spin mr-2" />
                                  ) : (
                                    <FiMail className="mr-2" />
                                  )}
                                  Envoyer Email
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