import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const TeamGuardRoute = ({ children }: {children: React.ReactNode}) => {
    const {user} = useAuth()
    const [checking, setChecking] = useState(true)
    const [hasTeam, setHasTeam] = useState(false)
    const navigate = useNavigate()
    const API_URL_BASE = import.meta.env.VITE_API_URL_BASE
    
  useEffect(() => {
    const checkTeam = async () => {
      try {
        const res = await fetch(API_URL_BASE + `/pokemon/verEquipo?id=${user?.id}`, {
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Error al obtener el equipo")

        const data = await res.json()

        if (data.length > 0) {
          setHasTeam(true);
        } else {
          navigate("/", { replace: true })
        }
      } catch (err) {
        console.error("Error consultando equipo:", err)
        navigate("/", { replace: true })
      } finally {
        setChecking(false);
      }
    }

    checkTeam()
  }, [navigate])

  if (checking) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white">
        <img
                src="src/images/pokeball2.png"
                alt="Pokéball Spinner"
                className="w-24 h-24 animate-spin mb-4 rounded-full"
              />
        <p className="text-xl text-blue-400">Verificando equipo guardado...</p>
      </div>
    )
  }

  return hasTeam ? children : null;
}

export default TeamGuardRoute
