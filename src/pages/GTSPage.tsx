import { useEffect, useState } from "react";
import Intercambio from "../models/Intercambios";
import PokemonService from "../services/pokemonService";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import IntercambioAnimacion from "../components/IntercambioAnimacion";
import AlertaFlotante from "../components/AlertaFlotante";
import LoadingScreen from "../components/LoadingScreen";

const GTSPage = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [intercambios, setIntercambios] = useState<Intercambio[]>([])
    const [mostrarAlerta, setMostrarAlerta] = useState(false)
    const [mensajeAlerta, setMensajeAlerta] = useState("")
    const [mostrarAnimacion, setMostrarAnimacion] = useState(false)
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [intercambioARealizar, setIntercambioARealizar] = useState<number | null>(null)

    const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

    const fetchIntercambios = async () => {
        setLoading(true)
        const response = await fetch(API_URL_BASE + `/pokemon/gts?id=${user?.id}`)
        const data = await response.json()
        setIntercambios(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchIntercambios()
    }, [])

    const handleIntercambio = async (id: number) => {
        const msj = await PokemonService.handleAceptarIntercambio(id, user?.id) as string
        setMensajeAlerta(msj)
        setMostrarAlerta(true)
        setMostrarAnimacion(true)

    }

    const handleClickAceptar = async (id: number) => {
        setMostrarConfirmacion(true)
        setIntercambioARealizar(id)
    }

    const confirmarIntercambio = () => {
        handleIntercambio(intercambioARealizar || 0)
        setMostrarConfirmacion(false)
    }

    const cancelarIntercambio = () => {
        setMostrarConfirmacion(false)
        setIntercambioARealizar(null)
    }

    return loading ? (
        <LoadingScreen />
    ) : (
        <div className="p-6 bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 min-h-screen w-full ">
            <h2 className="text-5xl font-bold text-green-400 mb-4 text-center pb-8 pt-10"></h2>
            
            {/* Crear Intercambio */}
            <div className="mb-6 text-center pb-10">
                <div className="flex justify-end  pb-6">
                    <button onClick={() => navigate("/management")} className="bg-green-600 hover:bg-green-800 cursor-pointer text-white rounded py-2 px-3">Tus Intercambios</button>
                </div>
            </div>
            

            {/* Mostrar Intercambios */}
            <div className=" gap-4 flex flex-wrap justify-evenly">
                {intercambios.map((intercambio) => (
                    <div key={intercambio.id} className="border p-4 rounded shadow flex flex-col items-center w-72 bg-black/20">
                        <p className="text-green-400"><strong className="text-orange-400">Ofrece:</strong> {intercambio.pokemonOfrecido.name}</p>
                        <img src={intercambio.pokemonOfrecido.sprite} alt={intercambio.pokemonOfrecido.name} className="w-24 h-24" />
                        <p className="text-red-400"><strong className="text-orange-400">Quiere:</strong> {intercambio.pokemonDeseado.name}</p>
                        <img src={intercambio.pokemonDeseado.sprite} alt={intercambio.pokemonDeseado.name} className="w-24 h-24 " />
                        <button
                            onClick={() => handleClickAceptar(intercambio.id)}
                            className="mt-2 bg-green-600 hover:bg-green-800 cursor-pointer text-white px-4 py-1 rounded"
                        >
                            Aceptar
                        </button>
                        {mostrarAlerta && <AlertaFlotante mensaje={mensajeAlerta} />}
                        {mostrarAnimacion && (
                            <IntercambioAnimacion
                                pokemonSalida={intercambio.pokemonDeseado.sprite}
                                pokemonEntrada={intercambio.pokemonOfrecido.sprite}
                                onDone={() => {
                                    setMostrarAnimacion(false)
                                    setIntercambios((prev) => prev.filter((i) => i.id !== intercambio.id))
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
            <AnimatePresence>
                {mostrarConfirmacion && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-300 p-6 rounded shadow-xl text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className="mb-4 text-lg font-semibold text-black">
                                ¿Estás seguro de que quieres ACEPTAR este intercambio?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={confirmarIntercambio}
                                    className="bg-green-500 hover:bg-green-700 text-white px-4 cursor-pointer py-2 rounded"
                                >
                                    Sí, aceptar
                                </button>
                                <button
                                    onClick={cancelarIntercambio}
                                    className="bg-gray-500 hover:bg-gray-700 cursor-pointer text-black px-4 py-2 rounded"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

}

export default GTSPage
