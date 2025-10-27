import  { useEffect, useState } from 'react';
import AjoutReunion from './AjoutReunion'; 
import ModifierReunion from './ModifierReunion';
import NavLink from '../components/NavLink';
import BlogRight from '../components/BlogRight';
import logo from "../assets/img/logo.png"
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PlanifierNotification from './PlanifierNotification';
import { AnimatePresence, motion } from 'framer-motion';
import Countdown from '../components/Countdown';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { atcb_action } from 'add-to-calendar-button-react';
import { FaCalendarPlus } from 'react-icons/fa';
function MesReunions() {
  const [reunionsList, setReunionsList] = useState([]);
  const [filteredReunions, setFilteredReunions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopupAjoutReunion, setShowPopupAjoutReunion] = useState(false);
  const [showPopupUpdateReunion, setShowPopupUpdateReunion] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [reunionToDelete, setReunionToDelete] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const apiUrl = import.meta.env.VITE_API_URL;

  // Définir en haut du composant
  
const reunions = async () => {
  try {
    const token = localStorage.getItem('token'); // ou sessionStorage

    const response = await axios.get(`${apiUrl}/api/reunions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true, // équivalent de credentials: 'include'
    });

    const data = response.data.reunions || [];
    //console.log('Réunions récupérées:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réunions:', error);
    return [];
  }
};
    
    const fetchReunions = async () => {
      const data = await reunions();
      setReunionsList(data);
      setFilteredReunions(data);

      data.forEach((reunion) => {
          PlanifierNotification(reunion); 
      });

    };

    // Lancer une fois au chargement
    useEffect(() => {
      fetchReunions();
    }, [location.pathname]);



  // Fonction pour gérer la recherche

  const handleSearch = () => {
    const filtered = reunionsList.filter(
      (reunion) =>
        reunion.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reunion.lieu.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredReunions(filtered);
  };




const handleDeleteReunion = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`${apiUrl}/api/delete-reunion/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      await fetchReunions(); // Recharge la liste après suppression
      setSuccessMessage('Réunion supprimée avec succès');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } else {
      alert('Erreur suppression');
    }
  } catch (err) {
    console.error(err);
    alert('Erreur suppression');
  }
};


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


function AjouterAuCalendrierIcon({ reunion }) {
  const handleClick = () => {
    atcb_action({
      name: reunion.titre,
      location: reunion.lieu,
      startDate: new Date(reunion.dateHeure).toISOString().split('T')[0],
      endDate: new Date(reunion.dateHeure).toISOString().split('T')[0],
      startTime: new Date(reunion.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(reunion.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      options: ['Apple', 'Google', 'iCal', 'Outlook.com', 'Yahoo'],
      description: `Réunion: ${reunion.titre} au ${reunion.lieu}`,
      timeZone: "Europe/Paris"
    });
  };

  return (
    <button onClick={handleClick} title="Ajouter au calendrier" className="text-blue-600 hover:text-blue-800 p-1">
      <FaCalendarPlus size={20} />
    </button>
  );
}

  return (
    <>
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

        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
  <motion.div 
    className="max-w-7xl mx-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center mb-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des réunions</h1>
      <p className="text-gray-600">Planifiez et organisez vos réunions pré-matrimoniales</p>
    </div>

    {/* Search and Filter Section */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
          <span className="sr-only">Trier</span>
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une réunion..."
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Rechercher
        </button>
      </div>
    </div>

    {/* Success Message */}
    <AnimatePresence>
      {successMessage && (
        <motion.div 
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>{successMessage}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Meetings Table */}
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Titre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Heure
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Lieu
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReunions && filteredReunions.length > 0 ? (
              filteredReunions.map((reunion) => (
                <tr key={reunion._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{reunion.titre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(reunion.dateHeure).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(reunion.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="max-w-xs truncate">{reunion.lieu}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReunion(reunion);
                          setShowPopupUpdateReunion(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Modifier"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setReunionToDelete(reunion._id);
                          setShowConfirmDelete(true);
                        }}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Supprimer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="inline-block w-6 h-6 overflow-hidden">
                         
                        <AjouterAuCalendrierIcon reunion={reunion} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Aucune réunion trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Add Meeting Button */}
    <div className="mt-8 flex justify-center">
      <motion.button
        onClick={() => setShowPopupAjoutReunion(true)}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Ajouter une réunion
      </motion.button>
    </div>

    {/* Popups */}
    {showPopupAjoutReunion && (
      <AjoutReunion 
        onClose={() => setShowPopupAjoutReunion(false)}  
        fetchReunions={fetchReunions}  
      />
    )}
    {showPopupUpdateReunion && selectedReunion && (
      <ModifierReunion
        reunion={selectedReunion}
        onClose={() => {
          setShowPopupUpdateReunion(false);
          setSelectedReunion(null);
        }}
      />
    )}
  </motion.div>
</div>
        {/* ---- BLOGRIGHT (droite, desktop seulement) ---- */}
      <div className="hidden xl:block border-l border-gray-200 w-100">
        <BlogRight />
      </div>
    </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">
              Es-tu sûr de vouloir supprimer cette réunion ?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  handleDeleteReunion(reunionToDelete);
                  setShowConfirmDelete(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Oui, supprimer
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MesReunions;