import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import NavLink from './../components/NavLink';
import Table from '../components/Table';
import Graphe from '../components/Graphe';
import Bouton from '../components/Bouton';
import tri from '../assets/icons/tri.svg';
import NextMeeting from '../components/NextMeeting';
import BlogRight from '../components/BlogRight';
import ModifierInvite from './ModifierInvite';
import logo from "../assets/img/logo.png";
import Countdown from '../components/Countdown';
function Dashboard() {
  const [invitesList, setInvitesList] = useState([]);
  const [reunionsList, setReunionsList] = useState([]);
  const [filteredInvites, setFilteredInvites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [user, setUser] = useState();
  const [successMessage, setSuccessMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopupUpdateInvite, setShowPopupUpdateInvite] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [inviteToDelete, setInviteToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      await axios.post(`${apiUrl}/api/logout`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert("Erreur lors de la déconnexion");
    }
  }

  const fetchInvites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/invites`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      const data = response.data.invites || [];
      setInvitesList(data);
      setFilteredInvites(data);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Token invalide ou expiré
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
        return;
      }
      console.error('Erreur lors de la récupération des Invités:', error);
    }
  };

  const fetchReunions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/reunions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setReunionsList(response.data.reunions || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des réunions:', error);
    }
  };

  useEffect(() => {
    fetchInvites();
    fetchReunions();

    const userString = localStorage.getItem('user');

    if (userString) {
      const user = JSON.parse(userString);
      setNom(user.nom);
      setPrenom(user.prenom);
      setUser(user);
    }
  }, [location.pathname]);

  const handleSearch = () => {
    const filtered = invitesList.filter(
      (invite) =>
        invite.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invite.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invite.nomTable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invite.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invite.inviteId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvites(filtered);
  };

  const handleDeleteInvite = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/delete-invite/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      await fetchInvites();
      setSuccessMessage('Invité supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
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

      <div className="flex flex-col md:flex-row">
        {/* Desktop Navigation */}
        <div className="hidden md:block md:w-64">
          <NavLink />
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
          {/* Welcome Section */}
          <section className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-semibold text-gray-800">
                Salut <span className="text-blue-600">{prenom} {nom}</span>
              </h1>
              <p className="text-gray-600">Un mariage inoubliable vous attend 🎉</p>
            </div>
            <div className="flex flex-col  md:flex-row md:w-auto gap-4">
              {user?.role === "admin" && (<Link to={"/admin"} className="flex items-center justify-center  w-full p-6 text-lg font-bold text-gray-700 bg-green-500 border-2 border-gray-600 rounded-lg w-25 h-12  sm:mx-6 cursor-pointer">
                Admin
              </Link>)}
              <Link to="/salle/edit" className="w-full flex  md:w-auto">
                <Bouton
                  width="w-full md:w-48"
                  height="h-auto"
                  bg="bg-purple-600 hover:bg-purple-700"
                  color="text-white"
                  fontSize="text-base"
                  rounded="rounded-lg"
                  shadow="shadow hover:shadow-md"
                >
                  Disposer la salle
                </Bouton>
              </Link>
              <Link to="/ajout-invite" className="w-full flex  md:w-auto">
                <Bouton
                  width="w-full md:w-48"
                  height="h-auto"
                  bg="bg-blue-600 hover:bg-blue-700"
                  color="text-white"
                  fontSize="text-base"
                  rounded="rounded-lg"
                  shadow="shadow hover:shadow-md"
                >
                  Ajouter un invité
                </Bouton>
              </Link></div>
          </section>

          {/* Stats Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <NextMeeting lastMeeting={reunionsList} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <Graphe invites={invitesList} />
            </div>
          </section>

          {/* Search Section */}
          <section className="mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <img src={tri} alt="Trier" className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">Trier</span>
              </div>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un invité..."
                />
                <button
                  className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors w-full md:w-auto"
                  onClick={handleSearch}
                >
                  Rechercher
                </button>
              </div>
            </div>
          </section>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {successMessage}
            </motion.div>
          )}

          {/* Table Section */}
          <section className="mb-8 overflow-x-auto">
            <div className="bg-white rounded-xl shadow-sm">
              <Table
                handleDeleteInvite={(id) => {
                  setInviteToDelete(id);
                  setShowConfirmDelete(true);
                }}
                apiUrl={apiUrl}
                invites={filteredInvites}
                onEditInvite={(invite) => {
                  setSelectedInvite(invite);
                  setShowPopupUpdateInvite(true);
                }}
              />
            </div>
          </section>

          {/* Add Invite Button */}
          <section className="text-center">
            <Link to="/ajout-invite">
              <Bouton
                width="w-full md:w-48"
                height="h-auto"
                bg="bg-blue-600 hover:bg-blue-700"
                color="text-white"
                fontSize="text-base"
                rounded="rounded-lg"
                shadow="shadow hover:shadow-md"
              >
                Ajouter un invité
              </Bouton>
            </Link>
          </section>
        </main>

        {/* Right Sidebar (Desktop only) */}
        <aside className="hidden xl:block border-l border-gray-200 w-100">
          <BlogRight />
        </aside>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPopupUpdateInvite && selectedInvite && (
          <ModifierInvite
            invite={selectedInvite}
            onClose={() => {
              setShowPopupUpdateInvite(false);
              setSelectedInvite(null);
              fetchInvites();
            }}
          />
        )}

        {showConfirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-lg font-bold mb-4 text-gray-800">Confirmer la suppression</h2>
              <p className="mb-6 text-gray-600">Êtes-vous sûr de vouloir supprimer cet invité ?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    handleDeleteInvite(inviteToDelete);
                    setShowConfirmDelete(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;