import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../utils/FormatDate";
// import { handleDeleteUser } from "../services/HandleDeleteUser";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });
function AdminPage() {
  const [myUsers, setMyUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return navigate("/login");
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      console.log(res.data.users);
      
      setMyUsers(res.data.users);
    } catch (err) {
      console.error("Erreur lors du chargement des chants", err);
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
                  Email
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
                      <div>{u.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{u.role}</div>
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(u.createdAt)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/editUser/${u._id}`}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                          modifier
                        </Link>{" "}
                        <button
                          className="text-red-600 bg-red-600 text-white rounded-lg hover:text-red-900 p-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteUser(u._id, navigate, fetchUsers);
                          }}
                        >
                          Supprimer
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