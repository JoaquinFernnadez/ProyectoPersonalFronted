import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"

function Navbar() {
  const { user, logout } = useAuth()
  const [mostrarModal, setMostrarModal] = useState(false)

  const abrirModal = () => setMostrarModal(true)
  const cerrarModal = () => setMostrarModal(false)

  const confirmarAccion = () => {
    cerrarModal()
    logout() 
    
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className=" text-gray-400 max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {user ? user.email : ''}


        <div className="items-center  justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar">
          <ul className="flex flex-col  p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ">
            <li>
              <Link to="/" className="block py-2 px-3 text-white  bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</Link>
            </li>
            <li>
              <Link to="/users" className="block py-2 px-3 text-white  bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Ranking</Link>
            </li>
            <li>
              <Link to="/news" className="block py-2 px-3 text-white  bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">News</Link>
            </li>
            <li>
              <button onClick={abrirModal} className="block cursor-pointer py-2 px-3 text-white  bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Logout</button>
            </li>
            <li>
              <Link to="/complaints" className="block py-2 px-3 text-white  bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Complaints</Link>
            </li>

          </ul>
          <AnimatePresence>
        {mostrarModal && (
          <motion.div
            className="fixed inset-0 bg-black/90 bg-opacity-40  flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-pink-100 p-6 rounded-xl shadow-xl max-w-sm"
              initial={{ y: -150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-black text-black mb-4">¿Estás seguro?</h2>
              <p className="mb-6 text-black">Vas a cerrar tu sesion.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cerrarModal}
                  className="px-4 py-2 text-white bg-red-600 rounded-md  hover:bg-red-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmarAccion()
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green- cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </nav>

  )
}

export default Navbar