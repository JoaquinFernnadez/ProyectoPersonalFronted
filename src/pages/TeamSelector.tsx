import { useState, useEffect } from "react";
import Pokemon from "../models/Pokemon";

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE
  
  function Team() {
    const [userPokemons, setUserPokemons] = useState<Pokemon[]>([])
    const [selectedPokemons, setSelectedPokemons] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
  
  
    useEffect(() => {
      const fetchUserPokemons = async () => {
        try {
          const response = await fetch(API_URL_BASE + "/pokemon/desbloqueados", {
            credentials: "include", 
          })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error || "Error al obtener Pokémon")
  
          setUserPokemons(data.pokemons)
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Error desconocido'
          setError(msg)
        } finally {
          setLoading(false)
        }
      }
  
      fetchUserPokemons()
    }, [])
  
  
    const handleSelectPokemon = (pokemonName: string) => {
      if (selectedPokemons.includes(pokemonName)) {
      
        setSelectedPokemons(selectedPokemons.filter((name) => name !== pokemonName))
      } else if (selectedPokemons.length < 6) {
        
        setSelectedPokemons([...selectedPokemons, pokemonName])
      } else {
        alert("Solo puedes seleccionar 6 Pokémon.")
      }
    }
  
   
    const saveTeam = async () => {
      if (selectedPokemons.length !== 6) {
        alert("Debes seleccionar exactamente 6 Pokémon.");
        return
      }
  
      try {
        const response = await fetch(API_URL_BASE + "/pokemon/desbloqueados/guardarEquipo", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pokemons: selectedPokemons }),
        })
  
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Error al guardar el equipo");
  
        alert("¡Equipo guardado con éxito!")
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error desconocido'
        setError(msg)
        alert(error)
      }
    }
  
    
    if (loading) return <p className="text-center">Cargando Pokémon...</p>
    if (error) return <p className="text-center text-red-500">{error}</p>
  
    return (
      <div className="flex flex-col items-center p-6">
        <h2 className="text-2xl font-bold mb-4">Selecciona tu equipo de 6 Pokémon</h2>
  
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {userPokemons.map((pokemon) => (
            <div key={pokemon.id} className="flex flex-col items-center">
              <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24" />
              <p className="text-lg font-semibold">{pokemon.name}</p>
  
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedPokemons.includes(pokemon.name)}
                  onChange={() => handleSelectPokemon(pokemon.name)}
                  className="w-5 h-5"
                />
                <span>{selectedPokemons.includes(pokemon.name) ? "Seleccionado" : "Seleccionar"}</span>
              </label>
            </div>
          ))}
        </div>
  
        
        <button
          onClick={saveTeam}
          disabled={selectedPokemons.length !== 6}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          Guardar Equipo
        </button>
      </div>
    )
  }
  
  export default Team;
  