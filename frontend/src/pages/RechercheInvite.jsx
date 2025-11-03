
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlogRight from "../components/BlogRight";
import NavLink from "../components/NavLink";
import logo from "../assets/img/logo.png";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import { AnimatePresence, motion } from "framer-motion";
import Countdown from "../components/Countdown";

const RechercheInvite = () => {
  const [invitesList, setInvitesList] = useState([]);
  const [inputId, setInputId] = useState("");
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  //  Déconnexion
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      await axios.post(`${apiUrl}/api/logout`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      alert("Erreur lors de la déconnexion");
    }
  };

  //  Récupération des invités
  const invites = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/invites`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data.invites || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des Invités:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchInvites = async () => {
      const data = await invites();
      setInvitesList(data);
    };
    fetchInvites();
  }, []);



const handleSubmit = async (e) => {
  e.preventDefault();

  const found = invitesList.find(
    (invite) => String(invite.inviteId).trim() === inputId.trim()
  );

  if (!found) {
    setError({ text: "Identifiant inconnu", color: "red" });
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${apiUrl}/api/invites/${found.inviteId}/presence`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { dejaPresent, message, invite } = response.data;

    navigate(`/invites/${found.inviteId}`, {
      state: {
        invite,
        message,
        color: dejaPresent ? "red" : "green",
      },
    });
  } catch (err) {
    console.error("Erreur présence :", err);
    setError({ text: "Erreur lors de l'enregistrement de la présence.", color: "red" });
  }
};




const startScanner = () => {
  setError(null);
  setIsScanning(true);

  const html5QrCode = new Html5Qrcode("scanner");

  html5QrCode
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        html5QrCode.stop().then(async () => {
          setIsScanning(false);
          try {
            const url = new URL(decodedText);
            const inviteId = url.pathname.split("/").pop();
            const token = localStorage.getItem("token");

            // Étape 1 : Vérifier que l'invité appartient bien à l'utilisateur
            const getInviteResponse = await axios.get(`${apiUrl}/api/invites/${inviteId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            });

            const invite = getInviteResponse.data.invite;

            // ✅ Étape 2 : Marquer comme présent
            const response = await axios.post(
              `${apiUrl}/api/invites/${inviteId}/presence`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            const { dejaPresent, message } = response.data;

            // ✅ Redirection
            navigate(`/invites/${inviteId}`, {
              state: {
                invite,
                message,
                color: dejaPresent ? "red" : "green",
              },
            });

          } catch (err) {
            console.error("❌ Erreur lors du scan :", err);

            if (err.response?.status === 403) {
              setError({ text: "⛔ Ce QR Code ne vous appartient pas.", color: "red" });
            } else if (err.response?.status === 401) {
              setError({ text: "🔐 Vous devez être connecté pour scanner.", color: "red" });
            } else {
              setError({ text: "❌ QR Code invalide ou erreur serveur", color: "red" });
            }
          }
        });
      },
      (errorMessage) => {
        console.warn("Erreur scan :", errorMessage);
      }
    )
    .catch((err) => {
      console.error("Erreur démarrage scanner :", err);
      setIsScanning(false);
    });
};


  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      
        <div className="hidden md:block md:w-64">
          <NavLink />
        </div>

        {/* ---- MOBILE HEADER + NAVIGATION ---- */}
        <header className="bg-gray-100 text-white w-full p-4 flex justify-between items-center  md:hidden">
          <img src={logo} className="h-16 rounded-full" alt="logo-wedd" />
          <Countdown />   
          <button
            className="py-2 px-4 rounded-md bg-blue-700 hover:bg-blue-900 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
          ☰
          </button>
        </header>

        {/* Mobile Navigation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav 
            className="bg-gray-200 text-dark flex flex-col gap-4 p-4 w-full md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Dashboard</Link>
            <Link to="/liste-reunions" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Réunions</Link>
            <Link to="/ajout-invite" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Ajouter un invité</Link>
            <Link to="/recherche-invite" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Recherche invité</Link>
            <Link to="/profil" onClick={() => setMenuOpen(false)} className="hover:text-blue-200 transition-colors">Profil</Link>
            <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="text-red-700 hover:text-red-700 text-left transition-colors">
              Déconnexion
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ---- CONTENU PRINCIPAL ---- */}
      <div className="flex-1 bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white shadow-lg p-6 md:p-8 rounded-2xl w-full max-w-md flex flex-col items-center text-center">
          <h2 className="text-xl font-bold mb-6 text-black">Entrer l'identifiant de l'invité</h2>

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 mb-4">
              <input
                type="text"
                placeholder="Identifiant de l'invité"
                className="w-full p-3 text-base border border-[#C6C6C6] rounded-lg"
                value={inputId}
                onChange={(e) => {
                  setInputId(e.target.value);
                  setError(null);
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#016CEC] font-bold text-white px-6 py-3 rounded-lg hover:bg-[#0156BC]"
            >
              CHERCHER
            </button>
          </form>

          <button
            type="button"
            onClick={startScanner}
            className="mt-4 w-full bg-green-600 font-bold text-white px-6 py-3 rounded-lg hover:bg-green-800"
          >
            📷 Scanner un QR Code
          </button>

          {error && error.text && (
          <div className="mt-4">
            <span className={`font-bold ${error.color === "red" ? "text-red-600" : "text-green-600"}`}>
              {error.text}
            </span>
          </div>
)}


          {isScanning && (
            <div id="scanner" className="mt-6 w-full h-60 bg-gray-100 rounded-md shadow-inner" />
          )}
        </div>
      </div>

      {/* ---- NAV DROIT ---- */}
      <div className="hidden xl:block border-l border-gray-200 w-100">
        <BlogRight />
      </div>
    </div>
  );
};

export default RechercheInvite;
