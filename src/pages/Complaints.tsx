import { useEffect, useState } from "react"
import Complaint from "../models/Complaint"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

export default function ComplaintsList() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [chosenComplaint, setChosenComplaint] = useState<Complaint | null>(null)
  const [cliked, setCliked] = useState(true)

  useEffect(() => {
    
    const fetchComplaints = async () => {
      try {
        const response = await fetch(API_URL_BASE + `/complaints/list`, {
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

  const handleClick = (complaint: Complaint) => {
    setChosenComplaint(complaint)
  }

  const handleCloseModal = () => {
    setChosenComplaint(null)
  }
  const handleOrder = (quejas: Complaint[]) => {
    setComplaints([...quejas].reverse())
    setCliked(!cliked)
  }
  const handleDelete = async (complaint: Complaint) => {
    /* const deleteComplaint = await fetch(API_URL_BASE + `/complaints/delete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(complaint.id),
    })
    
    console.log(deleteComplaint)*/ 
    setComplaints(complaints.filter(queja => queja.id !== complaint.id )) // apaño visual
    setChosenComplaint(null)
  }

  const truncate = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 min-h-screen w-full">
      <div className="max-w-xl mx-auto mt-10 p-5 bg-gray-300 shadow-lg rounded-lg flex flex-col items-center relative">
        <h2 className="text-2xl font-bold mb-4 text-center">Lista de Quejas</h2>

        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No hay quejas registradas.</p>
        ) : (
          <ul className="divide-y divide-gray-300 pb-5 w-full">
            {complaints.map((complaint, index) => (
              <li key={index}>
                <button
                  onClick={() => handleClick(complaint)}
                  className="w-full text-left p-4 hover:bg-gray-100 rounded-md"
                >
                  <p className="text-lg font-semibold">
                    {truncate(complaint.titulo || "Sin título", 30)}
                  </p>
                  <p className="text-gray-600">
                    {truncate(complaint.descripcion || "Sin descripción", 50)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-center gap-x-20  ">
          <button className="mt-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded" onClick={() => handleOrder(complaints)}>{cliked ? "Últimas quejas" : "Cronológico"}</button>
          <button
            className="mt-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => navigate('/newComplaint')}
          >
            Añadir queja
          </button>

        </div>
      </div>

      {chosenComplaint && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)]  flex justify-center items-center z-50">
          <div className="bg-gray-300 p-6 rounded-lg max-w-md w-full shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-3 text-gray-800 hover:text-black text-xl font-bold"
            >
              ×
            </button>
            <h3 className="text-3xl font-bold text-center text-black mb-2">
              {chosenComplaint.titulo || "Sin título"}
            </h3>

            <p className="text-gray-700 whitespace-pre-wrap">
              {chosenComplaint.descripcion || "Sin descripción"}
            </p>
            <div className="flex justify-center ">
              {chosenComplaint?.userId === user?.id ? <button className="mt-4 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={() => handleDelete(chosenComplaint)}>Eliminar</button> : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
