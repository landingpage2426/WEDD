import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CountDownHook from '../hooks/CountDownHook.jsx';
function Countdown() {

  const { timeLeft, setFormData } = CountDownHook();
  const apiUrl = import.meta.env.VITE_API_URL;

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
        error,
      );
      return {};
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser();
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    };
    fetchUser();
  }, []);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center mx-2">
        <motion.span
          className="text-xl md:text-2xl font-bold text-blue-700"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={timeLeft[interval]}
        >
          {timeLeft[interval]}
        </motion.span>
        <span className="text-xs text-blue-900 capitalize">{interval}</span>
      </div>
    );
  });
  return (
    <div>
      {Object.keys(timeLeft).length ? (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {timerComponents}
        </motion.div>
      ) : (
        <motion.div
          className="text-xl font-bold text-pink-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Le grand jour est arrivé !
        </motion.div>
      )}
    </div>
  );
}

export default Countdown;
