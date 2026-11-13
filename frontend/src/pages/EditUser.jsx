import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useI18n } from '../i18n/I18nContext';

function EditUser({ user, onClose,fetchUsers }) {
  const { t } = useI18n(); 
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateMariage, setDateMariage] = useState('');
  const [lieuMariage, setLieuMariage] = useState('');
  const [couleurSite, setCouleurSite] = useState('');
  const [themeMariage, setThemeMariage] = useState('');
  const [role, setRole] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user) {
      setNom(user.nom || '');
      setPrenom(user.prenom || '');
      setEmail(user.email || '');
      setTelephone(user.telephone || '');
      setDateMariage(user.dateMariage ? user.dateMariage.split('T')[0] : '');
      setLieuMariage(user.lieuMariage || '');
      setCouleurSite(user.couleurSite || '');
      setThemeMariage(user.themeMariage || '');
      setRole(user.role || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('nom', nom);
      formData.append('prenom', prenom);
      formData.append('email', email);
      formData.append('telephone', telephone);
      formData.append('dateMariage', dateMariage);
      formData.append('lieuMariage', lieuMariage);
      formData.append('couleurSite', couleurSite);
      formData.append('themeMariage', themeMariage);
      formData.append('role', role);
      
      const response = await axios.put(`${apiUrl}/api/edit-user/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        alert('Utilisateur mis à jour avec succès !');
        onClose();
        fetchUsers()
      } else {
        alert('Erreur lors de la modification');
      }
    } catch (err) {
      console.error('Erreur modification:', err);
      alert('Erreur lors de la modification');
    }
  };

  return (
    <div className="fixed inset-0 top-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh]">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5">
          <h2 className="text-white text-xl font-bold text-center">{t('staff.editTitle')}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('guest.lastName')}</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={t('guest.lastName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('guest.firstName')}</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder={t('guest.firstName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('guest.phone')}</label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder={t('guest.phone')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.date')}</label>
              <input
                type="date"
                value={dateMariage}
                onChange={(e) => setDateMariage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.place')}</label>
              <input
                type="text"
                value={lieuMariage}
                onChange={(e) => setLieuMariage(e.target.value)}
                placeholder={t('register.place')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.color')}</label>
              <input
                type="color"
                value={couleurSite}
                onChange={(e) => setCouleurSite(e.target.value)}
                placeholder="Couleur du site"
                className="w-full h-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('register.theme')}</label>
              <input
                type="text"
                value={themeMariage}
                onChange={(e) => setThemeMariage(e.target.value)}
                placeholder={t('register.theme')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.role')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Rôle"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="manager">Manager</option>
                <option value="chef_protocole">{t('role.chef_protocole')}</option>
                <option value="protocole">{t('role.protocole')}</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Sauvegarder
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
