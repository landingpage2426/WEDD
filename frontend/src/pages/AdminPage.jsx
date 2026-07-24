import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { formatDate } from "../utils/FormatDate";
import { handleDeleteUser } from "../utils/HandleDeleteUser";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUsers,
  FiUserCheck,
  FiShield,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import EditUser from "./EditUser.jsx";
import logo from "../assets/img/logo.png";

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });

const ROLE_LABELS = {
  admin: "Admin",
  client: "Client",
  manager: "Manager",
  chef_protocole: "Chef protocole",
  protocole: "Protocole",
};

const ROLE_STYLES = {
  admin: "bg-blue-600 text-white",
  client: "bg-blue-100 text-blue-800",
  manager: "bg-sky-100 text-sky-800",
  chef_protocole: "bg-indigo-100 text-indigo-800",
  protocole: "bg-slate-100 text-slate-700",
};

function AdminPage() {
  const [myUsers, setMyUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showPopupUpdateUser, setShowPopupUpdateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/login-page");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    setCurrentUser(user);
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyUsers(res.data.users || []);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login-page");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return myUsers.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const clientName = user.createdBy
        ? `${user.createdBy.prenom || ""} ${user.createdBy.nom || ""}`.toLowerCase()
        : "";
      const clientEmail = user.createdBy?.email?.toLowerCase() || "";
      const matchesSearch =
        !term ||
        user.nom?.toLowerCase().includes(term) ||
        user.prenom?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.telephone?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term) ||
        clientName.includes(term) ||
        clientEmail.includes(term);
      return matchesRole && matchesSearch;
    });
  }, [myUsers, searchTerm, roleFilter]);

  const isStaffRole = (role) =>
    ["manager", "chef_protocole", "protocole"].includes(role);

  const getClientLabel = (user) => {
    if (!isStaffRole(user.role)) return null;
    if (user.createdBy && typeof user.createdBy === "object") {
      return {
        name: `${user.createdBy.prenom || ""} ${user.createdBy.nom || ""}`.trim() || "Client",
        email: user.createdBy.email || "",
      };
    }
    return { name: "Client non renseigné", email: "" };
  };

  const stats = useMemo(() => {
    const clients = myUsers.filter((u) => u.role === "client").length;
    const staff = myUsers.filter((u) =>
      ["manager", "chef_protocole", "protocole"].includes(u.role)
    ).length;
    const admins = myUsers.filter((u) => u.role === "admin").length;
    return {
      total: myUsers.length,
      clients,
      staff,
      admins,
    };
  }, [myUsers]);

  const onEditUser = (user) => {
    setSelectedUser(user);
    setShowPopupUpdateUser(true);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiration");
      await axios.post(`${apiUrl}/api/logout`, {}, {
        headers: { "Content-Type": "application/json" },
      });
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="WEDD" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-lg font-bold text-blue-700 leading-tight">WEDD</p>
                <p className="text-xs text-slate-500">Espace administrateur</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                Gestion des utilisateurs
              </span>
              <Link
                to="/profil"
                className="px-3 py-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
              >
                <FiLogOut size={16} />
                Déconnexion
              </button>
            </nav>

            <button
              className="md:hidden p-2 rounded-lg bg-blue-600 text-white"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="md:hidden border-t border-blue-50 bg-white px-4 py-3 flex flex-col gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                Gestion des utilisateurs
              </span>
              <Link
                to="/profil"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-slate-600 hover:bg-blue-50 text-sm font-medium"
              >
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-left text-sm font-medium"
              >
                Déconnexion
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro */}
        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Bonjour{" "}
            <span className="text-blue-600">
              {currentUser?.prenom} {currentUser?.nom}
            </span>
          </h1>
          <p className="mt-1 text-slate-500">
            Gérez les comptes de l&apos;application : clients, staff et administrateurs.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-blue-100 text-blue-600">
                <FiUsers size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-sky-100 text-sky-600">
                <FiUserCheck size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Clients</p>
                <p className="text-2xl font-bold text-slate-800">{stats.clients}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-indigo-100 text-indigo-600">
                <FiUsers size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Staff</p>
                <p className="text-2xl font-bold text-slate-800">{stats.staff}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-blue-600 text-white">
                <FiShield size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Admins</p>
                <p className="text-2xl font-bold text-slate-800">{stats.admins}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white rounded-xl border border-blue-100 shadow-sm mb-6 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Utilisateurs de l&apos;application</h2>
              <p className="text-sm text-slate-500">
                {filteredUsers.length} résultat{filteredUsers.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:min-w-[260px]">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un utilisateur..."
                  className="w-full h-11 pl-10 pr-3 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-11 px-3 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="manager">Manager</option>
                <option value="chef_protocole">Chef protocole</option>
                <option value="protocole">Protocole</option>
              </select>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">N°</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Client rattaché</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Inscription</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((u, index) => {
                    const clientInfo = getClientLabel(u);
                    return (
                    <tr key={u._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                            {(u.prenom?.[0] || "?").toUpperCase()}
                            {(u.nom?.[0] || "").toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {u.prenom} {u.nom}
                            </p>
                            {u.role === "client" && u.lieuMariage && (
                              <p className="text-xs text-slate-500">{u.lieuMariage}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-700">{u.email}</p>
                        <p className="text-xs text-slate-500">{u.telephone || "—"}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            ROLE_STYLES[u.role] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {clientInfo ? (
                          <div>
                            <p className="text-sm font-medium text-slate-800">{clientInfo.name}</p>
                            {clientInfo.email && (
                              <p className="text-xs text-slate-500">{clientInfo.email}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onEditUser(u)}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                            title="Modifier"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteUser(u._id, navigate, fetchUsers);
                            }}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showPopupUpdateUser && selectedUser && (
        <EditUser
          user={selectedUser}
          fetchUsers={fetchUsers}
          onClose={() => {
            setShowPopupUpdateUser(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminPage;
