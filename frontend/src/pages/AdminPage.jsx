import React, { useEffect, useState } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { formatDate } from "../utils/FormatDate";
import { handleDeleteUser } from "../utils/HandleDeleteUser";
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import EditUser from "./EditUser.jsx"
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });
function AdminPage() {
    const [myUsers, setMyUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showPopupUpdateUser, setShowPopupUpdateUser] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    // Fonction appelée au clic sur le bouton modifier
    const onEditUser = (user) => {
        setSelectedUser(user);
        setShowPopupUpdateUser(true);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return navigate("/login");
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/users");
            setMyUsers(res.data.users);
        } catch (err) {
            console.error("Erreur lors du chargement des utilisateurs", err);
        }
    };

    //  Filtrage automatique à chaque saisie
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = myUsers.filter(
            (user) =>
                user.nom?.toLowerCase().includes(term) ||
                user.email?.toLowerCase().includes(term) ||
                user.role?.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, myUsers]);



    return (
        <>
            <h1 className="text-2xl font-bold my-4 text-center">Gestion des utilisateurs</h1>

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm ">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un utilisateur ..."
                    className="my-10 ml-5 mr-15 w-64 sm:w-64 h-10 border border-gray-400 rounded-lg px-3 py-2 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-600">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    N°
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                                    Nom
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                                    Prenom
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                                    Telephone
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                                    Date mariage
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                                    Lieu mariage
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                                    Couleur site
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ">
                                    Thème mariage
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Rôle
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Date d'inscription
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u, index) => (
                                    <tr key={u._id} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 ">
                                            <div>{u.nom}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 ">
                                            <div>{u.prenom}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 ">
                                            <div>{u.email}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 ">
                                            <div>{u.telephone}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 ">
                                            <div>{formatDate(u.dateMariage)}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 ">
                                            <div>{u.lieuMariage}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 ">
                                            <div>{u.couleurSite}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 ">
                                            <div>{u.themeMariage}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{u.role}</div>
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                                            <div>{formatDate(u.createdAt)}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">


                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEditUser(u);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Modifier"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>

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


                                                <button
                                                    className="text-red-600 bg-red-600 text-white rounded-lg hover:text-red-900 p-1"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDeleteUser(u._id, navigate, fetchUsers);
                                                    }}
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        Aucun invité trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}

export default AdminPage;