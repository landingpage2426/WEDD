import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaEnvelope, FaLock, FaUser, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaPalette, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import image_couple from '../assets/img/image_couple.jpg';
import logo from '../assets/img/logo.png';
import Input from '../components/Input';
import Image from '../components/Image';
import Title from '../components/Title';

function Inscription() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState({ text: '', type: '' });
  const [hearts, setHearts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    dateMariage: '',
    lieuMariage: '',
    couleurSite: '#ff6b81',
    themeMariage: '',
  });

  // Animation de coeurs flottants
  const createHeart = (e) => {
    const newHeart = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 3 + 2
    };
    setHearts([...hearts, newHeart]);
    setTimeout(() => {
      setHearts(hearts.filter(h => h.id !== newHeart.id));
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setErrorMessage({
          text: 'Inscription réussie ! Redirection en cours...',
          type: 'success'
        });
        setTimeout(() => navigate('/login-page'), 2000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      setErrorMessage({
        text: error.response?.data?.message || 'Une erreur est survenue.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden"
      onClick={createHeart}
    >
      {/* Animation des coeurs */}
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-400 pointer-events-none"
          initial={{
            x: heart.x,
            y: heart.y,
            opacity: 1,
            scale: 0
          }}
          animate={{
            y: heart.y - 100,
            opacity: 0,
            scale: 1
          }}
          transition={{
            duration: heart.duration,
            ease: "easeOut"
          }}
          style={{
            fontSize: `${heart.size}px`
          }}
        >
          {Math.random() > 0.5 ? <FaHeart /> : <FiHeart />}
        </motion.div>
      ))}

      {/* Partie Image */}
      <motion.div 
        className="hidden md:block w-full md:w-1/2 h-96 md:h-full relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src={image_couple}
          alt="image_couple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/30 to-rose-600/20"></div>
        <motion.div 
          className="absolute bottom-8 left-8 text-white"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-4xl font-serif font-bold mb-2">Commencez votre histoire</h2>
          <p className="text-xl font-light">Créez votre site de mariage unique</p>
        </motion.div>
      </motion.div>

      {/* Partie Formulaire */}
      <motion.div 
        className="flex w-full md:w-1/2 flex-col justify-center px-4 md:px-6 py-8 md:py-12 lg:px-8 overflow-y-auto"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto w-full max-w-md text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              alt="Logo"
              src={logo}
              className="mx-auto h-40 md:h-32 w-auto rounded-full mt-32 mb-5"
            />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Title
              fontWeight="font-bold"
              fontSize="text-2xl"
              className="mt-4 md:mt-6 text-center md:text-3xl tracking-tight text-rose-800 font-serif"
            >
              CRÉEZ VOTRE ESPACE MARIAGE
            </Title>
            <div className="flex justify-center mt-2">
              <FaHeart className="text-pink-400 mx-1 animate-pulse" />
              <FaHeart className="text-pink-500 mx-1 animate-pulse delay-100" />
              <FaHeart className="text-rose-600 mx-1 animate-pulse delay-200" />
            </div>
          </motion.div>
        </div>

        {/* Affichage du message d'erreur ou de succès */}
        {errorMessage.text && (
          <motion.div 
            className={`my-4 p-3 rounded-lg text-center ${
              errorMessage.type === 'error' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-green-100 text-green-600'
            }`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {errorMessage.text}
          </motion.div>
        )}

        <div className="mt-4 md:mt-6 mx-auto w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                  <Input
                    width="w-full"
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    required={true}
                    value={formData.prenom}
                    onChange={handleChange}
                    className="pl-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                  <Input
                    width="w-full"
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    required={true}
                    value={formData.nom}
                    onChange={handleChange}
                    className="pl-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                  />
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                  <Input
                    width="w-full"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required={true}
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                  <Input
                    width="w-full"
                    type="tel"
                    name="telephone"
                    placeholder="Téléphone"
                    required={true}
                    value={formData.telephone}
                    onChange={handleChange}
                    className="pl-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                  />
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 z-10" />
                  <Input
                    width="w-full"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Mot de passe"
                    required={true}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-rose-600"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 z-10" />
                  <Input
                    width="w-full"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirmez le mot de passe"
                    required={true}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-rose-600"
                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                  <Input
                    width="w-full"
                    type="date"
                    name="dateMariage"
                    placeholder="Date de mariage"
                    required={true}
                    value={formData.dateMariage}
                    onChange={handleChange}
                    className="pl-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" />
                  <Input
                    width="w-full"
                    type="text"
                    name="lieuMariage"
                    placeholder="Lieu de mariage"
                    required={true}
                    value={formData.lieuMariage}
                    onChange={handleChange}
                    className="pl-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                  />
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-3"
              >
                <FaPalette className="text-pink-400" />
                <div className="flex-1">
                  <label className="block text-sm text-rose-800 mb-1">Couleur du site</label>
                  <input
                    type="color"
                    name="couleurSite"
                    value={formData.couleurSite}
                    onChange={handleChange}
                    className="w-full h-10 cursor-pointer rounded border-pink-200"
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Input
                  width="w-full"
                  type="text"
                  name="themeMariage"
                  placeholder="Thème du mariage"
                  required={true}
                  value={formData.themeMariage}
                  onChange={handleChange}
                  className="bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                />
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
            >
              <button
                type="submit"
                className="flex w-full justify-center items-center rounded-md bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Création en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Créer mon compte <FaArrowRight className="ml-2" />
                  </span>
                )}
              </button>
            </motion.div>
          </form>

          <motion.p 
            className="mt-4 md:mt-6 text-center text-sm text-rose-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Vous avez déjà un compte ?
            <Link
              to="/login-page"
              className="font-semibold ml-1 text-rose-600 hover:text-rose-800 hover:underline"
            >
              Connectez-vous
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default Inscription;