import axios from 'axios';
import { clearSession } from '../utils/authSession';

  export const handleLogout = async (navigate) => {
    try {
      clearSession();
      await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      clearSession();
      navigate('/');
    }
  }