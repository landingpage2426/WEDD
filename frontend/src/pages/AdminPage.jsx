import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { formatDate } from "../utils/FormatDate";
import { handleDeleteUser } from "../utils/HandleDeleteUser";
import { clearSession } from "../utils/authSession";
import LanguageSwitch from "../components/LanguageSwitch";
import Pagination from "../components/Pagination";
import { useI18n } from "../i18n/I18nContext";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiEye,
  FiUserX,
  FiUserCheck,
} from "react-icons/fi";
import EditUser from "./EditUser.jsx";
import logo from "../assets/img/logo.png";

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });
const AUDIT_ACTIONS = [
  "login_success",
  "login_failure",
  "account_activated",
  "account_deactivated",
  "account_deleted",
  "password_reset",
  "password_changed",
  "presence",
  "billet_envoye",
];

function formatWhen(value, locale) {
  if (!value) return "—";
  return new Date(value).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}

function AdminPage() {
  const { t, locale } = useI18n();
  const [myUsers, setMyUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showPopupUpdateUser, setShowPopupUpdateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

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

  useEffect(() => {
    if (currentUser?.role === "admin") fetchAudit();
  }, [actionFilter, currentUser]);

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/users", { headers: authHeaders() });
      setMyUsers(res.data.users || []);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearSession();
        navigate("/login-page");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAudit = async () => {
    try {
      const query = actionFilter === "all" ? "" : `?action=${actionFilter}`;
      const res = await api.get(`/api/admin/audit${query}`, { headers: authHeaders() });
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Erreur journal", err);
    }
  };

  const clients = useMemo(() => myUsers.filter((user) => user.role === "client"), [myUsers]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return clients.filter((user) => (
      !term ||
      user.nom?.toLowerCase().includes(term) ||
      user.prenom?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.telephone?.toLowerCase().includes(term) ||
      user.lieuMariage?.toLowerCase().includes(term)
    ));
  }, [clients, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, pageSize]);

  const onEditUser = (user) => {
    setSelectedUser(user);
    setShowPopupUpdateUser(true);
  };

  const toggleActive = async (user) => {
    const next = user.actif === false;
    try {
      await api.put(`/api/admin/users/${user._id}/status`, { actif: next }, { headers: authHeaders() });
      await Promise.all([fetchUsers(), fetchAudit()]);
    } catch (err) {
      alert(err.response?.data?.message || t("profile.deleteError"));
    }
  };

  const handleLogout = async () => {
    try {
      clearSession();
      await axios.post(`${apiUrl}/api/logout`, {}, { headers: { "Content-Type": "application/json" } });
      navigate("/");
    } catch (error) {
      clearSession();
      navigate("/");
    }
  };

  const isSelf = (user) => String(user._id) === String(currentUser?.id || currentUser?._id);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="WEDD" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-lg font-bold text-blue-700 leading-tight">WEDD</p>
                <p className="text-xs text-slate-500">{t("admin.space")}</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                {t("admin.users")}
              </span>
              <Link to="/profil" className="px-3 py-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-700 text-sm font-medium">
                {t("common.profile")}
              </Link>
              <LanguageSwitch />
              <button onClick={handleLogout} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium">
                <FiLogOut size={16} />
                {t("common.logout")}
              </button>
            </nav>

            <button className="md:hidden p-2 rounded-lg bg-blue-600 text-white" onClick={() => setMenuOpen((open) => !open)} aria-label={t("dashboard.menu")}>
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav className="md:hidden border-t border-blue-50 bg-white px-4 py-3 flex flex-col gap-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <LanguageSwitch />
              <Link to="/profil" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-slate-600 text-sm font-medium">{t("common.profile")}</Link>
              <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-red-600 text-left text-sm font-medium">{t("common.logout")}</button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {t("admin.hello")} <span className="text-blue-600">{currentUser?.prenom} {currentUser?.nom}</span>
          </h1>
          <p className="mt-1 text-slate-500">{t("admin.intro")}</p>
        </section>

        <section className="mb-8">
          <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm inline-flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-blue-100 text-blue-600">
              <FiUsers size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{t("role.client")}</p>
              <p className="text-2xl font-bold text-slate-800">{clients.length}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-blue-100 shadow-sm mb-6 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{t("admin.listTitle")}</h2>
              <p className="text-sm text-slate-500">
                {filteredUsers.length > 1
                  ? t("admin.resultsPlural", { count: filteredUsers.length })
                  : t("admin.results", { count: filteredUsers.length })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:min-w-[260px]">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t("admin.search")}
                  className="w-full h-11 pl-10 pr-3 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-blue-600">
                <tr>
                  {[t("admin.guestCount"), t("admin.user"), t("admin.contact"), t("admin.status"), t("admin.joined"), t("admin.lastLogin"), t("common.actions")].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="7" className="px-4 py-12 text-center text-slate-500">{t("admin.loading")}</td></tr>
                ) : pagedUsers.length > 0 ? (
                  pagedUsers.map((user) => {
                    const active = user.actif !== false;
                    return (
                      <tr key={user._id} className="hover:bg-blue-50/50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-rose-700">{user.inviteStats?.total || 0}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-slate-800">{user.prenom} {user.nom}</p>
                          {user.lieuMariage && <p className="text-xs text-slate-500">{user.lieuMariage}</p>}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-700">{user.email}</p>
                          <p className="text-xs text-slate-500">{user.telephone || "—"}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>
                            {active ? t("common.active") : t("common.inactive")}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{formatWhen(user.lastLogin, locale)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link to={`/admin/users/${user._id}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-800 hover:text-white" title={t("admin.view")}>
                              <FiEye size={16} />
                            </Link>
                            <button type="button" onClick={() => toggleActive(user)} disabled={isSelf(user) && active} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white disabled:opacity-30" title={active ? t("admin.deactivate") : t("admin.activate")}>
                              {active ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                            </button>
                            <button type="button" onClick={() => onEditUser(user)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" title={t("admin.edit")}>
                              <FiEdit2 size={16} />
                            </button>
                            <button type="button" onClick={(e) => { e.preventDefault(); handleDeleteUser(user._id, navigate, fetchUsers); }} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" title={t("admin.delete")}>
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="7" className="px-4 py-12 text-center text-slate-500">{t("admin.empty")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={currentPage} pageCount={pageCount} pageSize={pageSize} total={filteredUsers.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </section>

        <section className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{t("admin.journal")}</h2>
              <p className="text-sm text-slate-500">{t("admin.journalHint")}</p>
            </div>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="h-11 rounded-lg border border-slate-200 px-3 text-slate-700">
              <option value="all">{t("admin.allActions")}</option>
              {AUDIT_ACTIONS.map((action) => (
                <option key={action} value={action}>{t(`audit.${action}`)}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("admin.when")}</th>
                  <th className="px-4 py-3">{t("admin.action")}</th>
                  <th className="px-4 py-3">{t("admin.author")}</th>
                  <th className="px-4 py-3">{t("admin.target")}</th>
                  <th className="px-4 py-3">{t("admin.details")}</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">{t("admin.noLogs")}</td></tr>
                ) : logs.map((log) => (
                  <tr key={log._id} className="border-t border-slate-100">
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatWhen(log.createdAt, locale)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{t(`audit.${log.action}`)}</td>
                    <td className="px-4 py-3 text-slate-600">{log.actorEmail || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{log.targetEmail || "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{log.details || "—"}</td>
                  </tr>
                ))}
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
