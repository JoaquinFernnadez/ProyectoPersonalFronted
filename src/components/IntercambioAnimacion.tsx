import { motion } from "framer-motion"
import { useState, useEffect } from "react"

type Props = {
  pokemonSalida: string
  pokemonEntrada: string
  onDone: () => void
}

const IntercambioAnimacion = ({ pokemonSalida, pokemonEntrada, onDone }: Props) => {
  const [mostrarPokebola, setMostrarPokebola] = useState(false)
  const [mostrarPokemonEntrada, setMostrarPokemonEntrada] = useState(false)

  useEffect(() => {
    // Mostrar la Pokébola después de que el Pokémon ofrecido se va
    const timer1 = setTimeout(() => {
      setMostrarPokebola(true)
    }, 1800)

    // Mostrar el Pokémon recibido desde la Pokébola
    const timer2 = setTimeout(() => {
      setMostrarPokemonEntrada(true)
    }, 3200)

    // Finalizar animación
    const timer3 = setTimeout(() => {
      onDone()
    }, 5000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="relative w-full max-w-md h-96 flex flex-col items-center justify-center gap-16">


        <div className="relative flex flex-col items-center">
          <motion.img
            key="salida"
            src={pokemonSalida}
            initial={{ y: 100, opacity: 1 }}
            animate={{ y: -120, opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-32 h-32 z-10 mt-4"
          />   
        </div>
        
        <div className="relative flex flex-col items-center min-h-[8rem]">
          {mostrarPokebola && !mostrarPokemonEntrada && (
            <motion.img
              src="src/images/pokeball2.png"
              initial={{ y: -250, opacity: 0, rotate: 0 }}
              animate={{ y: 0, opacity: 1, rotate: 720 }}
              transition={{ duration: 1.2 }}
              className="w-16 h-16 z-10 rounded-full"
            />
          )}

          {mostrarPokemonEntrada && (
            <motion.img
              key="entrada"
              src={pokemonEntrada}
              initial={{ scale: 0, opacity: 0, y: -60 }}
              animate={{ scale: 1, opacity: 1, y: [-60, 20, -5, 0] }}
              transition={{ duration: 1 }}
              className="w-32 h-32 z-10 -mb-4"
            />

          )}
          {/*<div className="w-28 h-8 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full shadow-inner shadow-black/50 absolute bottom-[-10px] z-0" />*/}

        </div>
      </div>
    </div>
  )
}

export default IntercambioAnimacion
