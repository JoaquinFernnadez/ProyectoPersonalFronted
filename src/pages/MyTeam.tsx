import { useEffect, useState } from "react"
import Pokemon from "../models/Pokemon";
import { useAuth } from "../contexts/AuthContext";


const API_URL_BASE = import.meta.env.VITE_API_URL_BASE



function UserTeam() {
  const { user } = useAuth()
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const response = await fetch(API_URL_BASE+`/pokemon/verEquipo?id=${user?.id}`, {
          method: "GET",
          credentials: "include", 
        })

        if (!response.ok) throw new Error("Error al obtener el equipo Pokémon")

        const data: Pokemon[] = await response.json()
        setTeam(data);
        console.log(data)

      } catch (error) {
        setError("No se pudo cargar el equipo")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserTeam()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Mi Equipo Pokémon</h1>

      {loading && <p className="text-center text-gray-500">Cargando equipo...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {team.map((pokemon) => (
          <div key={pokemon.id} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
            <img src={pokemon.sprite}  className="w-24 h-24 mx-auto" />
            <p className="text-white mt-2 font-semibold">{pokemon.pokemonName}</p>
          </div>
        ))}
      </div>

      {team.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500 mt-4">No tienes Pokémon en tu equipo.</p>
      )}
    </div>
  );
};

export default UserTeam;






