import { useEffect, useState } from "react";
import Pokemon from "../models/Pokemon";

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE


function Pokedex ()  {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPokedex = async () => {
      try {
        const response = await fetch(API_URL_BASE + "/pokemon/pokedex", {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) throw new Error("Error al obtener la Pokédex")

        const data: Pokemon[] = await response.json()
        setPokemons(data) 
      } catch (error) {
        setError("No se pudo cargar la Pokédex")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokedex()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Pokédex</h1>

      {loading && <p className="text-center text-gray-500">Cargando Pokédex...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
            {/* Imagen del Pokémon con filtro si está bloqueado */}
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className={`w-24 h-24 mx-auto transition-opacity ${
                pokemon.unlocked ? "opacity-100" : "opacity-50 grayscale"
              }`}
            />
            <p className="text-white mt-2 font-semibold">{pokemon.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pokedex
