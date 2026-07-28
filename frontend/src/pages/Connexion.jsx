import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import image_couple from '../assets/img/image_couple.jpg';
import logo from '../assets/img/logo.png';
import loadingImage from '../assets/img/load.png';
import Input from '../components/Input';
import Image from '../components/Image';
import Title from '../components/Title';
import { FaHeart, FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';

function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hearts, setHearts] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      const expiration = new Date().getTime() + data.expiresIn;

      localStorage.setItem('token', data.token);
      localStorage.setItem('tokenExpiration', expiration.toString());
      localStorage.setItem('user', JSON.stringify(data.user));

      // Rediriger selon le rôle
      const userRole = data.user.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('user');
        navigate('/login-page');
      }, data.expiresIn);

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Une erreur est survenue lors de la connexion');
      }
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
          <h2 className="text-4xl font-serif font-bold mb-2">Bienvenue</h2>
          <p className="text-xl font-light">Votre histoire commence ici</p>
        </motion.div>
      </motion.div>

      {/* Partie Formulaire */}
      <motion.div 
        className="flex w-full md:w-1/2 flex-col justify-center px-4 md:px-6 py-8 md:py-12 lg:px-8"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto w-full max-w-sm text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              alt="Logo"
              src={logo}
              className="mx-auto h-40 md:h-32 w-auto rounded-full mb-5"
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
              className="mt-6 md:mt-10 text-center md:text-3xl tracking-tight text-rose-800 font-serif"
            >
              CONNEXION À VOTRE ESPACE
            </Title>
            <div className="flex justify-center mt-4">
              <FaHeart className="text-pink-400 mx-1 animate-pulse" />
              <FaHeart className="text-pink-500 mx-1 animate-pulse delay-100" />
              <FaHeart className="text-rose-600 mx-1 animate-pulse delay-200" />
            </div>
          </motion.div>
        </div>

        <div className="mt-8 md:mt-10 mx-auto w-full max-w-sm">
          {error && (
            <motion.div 
              className="text-red-500 text-center mb-4 p-2 bg-red-100 rounded-md"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white bg-opacity-70 border-pink-200 focus:border-rose-400"
                />
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
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Mot de passe"
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <div className="mt-3 flex justify-end">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-rose-600 hover:text-rose-800 hover:underline underline-offset-8"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <button
                type="submit"
                className="flex w-full justify-center items-center rounded-md bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <img src={loadingImage} alt="Chargement" className="w-6 h-6 mr-2 animate-spin" />
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Se connecter <FaArrowRight className="ml-2" />
                  </span>
                )}
              </button>
            </motion.div>
          </form>

          <motion.p 
            className="mt-8 md:mt-10 text-center text-sm text-rose-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Vous n'avez pas de compte ?
            <Link
              to="/register-page"
              className="font-semibold ml-1 text-rose-600 hover:text-rose-800 hover:underline"
            >
              Créer un compte
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default Connexion;