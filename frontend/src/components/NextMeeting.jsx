import { motion } from 'framer-motion';
import Image from './Image';
import map from '../assets/icons/map.png';
import calendar from '../assets/icons/calendar.png';
import clock from '../assets/icons/clock.png';
import notification from '../assets/icons/notification.png';
import { Link } from 'react-router-dom';

function NextMeeting({ lastMeeting }) {
  if (!lastMeeting || lastMeeting.length === 0) {
    return (
      <motion.div 
        className="w-full max-w-md border-2 border-blue-200 rounded-xl p-6 bg-white shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <Image
              src={notification}
              className="w-6 h-6"
              alt="notification_icon"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Aucun évènement à venir</h2>
        </div>
        <p className="text-gray-500 pl-12">Aucune réunion planifiée pour le moment.</p>
      </motion.div>
    );
  }

  const reunion = lastMeeting[0];
  const dateObj = new Date(reunion.dateHeure);
  const date = dateObj.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  const heure = dateObj.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div
      className="w-full max-w-md rounded-xl bg-white shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-full">
          <Image
            src={notification}
            className="w-6 h-6"
            alt="notification_icon"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Prochain rendez-vous</h2>
      </div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-blue-600 mb-4">{reunion.titre}</h3>
        
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Image src={calendar} className="w-5 h-5" alt="calendar_icon" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-800">{date}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Image src={clock} className="w-5 h-5" alt="clock_icon" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Heure</p>
            <p className="font-medium text-blue-600">{heure}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Image src={map} className="w-5 h-5" alt="map_icon" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Lieu</p>
            <p className="font-medium text-gray-800 break-words">{reunion.lieu}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mt-6 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link to="/liste-reunions" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir tous les rendez-vous →
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default NextMeeting;