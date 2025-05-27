import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const MinLevelRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [checking, setChecking] = useState(true)
  const [isAble, setIsAble] = useState(false)
  const [alerta, setAlerta] = useState(false)
  const navigate = useNavigate()
  const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

  useEffect(() => {
    const checkTeam = async () => {
      try {
        const res = await fetch(API_URL_BASE + `/user/maxLevel?id=${user?.id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Error al obtener la informacion")

        const data = await res.json()

        if (data >= 5) {
          setIsAble(true)
          setChecking(false)
        } else {
          setAlerta(true)
        }
      } catch (err) {
        console.error("Error consultando equipo:", err)
        navigate("/", { replace: true })
      }
    }

    checkTeam()
  }, [navigate])

  if (checking) {
    return (alerta ? <div className="w-full h-screen  bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950   "><div className="  h-30 flex items-center flex-col rounded " >
      <div className="text-white px-4 py-4"> Necesitas haber alcanzado el nivel 5 en el modo PvE </div>
      <button className="py-3 px-3 rounded cursor-pointer border bg-red-600 hover:bg-red-700" onClick={() => navigate("/", { replace: true })}> Volver </button>
    </div>
    </div>
      :
      <div className="flex flex-col justify-center items-center h-screen text-white">
        <img
          src="src/images/pokeball2.png"
          alt="Pokéball Spinner"
          className="w-24 h-24 animate-spin mb-4 rounded-full"
        />
        <p className="text-xl text-blue-400">Verificando nivel máximo...</p>
      </div>
    )
  }

  return isAble ? children : null
}

export default MinLevelRoute
