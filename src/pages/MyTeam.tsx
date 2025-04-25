import { useEffect, useState } from "react"
import Pokemon from "../models/Pokemon"
import { useAuth } from "../contexts/AuthContext"
import PokemonDetails from "../models/PokemonDetails"
import PokemonService from "../services/pokemonService"
import { useNavigate } from "react-router-dom"


const API_URL_BASE = import.meta.env.VITE_API_URL_BASE



function UserTeam() {

  const { user } = useAuth()
  const navigate = useNavigate()

  const [team, setTeam] = useState<Pokemon[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const response = await fetch(API_URL_BASE + `/pokemon/verEquipo?id=${user?.id}`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Error al obtener el equipo Pokémon")

        const data: Pokemon[] = await response.json()
        setTeam(data)

      } catch (error) {
        setError("No se pudo cargar el equipo")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserTeam()
  }, [user?.id])

  return (
    <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 h-screen w-full">
      <div className="max-w-3xl mx-auto p-6 ">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Mi Equipo Pokémon</h1>

        {loading && <p className="text-center text-gray-500">Cargando equipo...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {team.map((pokemon) => (
            <div key={pokemon.id} className=" p-4 rounded-lg shadow-md text-center">
              <img src={pokemon.sprite} className="w-24 h-24 mx-auto" />
              <p className="text-white mt-2 font-semibold">{pokemon.pokemonName}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                onClick={async () => setSelectedPokemon(await PokemonService.fetchPokemonDetails(pokemon.id))}
              >
                Ver detalles
              </button>
            </div>
          ))}

        </div>
        <div className="flex justify-center pt-10">
          <button className=" rounded-2xl cursor-pointer py-2 px-2 text-white bg-gradient-to-br from-purple-700  to-blue-700 " onClick={() => navigate('/team')}>Cambiar Equipo</button>
        </div>

        {selectedPokemon && (
          <div className="fixed inset-0 bg-black/60  flex justify-center items-center">
            <div className=" bg-white/85 p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold">{(selectedPokemon.name).toUpperCase()}</h2>
              <p>Altura: {selectedPokemon.height} dm</p>
              <p>Peso: {selectedPokemon.weight} hg</p>

              <h3 className="mt-3 font-bold">Tipos:</h3>
              <ul>
                {selectedPokemon.types.map((type) => (
                  <li key={type} className="text-blue-500">{type}</li>
                ))}
              </ul>

              <h3 className="mt-3 font-bold">Habilidades:</h3>
              <ul>
                {selectedPokemon.abilities.map((ability) => (
                  <li key={ability} className="text-green-500">{ability}</li>
                ))}
              </ul>

              <h3 className="mt-3 font-bold">Estadísticas:</h3>
              <ul>
                {selectedPokemon.stats.map((stats) => (
                  <li key={stats.stat}>{stats.stat}: {stats.base_stat}</li>
                ))}
              </ul>

              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                onClick={() => setSelectedPokemon(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {team.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500 mt-4">No tienes Pokémon en tu equipo.</p>
        )}
      </div>
    </div>
  )
}

export default UserTeam






