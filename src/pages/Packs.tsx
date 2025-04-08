import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import SalidaDatabase from "../models/PokemonFDB";
import { UserService } from "../services/userService";

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function Packs() {
  const { user } = useAuth()
  const [pokemons, setPokemons] = useState<SalidaDatabase[]>([]);
  // const [sprite , setSprite] = useState <string[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [pokePuntos, setPokePuntos] = useState(0)

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


      setPokemons(data);
      await UserService.actualizarPokePuntos(user?.id || 0 , [1,2])
      await fetchPuntos()

    } catch (error) {
      console.error("Error al abrir el sobre:", error);
    } finally {
      setIsLoading(false);

    }

  }
  const fetchPuntos = async () => {
    const puntos = await UserService.getPokePuntos(user?.id ||0)
    setPokePuntos(puntos)
  }
  useEffect( ()  => {

    fetchPuntos()
  }, [])



  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 h-screen w-full">
      <h2 className="text-2xl font-bold mb-4 text-white">Hazte con todos</h2>
      <div className="flex flex-col  items-end text-right w-300 text-orange-500">
        <img className="w-10 rounded-3xl" src="src/images/pokeCoin.jpg"></img>
        <h3 className="">{pokePuntos} PP</h3>
      </div>
      {pokemons?.length === 0 && (
        <div>
          <button onClick={openPack} disabled={isLoading}>
          <img className="w-50 h-100 rounded-4xl " src="src/images/mejorespacks.jpg"></img>


        </button>
        </div>
      )}


      {pokemons?.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {pokemons.map((pokemon, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md text-center"
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
              />
              <p className="text-white mt-2 font-semibold">{pokemon.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Botón para abrir un sobre */}
      <button
        onClick={openPack}
        disabled={isLoading}
        className="mb-4 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:bg-gray-400"
      >
        {isLoading ? "Abriendo..." : "Abrir Sobre"}
      </button>

    </div>
  )
}

export default Packs