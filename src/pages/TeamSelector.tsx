import { useState, useEffect } from "react"
import Pokemon from "../models/Pokemon"
import { useAuth } from "../contexts/AuthContext"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function Team() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [guardado, setGuardado] = useState(false)
  const [userPokemons, setUserPokemons] = useState<Pokemon[]>([])
  const [selectedPokemons, setSelectedPokemons] = useState<number[]>([])


  useEffect(() => {
    const fetchUserPokemons = async () => {
      try {
        const response = await fetch(API_URL_BASE + `/pokemon/desbloqueados?id=${user?.id}`, {
          credentials: "include",
        })
        const data = await response.json()

        if (!response.ok) throw new Error(data.error || "Error al obtener Pokémon")

        setUserPokemons(data)
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error desconocido'
        setError(msg)
      } finally {
        setLoading(false)
      }

    }

    fetchUserPokemons()
  }, [])


  const handleSelectPokemon = (pokemonId: number) => {
    if (selectedPokemons.includes(pokemonId)) {

      setSelectedPokemons(selectedPokemons.filter((id) => id != pokemonId))
    } else if (selectedPokemons.length < 6) {

      setSelectedPokemons([...selectedPokemons, pokemonId])
    } else {
      alert("Solo puedes seleccionar 6 Pokémon.")
    }
  }


  const saveTeam = async () => {

    if (selectedPokemons.length !== 6) {
      alert("Debes seleccionar exactamente 6 Pokémon.")
      return
    }

    try {
      const response = await fetch(API_URL_BASE + `/pokemon/desbloqueados/guardarEquipo?id=${user?.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pokemonIds: selectedPokemons }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Error al guardar el equipo")

      setGuardado(true)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido'
      setError(msg)
      alert(error)
    }
  }


  if (loading) return <p className="text-center">Cargando Pokémon...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 min-h-screen w-full">
      <div className=" text-white flex flex-col items-center p-6">
        <h2 className="text-2xl font-bold mb-4">Selecciona tu equipo de 6 Pokémons</h2>


        <div className=" overflow-y-auto h-[600px] w-full grid grid-cols-6 gap-4 mb-4">
          {userPokemons?.map((pokemon, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24" />
              <p className="text-lg font-semibold">{pokemon.name}</p>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedPokemons.includes(pokemon.id)}
                  onChange={() => handleSelectPokemon(pokemon.id)}
                  className="appearance-none cursor-pointer w-5 h-5 rounded-full border-2 border-gray-500 checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-300"
                />
                <span>{selectedPokemons.includes(pokemon.id) ? "Seleccionado" : "Seleccionar"}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-10">
          <button
            onClick={saveTeam}
            disabled={selectedPokemons.length !== 6}
            className="px-2 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            Guardar Equipo
          </button>
          <button
           onClick={() => navigate("/myteam")} 
           className="cursor-pointer rounded-lg bg-gradient-to-br from-purple-700  to-blue-700 px-2 py-2 "
           >
            Volver
          </button>
        </div>
        <AnimatePresence>
          {guardado && (
            <motion.div
              className="fixed inset-0 bg-black/90 bg-opacity-40  flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-pink-100 p-6 rounded-xl shadow-xl max-w-sm"
                initial={{ y: -150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 150, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-black text-black mb-4">Equipo guardado correctamente.</h2>
                <p className="mb-6 text-black">Ya puedes acceder al juego.</p>
                <div className="flex justify-end gap-4">

                  <button
                    onClick={() => {
                      setGuardado(false)
                    }}
                    className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-md hover:bg-green-700"
                  >
                    Confirmar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Team
