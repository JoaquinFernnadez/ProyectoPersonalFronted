import { useState, useEffect } from "react";
import Pokemon from "../models/Pokemon";
import { useAuth } from "../contexts/AuthContext";

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE
  
  function Team() {
    const { user } = useAuth()
    const [userPokemons, setUserPokemons] = useState<Pokemon[]>([])
    const [selectedPokemons, setSelectedPokemons] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
  
  
    useEffect(() => {
      const fetchUserPokemons = async () => {
        try {
          const response = await fetch(API_URL_BASE + `/pokemon/desbloqueados?id=${user?.id}`, {
            credentials: "include", 
          })
          const data = await response.json()
          console.log(data)
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
      
        setSelectedPokemons(selectedPokemons.filter((id ) => id != pokemonId))
      } else if (selectedPokemons.length < 6) {
        
        setSelectedPokemons([...selectedPokemons, pokemonId])
      } else {
        alert("Solo puedes seleccionar 6 Pokémon.")
      }
    }
  
   
    const saveTeam = async () => {
      console.log(selectedPokemons)
      if (selectedPokemons.length !== 6) {
        alert("Debes seleccionar exactamente 6 Pokémon.");
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
      <div className=" text-white flex flex-col items-center p-6">
        <h2 className="text-2xl font-bold mb-4">Selecciona tu equipo de 6 Pokémons</h2>
  
        
        <div className=" overflow-y-auto h-[600px]  grid grid-cols-3 gap-4 mb-4">
          {userPokemons?.map((pokemon,index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24" />
              <p className="text-lg font-semibold">{pokemon.name}</p>
  
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedPokemons.includes(pokemon.id)}
                  onChange={() => handleSelectPokemon(pokemon.id)}
                    className="appearance-none w-5 h-5 rounded-full border-2 border-gray-500 checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-300"
                />
                <span>{selectedPokemons.includes(pokemon.id) ? "Seleccionado" : "Seleccionar"}</span>
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
  