import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import alarm from '../assets/icons/alarm.svg';
import { FiBell } from 'react-icons/fi';
import { formatDate } from '../utils/FormatDate';
import FetchReunion from '../services/FetchReunion';
function Notification() {
  const { reunionsList, isLoading, error } = FetchReunion();
  
  return (
    <motion.div 
      className=""
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-full">
          <FiBell className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        {reunionsList.length > 0 && (
          <span className="ml-auto bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            {reunionsList.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      ) : reunionsList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune notification pour le moment
        </div>
      ) : (
        <motion.div 
          className="space-y-3 max-h-96 overflow-y-auto pr-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence>
            {reunionsList.map((reunion) => (
              <motion.div
                key={reunion._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                  to={`/reunion/${reunion._id}`}
                  className="flex items-start gap-4 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all border border-gray-200"
                >
                  <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                    <img src={alarm} alt="Alarme" className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{reunion.titre}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(reunion.dateHeure)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1 font-medium truncate">
                      {reunion.lieu}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {reunionsList.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-right">
          <Link 
            to="/liste-reunions" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
          >
            Voir toutes les réunions
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default Notification;