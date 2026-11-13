
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
    titleKey: "home.f1Title",
    descriptionKey: "home.f1Text",
    color: "text-rose-500"
  },
  {
    icon: <FiCheckCircle className="w-full h-full" />,
    titleKey: "home.f2Title",
    descriptionKey: "home.f2Text",
    color: "text-blue-500"
  },
  {
    icon: <FiLayout className="w-full h-full" />,
    titleKey: "home.f3Title",
    descriptionKey: "home.f3Text",
    color: "text-emerald-500"
  },
  {
    icon: <FiGift className="w-full h-full" />,
    titleKey: "home.f4Title",
    descriptionKey: "home.f4Text",
    color: "text-amber-500"
  },
  {
    icon: <FiMessageSquare className="w-full h-full" />,
    titleKey: "home.f5Title",
    descriptionKey: "home.f5Text",
    color: "text-purple-500"
  },
  {
    icon: <FiBarChart2 className="w-full h-full" />,
    titleKey: "home.f6Title",
    descriptionKey: "home.f6Text",
    color: "text-indigo-500"
  }
];