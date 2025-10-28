import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: apiUrl });

export const handleDeleteUser = async (id,navigate,fetchUsers) => {

  if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

  try {
    const token = localStorage.getItem("token");
    await api.delete(`/api/delete-user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/admin");
    fetchUsers();
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    alert("Erreur lors de la suppression, veuillez réessayer.");
  }
};