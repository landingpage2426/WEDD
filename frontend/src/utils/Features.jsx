
import { 
  FiCheckCircle, 
  FiUserCheck, 
  FiLayout,
  FiGift,
  FiMessageSquare,
  FiBarChart2
} from 'react-icons/fi';


export const features = [
  {
    icon: <FiUserCheck className="w-full h-full" />,
    title: "Billets numériques personnalisés",
    description: "Chaque invité reçoit un billet PDF élégant avec son nom, statut et numéro de table, directement envoyé par email.",
    color: "text-rose-500"
  },
  {
    icon: <FiCheckCircle className="w-full h-full" />,
    title: "QR Code unique et sécurisé",
    description: "Système de check-in ultra rapide avec QR code individuel pour une gestion fluide des entrées.",
    color: "text-blue-500"
  },
  {
    icon: <FiLayout className="w-full h-full" />,
    title: "Plan de salle intelligent",
    description: "Générez et modifiez facilement votre plan de table avec notre outil visuel intuitif et dynamique.",
    color: "text-emerald-500"
  },
  {
    icon: <FiGift className="w-full h-full" />,
    title: "Gestion de liste de mariage",
    description: "Plateforme intégrée pour votre liste de cadeaux avec suivi en temps réel des réservations.",
    color: "text-amber-500"
  },
  {
    icon: <FiMessageSquare className="w-full h-full" />,
    title: "Messagerie aux invités",
    description: "Envoyez des rappels et informations importantes via SMS ou email à tous vos invités en un clic.",
    color: "text-purple-500"
  },
  {
    icon: <FiBarChart2 className="w-full h-full" />,
    title: "Tableau de bord complet",
    description: "Suivez en temps réel les confirmations, régimes alimentaires et autres informations cruciales.",
    color: "text-indigo-500"
  }
];