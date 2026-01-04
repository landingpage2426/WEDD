import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NavLink from '../components/NavLink';
import BlogRight from '../components/BlogRight';
import { useLocation } from 'react-router-dom';
import Salle from '../components/Salle';
import Countdown from '../components/Countdown';
import logo from "../assets/img/logo.png";
import { AnimatePresence, motion } from 'framer-motion';
import { nomsTables } from '../utils/NomsTables';


function ShowInvite() {
  const location = useLocation();
  const state = location.state;
  const message = state?.message || null;
  const color = state?.color || "green";
  const [invite, setInvite] = useState(state?.invite || null);
  const [error, setError] = useState('');
  const [isDatePassed, setIsDatePassed] = useState(false);
  const { inviteId } = useParams();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [menuOpen, setMenuOpen] = useState(false);

  const getInvite = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/invites/${inviteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const data = response.data.invite || null;
      setInvite(data);
      setIsDatePassed(response.data.isDatePassed || false);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'invité:", error);
      if (error.response?.status === 403) {
        setError("⛔ Accès refusé : ce QR Code n'appartient pas à votre compte.");
      } else if (error.response?.status === 401) {
        setError("🔐 Veuillez vous connecter pour accéder à cette page.");
      } else {
        setError("❌ Une erreur est survenue.");
      }
    }
  };

  useEffect(() => {
    getInvite();
  }, [inviteId]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setNom(user.nom);
      setPrenom(user.prenom);
    }
  }, []);

  const handleRetour = () => {
    navigate('/recherche-invite');
  };

  const [clignoter, setClignoter] = useState(false);
  const [showSalle, setShowSalle] = useState(false);

  const handleVoirTable = () => {
    setClignoter(true);
    setShowSalle(true);
  };

  const handleClignotementFini = () => {
    setClignoter(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-pink-50 to-white">
      {/* Menu gauche */}
      <div className="hidden md:block w-1/5 bg-white shadow-lg">
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

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white shadow-xl p-6 md:p-10 rounded-2xl w-full max-w-lg text-center border border-pink-200 transform transition-all hover:shadow-2xl">
          {error ? (
            <div className={`p-4 rounded-lg ${error.includes('⛔') ? 'bg-red-50 border-l-4 border-red-500' : error.includes('🔐') ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'bg-gray-50 border-l-4 border-gray-500'}`}>
              <p className={`font-medium ${error.includes('⛔') ? 'text-red-700' : error.includes('🔐') ? 'text-yellow-700' : 'text-gray-700'}`}>
                {error}
              </p>
            </div>
          ) : invite ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-800">
                  Bienvenue au Mariage de {nom} {prenom}
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-pink-300 to-pink-500 mx-auto mb-4 rounded-full"></div>
                <p className="text-sm text-gray-500 tracking-wider">INVITATION #{invite.inviteId}</p>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-200 to-pink-100 blur-md opacity-75 -z-10 mx-auto w-32 h-32 md:w-40 md:h-40"></div>
                <img
                  src={`${apiUrl}/uploads/${invite.image}`}
                  alt={invite.nom + ' ' + invite.prenom}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${invite.nom} ${invite.prenom}&background=random`;
                  }}
                  className="mx-auto w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-md border-4 border-white"
                />
              </div>

              <div className="space-y-2 mb-6">
                <h2 className="text-xl font-medium text-gray-800">
                  {invite.nom} {invite.prenom}
                </h2>
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-bold text-pink-600">
                    Table {invite.nomTable}
                  </p>
                </div>
              </div>

              {isDatePassed && (
                <div className="p-4 rounded-lg mb-6 bg-red-50 border-2 border-red-300">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-lg font-bold text-red-700">
                      Billet non valide
                    </p>
                  </div>
                  <p className="text-sm text-red-600 text-center">
                    ⛔ Ce billet n'est plus valide. La date du mariage est déjà passée.
                  </p>
                </div>
              )}

              {message && (
                <div className={`p-3 rounded-lg mb-6 ${color === "red" ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  <p className={`text-sm ${color === "red" ? "text-red-700" : "text-green-700"}`}>
                    {message}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                { invite?.nomTable &&(
                  <button
                    onClick={handleVoirTable}
                    className="w-full py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Voir ma table
                  </button>
                )}

                {showSalle && (
                  <Salle
                    nbTables={24}
                    nbInvitesParTable={10}
                    nomsTables={nomsTables}
                    tableAClignoter={invite?.nomTable}
                    clignoter={clignoter}
                    onClignotementFini={handleClignotementFini}
                  />
                )}

                <button
                  onClick={handleRetour}
                  className="w-full py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour à la recherche
                </button>
              </div>

              <div className="mt-8">
                <svg
                  className="mx-auto w-8 h-8 text-pink-300 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-gray-600">Chargement de votre invitation...</p>
            </div>
          )}
        </div>
      </div>

      {/* Blog droit */}
      <div className="hidden xl:block border-l border-gray-200 w-100">
        <BlogRight />
      </div>
    </div>
  );
}

export default ShowInvite;