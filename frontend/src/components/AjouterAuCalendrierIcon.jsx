import { atcb_action } from 'add-to-calendar-button-react';
import { FaCalendarPlus } from 'react-icons/fa';

export default function AjouterAuCalendrierIcon({ reunion }) {
  const handleClick = () => {
    atcb_action({
      name: reunion.titre,
      location: reunion.lieu,
      startDate: new Date(reunion.dateHeure).toISOString().split('T')[0],
      endDate: new Date(reunion.dateHeure).toISOString().split('T')[0],
      startTime: new Date(reunion.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(reunion.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      options: ['Apple', 'Google', 'iCal', 'Outlook.com', 'Yahoo'],
      description: `Réunion: ${reunion.titre} au ${reunion.lieu}`,
      timeZone: "Europe/Paris"
    });
  };

  return (
    <button onClick={handleClick} title="Ajouter au calendrier" className="text-blue-600 hover:text-blue-800 p-1">
      <FaCalendarPlus size={20} />
    </button>
  );
}