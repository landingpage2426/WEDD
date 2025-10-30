import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import logo from "../assets/img/logo.png";

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebookF />, label: "Facebook", url: "#" },
    { icon: <FaInstagram />, label: "Instagram", url: "#" },
    { icon: <FaWhatsapp />, label: "WhatsApp", url: "https://wa.me/237687962949" }
  ];

  const contactInfos = [
    { icon: <FaEnvelope />, text: "contact.wedd25@gmail.com", url: "mailto:contact.wedd25@gmail.com" },
    { icon: <FaPhoneAlt />, text: "+237 6 87 96 29 49", url: "tel:+237687962949" },
    { icon: <FaMapMarkerAlt />, text: "Douala, Cameroun", url: "#" },
    { icon: <FaClock />, text: "Lun-Ven: 9h-18h", url: "#" }
  ];

  const footerLinks = [
    { title: "Services", links: [
      { name: "Sites vitrine", url: "#" },
      { name: "Boutiques e-commerce", url: "#" },
      { name: "Blogs personnels", url: "#" },
      { name: "Applications web", url: "#" }
    ]},
    { title: "À propos", links: [
      { name: "Notre équipe", url: "#" },
      { name: "Nos réalisations", url: "#" },
      { name: "Méthodologie", url: "#" },
      { name: "Témoignages", url: "#" }
    ]}
  ];

  return (
    <motion.footer 
      className="bg-white border-t border-gray-200 px-6 sm:px-12 py-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Colonne Logo + Description */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="logo" 
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-indigo-100"
              />
              <span className="text-xl font-bold text-gray-800">WEDD</span>
            </div>
            {/* Réseaux sociaux */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="text-gray-500 hover:text-indigo-600 text-xl transition-colors"
                  whileHover={{ y: -3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Colonnes de liens */}
          {footerLinks.map((column, colIndex) => (
            <motion.div
              key={colIndex}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + colIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-gray-900">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a 
                      href={link.url}
                      className="text-gray-600 hover:text-indigo-600 transition-colors flex items-start gap-2"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-indigo-400 text-xs mt-1.5">•</span>
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Colonne Contact */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <ul className="space-y-4">
              {contactInfos.map((info, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`text-indigo-500 mt-0.5 ${index === 3 ? 'text-sm' : ''}`}>
                    {info.icon}
                  </span>
                  <a 
                    href={info.url} 
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {info.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} WEDD. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;