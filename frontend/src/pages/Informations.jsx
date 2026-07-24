import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import NavLink from '../components/NavLink';
import BlogRight from '../components/BlogRight';
import logo from "../assets/img/logo.png"
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';

function Informations() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditSuccess, setIsEditSuccess] = useState(false);
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const isAdmin = userRole === 'admin';
  

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateMariage: '',
    lieuMariage: '',
    couleurSite: '',
    themeMariage: '',
    newPassword: '',
    confirmPassword: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;

const handleEditClick = async () => {
  if (!isEditing) {
    setIsEditing(true);
  } else {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `${apiUrl}/api/profil`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedUser = response.data;

      setFormData((prev) => ({
        ...prev,
        ...updatedUser.user,
      }));
      setIsEditing(false);
      setIsEditSuccess('Profil mis à jour avec succès');
      window.location.reload(); 
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  }
};



const handleEditPasswordClick = async () => {
  if (!isEditingPassword) {
    setIsEditingPassword(true);
  } else {
    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      alert('Tous les champs sont requis.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `${apiUrl}/api/profil-password`,
        {
          newPassword,
          confirmNewPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data;

      setIsPasswordSuccess(result.message || 'Mot de passe mis à jour avec succès');
      setIsEditingPassword(false);
      setFormData((prev) => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      alert(error.response?.data?.message || 'Erreur serveur inconnue');
    }
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



const getUser = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${apiUrl}/api/profil`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.user || {};
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des infos utilisateur :',
      error
    );
    return {};
  }
};

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role || '');
    }

    const fetchUser = async () => {
      const data = await getUser();
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (isEditSuccess) {
      const timer = setTimeout(() => {
        setIsEditSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isEditSuccess]);

  useEffect(() => {
    if (isPasswordSuccess) {
      const timer = setTimeout(() => {
        setIsPasswordSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPasswordSuccess]);


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

  return (
  <div className="flex flex-col md:flex-row min-h-screen">

    {/* Mobile Navigation */}
  <div className="hidden md:block md:w-64">
          <NavLink />
        </div>

        {/* ---- MOBILE HEADER + NAVIGATION ---- */}
        <header className="bg-gray-100 text-white w-full p-4 flex justify-between items-center md:hidden">
          <img src={logo} className="h-16 rounded-full" alt="logo-wedd" />
          {!isAdmin && <Countdown />}
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
            {isAdmin ? (
              <>
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:text-blue-700 transition-colors font-semibold">Gestion des utilisateurs</Link>
                <Link to="/profil" onClick={() => setMenuOpen(false)} className="hover:text-blue-700 transition-colors">Profil</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Dashboard</Link>
                <Link to="/liste-reunions" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Réunions</Link>
                <Link to="/ajout-invite" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Ajouter un invité</Link>
                <Link to="/recherche-invite" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Recherche invité</Link>
                <Link to="/profil" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Profil</Link>
              </>
            )}
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-red-700 hover:text-red-700 text-left transition-colors">
              Déconnexion
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
      

      <div className="flex flex-col bg-gray-50 items-center min-h-screen w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div className="w-full bg-white rounded-lg shadow-md p-6 sm:p-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
      Mes informations personnelles
    </h1>

    {isEditSuccess && (
      <div className="w-full bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-green-700 font-medium">Profil modifié avec succès!</span>
        </div>
      </div>
    )}

    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <Input
            width="w-full"
            type="text"
            name="nom"
            placeholder="Votre nom"
            required={true}
            value={formData.nom}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <Input
            width="w-full"
            type="text"
            name="prenom"
            placeholder="Votre prénom"
            required={true}
            value={formData.prenom}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            width="w-full"
            type="email"
            name="email"
            placeholder="Votre email"
            required={true}
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
          <Input
            width="w-full"
            type="tel"
            name="telephone"
            placeholder="Votre numéro de téléphone"
            required={true}
            value={formData.telephone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>

      {!isAdmin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de mariage</label>
              <Input
                width="w-full"
                type="date"
                name="dateMariage"
                required={true}
                value={
                  formData.dateMariage
                    ? new Date(formData.dateMariage).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleInputChange}
                disabled={!isEditing}
                className="disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de mariage</label>
              <Input
                width="w-full"
                type="text"
                name="lieuMariage"
                placeholder="Lieu du mariage"
                required={true}
                value={formData.lieuMariage}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur du site</label>
              <div className="flex items-center space-x-4">
                <Input
                  width="w-16"
                  type="color"
                  name="couleurSite"
                  required={true}
                  value={formData.couleurSite}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="disabled:opacity-50 h-10 w-16 cursor-pointer rounded border border-gray-300"
                />
                <span className="text-sm text-gray-500">{formData.couleurSite}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thème du mariage</label>
              <Input
                width="w-full"
                type="text"
                name="themeMariage"
                placeholder="Thème du mariage"
                required={true}
                value={formData.themeMariage}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </>
      )}

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-center">
          <button
            onClick={handleEditClick}
            className={`${isEditing ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 w-full sm:w-64`}
          >
            {isEditing ? 'Enregistrer les modifications' : 'Modifier mon profil'}
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-200">
        {isPasswordSuccess && (
          <div className="w-full bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 font-medium">Mot de passe modifié avec succès!</span>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Changer le mot de passe</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <div className="relative">
              <Input
                width="w-full"
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                placeholder="*****"
                required={true}
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={!isEditingPassword}
                className="disabled:bg-gray-50 disabled:text-gray-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <div className="relative">
              <Input
                width="w-full"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="*****"
                required={true}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={!isEditingPassword}
                className="disabled:bg-gray-50 disabled:text-gray-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleEditPasswordClick}
            className={`${isEditingPassword ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 w-full sm:w-64`}
          >
            {isEditingPassword ? 'Enregistrer le mot de passe' : 'Modifier mon mot de passe'}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  {/* ---- BLOGRIGHT (droite, desktop seulement) ---- */}
      <div className="hidden xl:block border-l border-gray-200 w-100">
        <BlogRight />
      </div>    </div>
  );
}

export default Informations;
