import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import SalidaDatabase from "../models/PokemonFDB"
import UserService from "../services/userService"
import { motion, AnimatePresence } from "framer-motion"
// import Test3D from "../components/Test3D"
import Pack3D from "../components/Pack3D"


const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function Packs() {
  const { user } = useAuth()
  const [pokemons, setPokemons] = useState<SalidaDatabase[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pokePuntos, setPokePuntos] = useState(0)
  const [isOpening, setIsOpening] = useState(false)
  const [showCards, setShowCards] = useState(false)

  const openPack = async () => {
    setIsOpening(true)
    setPokemons([])


    setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${API_URL_BASE}/pokemon/packs?id=${user?.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        )

        if (!response.ok) {
          throw new Error("Error al abrir el sobre")
        }

        const data = await response.json()
        setPokemons(data)
        await UserService.actualizarPokePuntos(user?.id || 0, [1, 2])
        await fetchPuntos()
        setShowCards(true)
      } catch (error) {
        console.error("Error al abrir el sobre:", error)
      } finally {
        setIsLoading(false)
        setIsOpening(false)
      }
    }, 1200)
  }


  const fetchPuntos = async () => {
    const puntos = await UserService.getPokePuntos(user?.id || 0)
    setPokePuntos(puntos)
  }

  useEffect(() => {
    fetchPuntos()
  }, [])

  const handleClose = () => {
    setShowCards(false)
    setPokemons([])
  }

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 h-screen w-full overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 text-white">Hazte con todos</h2>

      <div className="absolute top-4 right-4 flex flex-col items-end text-orange-500 z-20">
        <img className="w-10 rounded-3xl" src="src/images/pokeCoin.jpg" />
        <h3>{pokePuntos} PP</h3>
      </div>


      <motion.div
        initial={{ scale: 1, rotate: 0, opacity: 1 }}
        animate={
          isOpening
            ? { scale: 1.2, rotate: 10, opacity: 0.5 }
            : { scale: 1, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 1, ease: "easeInOut" }}
        className="cursor-pointer z-10"
        onClick={openPack}
      >
        <Pack3D />
      </motion.div>


      <button
        onClick={openPack}
        disabled={isLoading || isOpening || showCards}
        className="mt-6 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:bg-gray-400 z-10"
      >
        {isLoading || isOpening ? "Abriendo..." : "Abrir Sobre"}
      </button>


      <AnimatePresence>
        {showCards && (
        
          <motion.div
            className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-80 z-30 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >

            <div className="relative bg-gradient-to-br from-yellow-400 via-red-500 to-pink-600 p-1 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.5)] max-w-4xl w-full">
              <div className="bg-gray-900 rounded-xl p-6 border-4 border-dashed border-yellow-300 overflow-y-auto max-h-[70vh]">
                <h3 className="text-white text-xl font-bold mb-4 text-center font-mono drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                  ¡Has obtenido!
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                  {pokemons.map((pokemon, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-800 p-4 rounded-lg text-center border border-yellow-500 shadow-[0_0_10px_rgba(255,255,0,0.4)] cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      whileTap={{ scale: 0.95 }}
                      layout
                      transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 100
                      }}

                    >
                      <img
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        className="mx-auto w-20 h-20 pixelated"
                      />
                      <p className="text-yellow-300 mt-2 font-semibold font-mono text-sm uppercase">
                        {pokemon.name}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2  bg-red-600 text-white rounded-md hover:bg-red-700 shadow-md font-bold w-full font-mono"
                >
                  Cerrar sobre
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Packs