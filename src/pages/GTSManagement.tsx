import { useEffect, useState } from "react";
import Intercambio from "../models/Intercambios";
import { useAuth } from "../contexts/AuthContext";
import PokemonService from "../services/pokemonService";
import { AutoCompleteInput } from "../components/AutoCompleteInput";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const GTSManagement = () => {

    const { user } = useAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [intercambios, setIntercambios] = useState<Intercambio[]>([])
    const [pokemonDeseado, setPokemonDeseado] = useState("")
    const [listaDePokemon, setListaDePokemon] = useState<string[]>([])
    const [pokemonOfrecido, setPokemonOfrecido] = useState("")
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [intercambioAEliminar, setIntercambioAEliminar] = useState<number | null>(null)

    const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

    const fetchIntercambios = async () => {
        setLoading(true)

        const response = await fetch(API_URL_BASE + `/pokemon/gts/own?id=${user?.id}`)
        const data = await response.json()
        setIntercambios(data)
        setLoading(false)
    }


    useEffect(() => {

        cargarDatos()
        fetchIntercambios()
    }, [])

    const cargarDatos = async () => {
        const data = await fetch(API_URL_BASE + '/pokemon/listPokeNames')
        const pokemons = await data.json()
        setListaDePokemon(pokemons)
    }

    const handleCrearIntercambio = async () => {
        const id = await PokemonService.getId(`https://pokeapi.co/api/v2/pokemon/${pokemonOfrecido}`)
        const id2 = await PokemonService.getId(`https://pokeapi.co/api/v2/pokemon/${pokemonDeseado}`)

        try {
            const responseSpriteOfrecido = await fetch(API_URL_BASE + `/pokemon/getSprite?name=${pokemonOfrecido}`)
            const sprite = await responseSpriteOfrecido.json()
            const responseSpriteDeseado = await fetch(API_URL_BASE + `/pokemon/getSprite?name=${pokemonDeseado}`)
            const sprite2 = await responseSpriteDeseado.json()
            const res = await fetch(API_URL_BASE + "/pokemon/gts/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usuarioId: user?.id,
                    userPokemonId: id,
                    pokemonSprite: sprite,
                    pokemonDeseadoId: id2,
                    pokemonDeseadoSprite: sprite2,
                }),
            })

            if (!res.ok) throw new Error("No se pudo crear el intercambio")

            fetchIntercambios()
        } catch (err) {
            alert(err)
        }
    }

    const handleClickEliminar = (id: number) => {
        setIntercambioAEliminar(id)
        setMostrarConfirmacion(true)
    }

    const confirmarEliminacion = async () => {
        try {

            await PokemonService.handleEliminarIntercambio(intercambioAEliminar || 0)
            
            setIntercambios((prev) => prev.filter((i) => i.id !== intercambioAEliminar))
            
        } catch (error) {
            console.log("error" + error)
        } finally {
            setMostrarConfirmacion(false)
            setIntercambioAEliminar(null)
        }

    }

    const cancelarEliminacion = () => {
        setMostrarConfirmacion(false)
        setIntercambioAEliminar(null)
    }



    return loading ? (
        <div className="flex flex-col items-center justify-center text-white p-6 h-screen">
            <img src="src/images/poketu.png" className="pb-15" />
            <img
                src="src/images/pokeball2.png"
                alt="Pokéball Spinner"
                className="w-24 h-24 animate-spin mb-4 rounded-full"
            />
            <p className="text-xl mb-4 py-5 text-blue-400">Cargando GTS...</p>
            <div className="flex justify-center items-center space-x-4 mb-4 pt-5">
                <img src="src/images/1.png" alt="Pokémon" className="w-16 h-16 animate-ping" />
                <img src="src/images/4.png" alt="Pokémon" className="w-16 h-16 animate-ping" />
                <img src="src/images/7.png" alt="Pokémon" className="w-16 h-16 animate-ping" />
            </div>
        </div>
    ) : (
        <div className="p-6 bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 min-h-screen w-full ">
            <h2 className="text-5xl font-bold text-orange-400 mb-4 text-center pb-8 pt-10">Tus Intercambios</h2>

            {/* Crear Intercambio */}
            <div className="mb-6 text-center pb-10">
                <div className="flex justify-end  pb-6">
                    <button onClick={() => navigate("/gts")} className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white rounded py-2 px-3">Volver</button>
                </div>
                <AutoCompleteInput
                    value={pokemonOfrecido}
                    onChange={setPokemonOfrecido}
                    listaDeOpciones={listaDePokemon}
                    color="text-red-300"
                />
                <AutoCompleteInput
                    value={pokemonDeseado}
                    onChange={setPokemonDeseado}
                    listaDeOpciones={listaDePokemon}
                    color="text-green-400"
                />
                <button
                    onClick={handleCrearIntercambio}
                    className="bg-green-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-800"
                >
                    Crear Intercambio
                </button>


            </div>

            {/* Mostrar Intercambios */}
            <div className=" gap-4 flex flex-wrap justify-evenly ">
                {intercambios.map((intercambio) => (
                    <div key={intercambio.id} className="border p-4 rounded shadow flex flex-col items-center w-72 bg-black/20 ">
                        <p className="text-red-400"><strong className="text-orange-400">Ofreces:</strong> {intercambio.pokemonOfrecido.name}</p>
                        <img src={intercambio.pokemonOfrecido.sprite} alt={intercambio.pokemonOfrecido.name} className="w-24 h-24" />
                        <p className="text-green-400"><strong className="text-orange-400">Quieres:</strong> {intercambio.pokemonDeseado.name}</p>
                        <img src={intercambio.pokemonDeseado.sprite} alt={intercambio.pokemonDeseado.name} className="w-24 h-24 " />
                        <button
                            onClick={() => handleClickEliminar(intercambio.id)}
                            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded cursor-pointer"
                        >
                            Eliminar
                        </button>
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
                            className="bg-gray-200 p-6 rounded shadow-xl text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <p className="mb-4 text-lg font-semibold text-black">
                                ¿Estás seguro de que quieres Eliminar este intercambio?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={confirmarEliminacion}
                                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 cursor-pointer rounded"
                                >
                                    Sí, eliminar
                                </button>
                                <button
                                    onClick={cancelarEliminacion}
                                    className="bg-gray-500 hover:bg-gray-700 text-black px-4 py-2 cursor-pointer rounded"
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

export default GTSManagement
