import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavLink from '../components/NavLink';
import BlogRight from '../components/BlogRight';
import logo from "../assets/img/logo.png"
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Countdown from '../components/Countdown';

function AjoutInvite({ onClose }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email,setEmail] = useState('');
  const [nomTable, setNomTable] = useState('');
  const [titre, setTitre] = useState('');
  const [status, setStatus] = useState('A');
  const [image, setImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

const handleLogout = async () => {
    try {
      // Supprimer le token (localStorage ou sessionStorage selon ton app)
      localStorage.removeItem('token');

      // Appel de l'API de déconnexion (pas strictement nécessaire, mais bon pour les logs côté serveur)
      await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Redirection vers la page de connexion
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert("Erreur lors de la déconnexion");
    }
  }

  const handleSubmitInvite = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('nom', nom);
    formData.append('prenom', prenom);
    formData.append('telephone', telephone);
    formData.append('email', email);
    formData.append('nomTable', nomTable);
    formData.append('status', status);
    if (image) {
      formData.append('image', image);
    }

    const token = localStorage.getItem('token');

    const response = await axios.post(`${apiUrl}/api/invite`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    //console.log('Invité ajouté avec succès:', response.data);
    navigate('/dashboard');
    
    if (onClose) onClose();

  } catch (error) {
    if (error.response) {
      console.error('Erreur lors de l’ajout de l’invité:', error.response.data.message);
    } else {
      console.error('Erreur réseau ou autre:', error.message);
    }
  }

};

  return (
  
<div className="flex flex-col md:flex-row min-h-screen">
      
        <div className="hidden md:block md:w-64">
          <NavLink />
        </div>

        {/* ---- MOBILE HEADER + NAVIGATION ---- */}
        <header className="bg-gray-100 text-white w-full p-4 flex justify-between items-center md:hidden">
          <img src={logo} className="h-16 rounded-full" alt="logo-wedd" />
          <Countdown />   
          <button
            className="py-2 px-4 rounded-md bg-blue-700 hover:bg-blue-900 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
          ☰
          </button>
        </header>

        {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav 
            className="bg-gray-200 text-dark flex flex-col gap-4 p-4 w-full md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Dashboard</Link>
            <Link to="/liste-reunions" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Réunions</Link>
            <Link to="/ajout-invite" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Ajouter un invité</Link>
            <Link to="/recherche-invite" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Recherche invité</Link>
            <Link to="/profil" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Profil</Link>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-red-700 hover:text-red-700 text-left transition-colors">
              Déconnexion
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 sm:p-8">
  <motion.form
    onSubmit={handleSubmitInvite}
    className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-3xl"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Ajouter un invité</h2>
      <p className="text-gray-600">Renseignez les informations de votre invité</p>
    </div>

    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Civilité</label>
        <select
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionnez une civilité</option>
          <option value="M">Monsieur</option>
          <option value="Mme">Madame</option>
          <option value="Mlle">Mademoiselle</option>
          <option value="couple">Couple</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            placeholder="Dupont"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            placeholder="Jean"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">+237</span>
              </div>
              <input
                type="tel"
                placeholder="6 12 34 56 78"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
       <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="text"
            placeholder="contact@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Table attribuée</label>
        <input
          type="text"
          placeholder="Table 1"
          value={nomTable}
          onChange={(e) => setNomTable(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-blue-600"
              name="status"
              value="P"
              checked={status === "P"}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
            <span className="ml-2">Présent</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-red-600"
              name="status"
              value="A"
              checked={status === "A"}
              onChange={(e) => setStatus(e.target.value)}
            />
            <span className="ml-2">Absent</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optionnel)</label>
        <div className="flex items-center gap-4">
          <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500">{image?.name || "Aucun fichier sélectionné 'PNG, JPG (MAX. 2MB)'"}</p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files[0])} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      <motion.button
        type="submit"
        className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Sauvegarder l'invité
      </motion.button>
    </div>
  </motion.form>
</div>

      {/* ---- BLOGRIGHT (droite, desktop seulement) ---- */}
      <div className="hidden xl:block border-l border-gray-200 w-100">
        <BlogRight />
      </div>
    </div>
  );
}

export default AjoutInvite;
