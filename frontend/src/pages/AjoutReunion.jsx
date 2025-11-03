
import React, { useState } from 'react';
import close from '../assets/icons/close-circle.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function AjoutReunion({ onClose, fetchReunions }) {
  const [titre, setTitre] = useState('');
  const [dateHeure, setDateHeure] = useState('');
  const [lieu, setLieu] = useState('');  
  const [successMessage, setSuccessMessage] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  
  
  const navigate = useNavigate();



const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${apiUrl}/api/reunion`,
      {
        titre,
        dateHeure,
        lieu,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
     setSuccessMessage('Réunion ajoutée avec succès');
    // Appelle la fonction pour rafraîchir la liste
      if (fetchReunions) fetchReunions();
      // Ferme la popup
      if (onClose) onClose();

      // Redirige vers la page liste
      navigate("/liste-reunions"); 
  } catch (error) {
    if (error.response) {
      console.error('Erreur lors de la création:', error.response.data.message);
    } else {
      console.error('Erreur réseau:', error.message);
    }
  }
};


  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative p-8 bg-white rounded-lg shadow-md text-center w-[350px]">
        <button onClick={onClose} className="absolute top-4 right-4">
          <img className="w-8 h-8" src={close} alt="close-circle" />
        </button>
        <h2 className="text-black mb-5 font-bold text-lg">Ajouter une réunion</h2>
        
           {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre"
            required
            className="w-full p-2 text-base border border-[#C6C6C6] rounded-2xl"
          />
          <input
            type="datetime-local"
            value={dateHeure}
            onChange={(e) => setDateHeure(e.target.value)}
            required
            className="w-full p-2 text-base border border-[#C6C6C6] rounded-2xl"
          />
          <input
            type="text"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            placeholder="Lieu"
            required
            className="w-full p-2 text-base border border-[#C6C6C6] rounded-2xl"
          />
          <button type="submit" className="bg-[#0066cc] font-bold text-white px-8 py-2 rounded text-base w-full mt-2">
            ENREGISTRER
          </button>
        </form>
      </div>
    </div>
  );
}

export default AjoutReunion;
