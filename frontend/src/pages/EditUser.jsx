import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditUser({ user, onClose,fetchUsers }) { 
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
          <h2 className="text-white text-xl font-bold text-center">Modifier l'utilisateur</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Téléphone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Mariage</label>
              <input
                type="date"
                value={dateMariage}
                onChange={(e) => setDateMariage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu Mariage</label>
              <input
                type="text"
                value={lieuMariage}
                onChange={(e) => setLieuMariage(e.target.value)}
                placeholder="Lieu Mariage"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couleur du site</label>
              <input
                type="color"
                value={couleurSite}
                onChange={(e) => setCouleurSite(e.target.value)}
                placeholder="Couleur du site"
                className="w-full h-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thème Mariage</label>
              <input
                type="text"
                value={themeMariage}
                onChange={(e) => setThemeMariage(e.target.value)}
                placeholder="Thème Mariage"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Rôle"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="manager">Manager</option>
                <option value="chef_protocole">Chef protocole</option>
                <option value="protocole">Protocole</option>
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
