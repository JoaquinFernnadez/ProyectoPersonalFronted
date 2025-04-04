import {  useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import SalidaDatabase from "../models/PokemonFDB";

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function Packs() {
  const { user } = useAuth()
  const [pokemons, setPokemons] = useState<SalidaDatabase[]>([]);
  // const [sprite , setSprite] = useState <string[]>([])
  const [isLoading, setIsLoading] = useState(false);

  //let reload = 1

  // Función para abrir un sobre

  const openPack = async () => {
    setIsLoading(true);
    setPokemons([])

    try {
      const response = await fetch(API_URL_BASE + `/pokemon/packs?id=${user?.id}`, {
        method: "GET",
        credentials: "include", // Para enviar cookies si hay autenticación
      });

      if (!response.ok) {
        throw new Error("Error al abrir el sobre");
      }

      const data = await response.json();
    
      
      setPokemons(data); // Recibe un array de nombres de Pokémon
      //reload = reload * -1
      
    } catch (error) {
      console.error("Error al abrir el sobre:", error);
    } finally {
      setIsLoading(false);

    }

  };
  /*
  useEffect(() => {


  }, [reload])
*/


  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Hazte con todos</h2>

      

      {pokemons?.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {pokemons.map((pokemon, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md text-center"
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.pokemon.name}
              />
              <p className="text-white mt-2 font-semibold">{pokemon.pokemon.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Botón para abrir un sobre */}
      <button
        onClick={openPack}
        disabled={isLoading}
        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
      >
        {isLoading ? "Abriendo..." : "Abrir Sobre"}
      </button>

    </div>
  )
}

export default Packs