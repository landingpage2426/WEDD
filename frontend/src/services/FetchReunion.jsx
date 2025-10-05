import { useEffect, useState } from "react";

function FetchReunion() {
  const [reunionsList, setReunionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

 const fetchReunions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/reunions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des réunions');
      }

      const data = await response.json();
      setReunionsList(data.reunions || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReunions();
  }, []);

  return { reunionsList, isLoading ,error}
}

export default FetchReunion
