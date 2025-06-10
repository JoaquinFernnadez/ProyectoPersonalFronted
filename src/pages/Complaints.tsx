import { useEffect, useState } from "react"
import Complaint from "../models/Complaint"
import { useNavigate } from "react-router-dom"


const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

export default function ComplaintsList() {
    
    const navigate = useNavigate()

    const [error, setError] = useState(null as string | null)
    const [loading, setLoading] = useState(true)
    const [complaints, setComplaints] = useState<Complaint[]>([])

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(API_URL_BASE+`/complaints/list`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Error al obtener las quejas")

        const data = await response.json()
        setComplaints(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 min-h-screen w-full">
    <div className="max-w-xl mx-auto mt-10 p-5  bg-gray-200 shadow-lg rounded-lg flex flex-col items-center">
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
        <button className="bg-green-500 hover:bg-green-700 h-10 w-30 cursor-pointer rounded"    onClick={() => navigate('/newComplaint')}>Añadir queja</button>
    </div>
    </div>
  )
}
