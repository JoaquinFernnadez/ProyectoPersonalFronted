import { useEffect, useState } from "react"
import Pokemon from "../models/Pokemon"
import { useAuth } from "../contexts/AuthContext"
import PokemonDetails from "../models/PokemonDetails"
import PokemonService from "../services/pokemonService"


const API_URL_BASE = import.meta.env.VITE_API_URL_BASE


function Pokedex() {
  const { user } = useAuth()

  const [page, setPage] = useState(1)
  const [error, setError] = useState("")
  const [offset, setOffset] = useState(0)
  const [sprite, setSprites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)



  useEffect(() => {
    const fetchPokedex = async () => {
      setLoading(true)
      setSprites([])

      try {
        const response = await fetch(API_URL_BASE + `/pokemon/pokedex?id=${user?.id}&offset=${offset}`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Error al obtener la Pokédex")
        const data: Pokemon[] = await response.json()

        try {
          const spritesArray = await Promise.all(
            data.map(async (pokemon) => {
              const responseSprites = await fetch(pokemon.url)
              const dataSprites = await responseSprites.json()
              return dataSprites.sprites.front_default
            })
          )

          setSprites(spritesArray)

        } catch (error) {
          console.error(error)
        }

        setPokemons(data)

      } catch (error) {
        setError("No se pudo cargar la Pokédex")
        console.error(error)
      } finally {

        setLoading(false)
      }

    }
    fetchPokedex()
  }, [page])

  const handleNextPage = () => {
    setPage(page + 1)
    setOffset(offset + 20)
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
      setOffset(offset - 20)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950  w-screen min-h-300" >
      <div className="max-w-5xl mx-auto p-6 flex flex-col ">
        {/*<h1 className="text-6xl text-orange-500 font-bold text-center mb-6">Pokédex  Página {page} </h1>*/}

        {loading && <p className="text-center text-gray-500">Cargando Pokédex...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemons.map((pokemon, index) => (
            <div key={pokemon.id} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">

              <img
                src={sprite[index]}
                alt={pokemon.name}
                className={`w-24 h-24 mx-auto transition-opacity ${pokemon.unlocked ? "opacity-100" : "opacity-50 grayscale"
                  }`}
              />
              <p className="text-white mt-2 font-semibold">{pokemon.name}</p>
              {pokemon.unlocked && (
                <button
                  className="cursor-pointer mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                  onClick={async () => setSelectedPokemon(
                    await PokemonService.fetchPokemonDetails(
                      await PokemonService.getId(pokemon.url)
                    ))}
                >
                  Ver detalles
                </button>
              )}
            </div>
          ))}
        </div>
        {selectedPokemon && (
          <div className="fixed inset-0 bg-black/60  flex justify-center items-center">
            <div className=" bg-white/85 p-6 rounded-lg shadow-lg w-96 ">
              <h2 className="text-2xl font-bold pb-2">{(selectedPokemon.name).toUpperCase()}</h2>
              <p>Altura: {selectedPokemon.height} dm</p>
              <p>Peso: {selectedPokemon.weight} hg</p>

              <h3 className="mt-3 font-bold pt-2">Tipos :</h3>
              <ul>
                {selectedPokemon.types.map((type) => (
                  <li key={type} >{type}</li>
                ))}
              </ul>

              <h3 className="mt-3 font-bold pt-2">Habilidades :</h3>
              <ul>
                {selectedPokemon.abilities.map((ability) => (
                  <li key={ability} >{ability}</li>
                ))}
              </ul>

              <h3 className="mt-3 font-bold pt-2">Estadísticas:</h3>
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
        <div className="flex justify-between mt-6">
          <button
            onClick={() => handlePrevPage()}
            className="px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer"
            disabled={page <= 1}
          >
            Anterior
          </button>
          <button
            onClick={() => handleNextPage()}
            className="px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer"
            disabled={(page - 1) * 20 + pokemons.length > 1020}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pokedex
