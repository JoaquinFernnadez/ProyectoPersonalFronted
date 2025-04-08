import { useEffect, useState } from "react";
import Complaint from "../models/Complaint";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

export default function ComplaintsList() {
    const { user } = useAuth();
    const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(API_URL_BASE+`/complaints/list?id=${user?.id}`, {
          method: "GET",
          credentials: "include", // Incluye cookies o tokens de sesión si es necesario
        });

        if (!response.ok) throw new Error("Error al obtener las quejas");

        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5  bg-orange-200 shadow-lg rounded-lg flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Quejas</h2>
      {complaints.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No hay quejas registradas.</p>
      ) : (
        <ul className="divide-y divide-gray-300 pb-5">
          {complaints.map((complaint, index) => (
            <li key={index} className="p-4 hover:bg-gray-100 rounded-md">
              <p className="text-lg font-semibold">{complaint.titulo || "Sin título"}</p>
              <p className="text-gray-600">{complaint.descripcion || "Sin descripción"}</p>
            </li>
          ))}
        </ul>
      )}
        <button className="bg-green-700 h-10 w-30  rounded"    onClick={() => navigate('/newComplaint')}>Nueva Queja</button>
    </div>
  );
}
