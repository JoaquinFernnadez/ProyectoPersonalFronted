import { motion, AnimatePresence } from "framer-motion";

type Props = {
  pokemonSalida: string;
  pokemonEntrada: string;
  onDone: () => void;
}

const IntercambioAnimacion = ({ pokemonSalida, pokemonEntrada, onDone }: Props) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-80 flex items-center justify-center">
      <AnimatePresence>
        <motion.img
          key="salida"
          src={pokemonSalida}
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: -300, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-32 h-32 absolute"
          onAnimationComplete={() => {
            setTimeout(onDone, 1000); // esperar antes de mostrar el nuevo
          }}
        />

        <motion.img
          key="entrada"
          src={pokemonEntrada}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="w-32 h-32"
        />
      </AnimatePresence>
    </div>
  )
}

export default IntercambioAnimacion
