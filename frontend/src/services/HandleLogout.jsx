import axios from 'axios';

  export const handleLogout = async (navigate) => {
      
    try {
      localStorage.removeItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert("Erreur lors de la déconnexion");
    }
  }