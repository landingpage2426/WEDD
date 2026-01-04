import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NavLink from '../components/NavLink';
import BlogRight from '../components/BlogRight';
import logo from "../assets/img/logo.png";
import { AnimatePresence, motion } from 'framer-motion';
import Countdown from '../components/Countdown';

function Administration() {
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'manager'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'manager'
  });
  const [regeneratingPassword, setRegeneratingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState({});
  
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      // Vérifier que l'utilisateur est un client
      if (user.role !== 'client') {
        navigate('/dashboard');
      }
    } else {
      navigate('/login-page');
    }
    fetchStaffUsers();
  }, []);

  const fetchStaffUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/staff-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setStaffUsers(response.data.users || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      if (error.response?.status === 403) {
        setError("Vous n'avez pas accès à cette page");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/api/staff-user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Utilisateur créé avec succès !');
      setNewUserInfo({
        nom: response.data.user.nom,
        prenom: response.data.user.prenom,
        email: response.data.user.email,
        password: response.data.password,
        role: response.data.user.role
      });
      setShowPasswordModal(true);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: 'manager'
      });
      setShowCreateForm(false);
      fetchStaffUsers();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(error.response?.data?.message || "Erreur lors de la création de l'utilisateur");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role
    });
    setShowEditForm(true);
    setNewPassword(null);
  };

  const handleRegeneratePassword = async () => {
    if (!editingUser) return;
    
    setRegeneratingPassword(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/api/staff-user/${editingUser._id}/regenerate-password`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setNewPassword(response.data.password);
      setSuccess('Nouveau mot de passe généré avec succès !');
      // Mettre à jour l'utilisateur dans la liste
      fetchStaffUsers();
    } catch (error) {
      console.error('Erreur lors de la régénération:', error);
      setError(error.response?.data?.message || "Erreur lors de la régénération du mot de passe");
    } finally {
      setRegeneratingPassword(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Ne envoyer que les champs qui ont été modifiés (non vides)
    const updatedData = {};
    if (editFormData.nom && editFormData.nom.trim() !== '') updatedData.nom = editFormData.nom.trim();
    if (editFormData.prenom && editFormData.prenom.trim() !== '') updatedData.prenom = editFormData.prenom.trim();
    if (editFormData.email && editFormData.email.trim() !== '') updatedData.email = editFormData.email.trim();
    if (editFormData.telephone && editFormData.telephone.trim() !== '') updatedData.telephone = editFormData.telephone.trim();
    if (editFormData.role && editFormData.role.trim() !== '') updatedData.role = editFormData.role.trim();

    // Vérifier qu'au moins un champ a été modifié
    if (Object.keys(updatedData).length === 0) {
      setError('Veuillez modifier au moins un champ');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiUrl}/api/staff-user/${editingUser._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Utilisateur modifié avec succès !');
      setShowEditForm(false);
      setEditingUser(null);
      fetchStaffUsers();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError(error.response?.data?.message || "Erreur lors de la modification de l'utilisateur");
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/staff-user/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Utilisateur supprimé avec succès !');
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      fetchStaffUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(error.response?.data?.message || "Erreur lors de la suppression de l'utilisateur");
      setShowDeleteConfirm(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      await axios.post(`${apiUrl}/api/logout`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papiers !');
  };

  const togglePasswordVisibility = (userId) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const maskPassword = (password) => {
    if (!password) return '••••••••';
    return '•'.repeat(password.length);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Menu gauche */}
      <div className="hidden md:block w-1/5 bg-white shadow-lg">
        <NavLink />
      </div>

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
            <Link to="/administration" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors font-bold">Administration</Link>
            <Link to="/profil" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Profil</Link>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-red-700 hover:text-red-700 text-left transition-colors">
              Déconnexion
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="flex-1 p-3 md:p-6 lg:p-8 bg-gray-50 overflow-x-auto min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Administration</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
            >
              {showCreateForm ? 'Annuler' : '+ Créer un utilisateur'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && !showPasswordModal && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Formulaire de création */}
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-white p-4 md:p-6 rounded-lg shadow-md"
            >
              <h2 className="text-lg md:text-xl font-semibold mb-4">Créer un nouvel utilisateur</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="manager">Manager</option>
                    <option value="chef_protocole">Chef Protocole</option>
                    <option value="protocole">Protocole</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Manager: Gère et envoie les billets | Chef Protocole: Voit les invités et réunions | Protocole: Scanne uniquement les billets
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
                >
                  Créer l'utilisateur
                </button>
              </form>
            </motion.div>
          )}

          {/* Formulaire d'édition */}
          {showEditForm && editingUser && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-white p-4 md:p-6 rounded-lg shadow-md"
            >
              <h2 className="text-lg md:text-xl font-semibold mb-4">Modifier l'utilisateur</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={editFormData.nom}
                      onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Laisser vide pour ne pas modifier"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={editFormData.prenom}
                      onChange={(e) => setEditFormData({ ...editFormData, prenom: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Laisser vide pour ne pas modifier"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Laisser vide pour ne pas modifier"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={editFormData.telephone}
                      onChange={(e) => setEditFormData({ ...editFormData, telephone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Laisser vide pour ne pas modifier"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Laisser vide pour ne pas modifier</option>
                    <option value="manager">Manager</option>
                    <option value="chef_protocole">Chef Protocole</option>
                    <option value="protocole">Protocole</option>
                  </select>
                </div>

                {/* Section régénération de mot de passe */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={handleRegeneratePassword}
                    disabled={regeneratingPassword}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {regeneratingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Génération...</span>
                      </>
                    ) : (
                      <>
                        <span>🔄</span>
                        <span>Régénérer le mot de passe</span>
                      </>
                    )}
                  </button>
                  {newPassword && (
                    <div className="mt-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 md:p-4">
                      <p className="text-xs md:text-sm text-gray-600 mb-2">⚠️ Nouveau mot de passe généré:</p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <p className="font-mono text-base md:text-lg font-bold text-gray-800 break-all">{newPassword}</p>
                        <button
                          onClick={() => copyToClipboard(newPassword)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded text-xs md:text-sm whitespace-nowrap"
                        >
                          📋 Copier
                        </button>
                      </div>
                      <p className="text-xs text-red-600 mt-2 font-semibold">
                        ⚠️ IMPORTANT: Notez ce mot de passe ! Il ne sera plus affiché après fermeture.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingUser(null);
                      setNewPassword(null);
                      setError('');
                    }}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Liste des utilisateurs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold">Utilisateurs créés</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
              </div>
            ) : staffUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Aucun utilisateur créé pour le moment.</p>
              </div>
            ) : (
              <>
                {/* Version Desktop - Tableau */}
                <div className="hidden md:block overflow-x-auto w-full">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mot de passe</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staffUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.telephone}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'chef_protocole' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'manager' ? 'Manager' :
                               user.role === 'chef_protocole' ? 'Chef Protocole' :
                               'Protocole'}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-mono text-gray-700 min-w-[80px] break-all">
                                {revealedPasswords[user._id] 
                                  ? (user.plainPassword || 'Non défini') 
                                  : maskPassword(user.plainPassword || '••••••••')}
                              </span>
                              {(user.plainPassword || user.plainPassword === '') && (
                                <>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      togglePasswordVisibility(user._id);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 whitespace-nowrap transition-colors cursor-pointer"
                                    title={revealedPasswords[user._id] ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                  >
                                    {revealedPasswords[user._id] ? '👁️ Masquer' : '👁️ Afficher'}
                                  </button>
                                  {user.plainPassword && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        copyToClipboard(user.plainPassword);
                                      }}
                                      className="text-green-600 hover:text-green-800 text-xs px-2 py-1 rounded border border-green-300 hover:bg-green-50 whitespace-nowrap transition-colors cursor-pointer"
                                      title="Copier le mot de passe"
                                    >
                                      📋 Copier
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 md:px-6 py-4 text-sm font-medium">
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50 whitespace-nowrap"
                              >
                                ✏️ Modifier
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
                                className="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-300 hover:bg-red-50 whitespace-nowrap"
                              >
                                🗑️ Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Version Mobile - Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                  {staffUsers.map((user) => (
                    <div key={user._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {user.prenom} {user.nom}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.telephone}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                          user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'chef_protocole' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'manager' ? 'Manager' :
                           user.role === 'chef_protocole' ? 'Chef Protocole' :
                           'Protocole'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Mot de passe:</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-mono text-gray-700 break-all">
                            {revealedPasswords[user._id] 
                              ? (user.plainPassword || 'Non défini') 
                              : maskPassword(user.plainPassword || '••••••••')}
                          </span>
                          {(user.plainPassword || user.plainPassword === '') && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  togglePasswordVisibility(user._id);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 transition-colors"
                                title={revealedPasswords[user._id] ? 'Masquer' : 'Afficher'}
                              >
                                {revealedPasswords[user._id] ? '👁️' : '👁️'}
                              </button>
                              {user.plainPassword && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    copyToClipboard(user.plainPassword);
                                  }}
                                  className="text-green-600 hover:text-green-800 text-xs px-2 py-1 rounded border border-green-300 hover:bg-green-50 transition-colors"
                                  title="Copier"
                                >
                                  📋
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                        <span>Créé le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="flex-1 text-blue-600 hover:text-blue-900 px-3 py-2 rounded border border-blue-300 hover:bg-blue-50 text-sm font-medium"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="flex-1 text-red-600 hover:text-red-900 px-3 py-2 rounded border border-red-300 hover:bg-red-50 text-sm font-medium"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Blog droit */}
      <div className="hidden xl:block border-l border-gray-200 w-100">
        <BlogRight />
      </div>

      {/* Modal pour afficher le mot de passe généré */}
      {showPasswordModal && newUserInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 md:p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-green-600">✅ Utilisateur créé avec succès !</h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Nom complet:</p>
                <p className="font-semibold text-sm md:text-base">{newUserInfo.prenom} {newUserInfo.nom}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Email:</p>
                <p className="font-semibold text-sm md:text-base break-all">{newUserInfo.email}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Rôle:</p>
                <p className="font-semibold capitalize text-sm md:text-base">{newUserInfo.role}</p>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 md:p-4">
                <p className="text-xs md:text-sm text-gray-600 mb-2">⚠️ Mot de passe généré:</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <p className="font-mono text-base md:text-lg font-bold text-gray-800 break-all">{newUserInfo.password}</p>
                  <button
                    onClick={() => copyToClipboard(newUserInfo.password)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded text-xs md:text-sm whitespace-nowrap"
                  >
                    📋 Copier
                  </button>
                </div>
                <p className="text-xs text-red-600 mt-2 font-semibold">
                  ⚠️ IMPORTANT: Notez ce mot de passe ! Il ne sera plus affiché.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setNewUserInfo(null);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 md:p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-lg md:text-xl font-bold mb-4 text-red-600">⚠️ Confirmer la suppression</h3>
            <p className="mb-6 text-sm md:text-base text-gray-700">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete.prenom} {userToDelete.nom}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                Supprimer
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Administration;
