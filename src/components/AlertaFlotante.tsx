import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  mensaje: string;
  duration?: number; // opcional: cuánto dura visible (ms)
}

const AlertaFlotante = ({ mensaje, duration = 2000 }: Props) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timeout)
  }, [duration])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
        >
          {mensaje}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AlertaFlotante
