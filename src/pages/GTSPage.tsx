import { useEffect, useState } from "react";
import Intercambio from "../models/Intercambios";
import { useAuth } from "../contexts/AuthContext";
import PokemonService from "../services/pokemonService";

const GTSPage = () => {

    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [intercambios, setIntercambios] = useState<Intercambio[]>([])
    const [pokemonDeseado, setPokemonDeseado] = useState("")
    const [pokemonOfrecido, setPokemonOfrecido] = useState("")


    const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

    useEffect(() => {
        const fetchIntercambios = async () => {
            const response = await fetch(API_URL_BASE + "/api/pokemon/gts")
            const data = await response.json()
            setIntercambios(data)
            setLoading(false)
        }

        fetchIntercambios()
    }, [])

    const handleCrearIntercambio = async () => {
        try {
            const res = await fetch("/api/pokemon/gts/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usuarioId: user?.id, 
                    pokemonOfrecido,
                    spriteOfrecido: "", // ruta del sprite, si lo tienes
                    pokemonDeseado,
                }),
            })

            if (!res.ok) throw new Error("No se pudo crear el intercambio")

            const nuevoIntercambio = await res.json()
            alert("Intercambio creado con éxito")
            setIntercambios((prev) => [...prev, nuevoIntercambio])
        } catch (err) {
            alert(err)
        }
    }

    const handleAceptarIntercambio = async (id: number) => {
        await PokemonService.handleAceptarIntercambio(id)
        setIntercambios((prev) => prev.filter((i) => i.id !== id))
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
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Intercambios GTS</h2>
      
          {/* Crear Intercambio */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Pokémon Ofrecido"
              value={pokemonOfrecido}
              onChange={(e) => setPokemonOfrecido(e.target.value)}
              className="border rounded p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Pokémon Deseado"
              value={pokemonDeseado}
              onChange={(e) => setPokemonDeseado(e.target.value)}
              className="border rounded p-2 mr-2"
            />
            <button
              onClick={handleCrearIntercambio}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crear Intercambio
            </button>
          </div>
      
          {/* Mostrar Intercambios */}
          <div className="grid gap-4">
            {intercambios.map((i) => (
              <div key={i.id} className="border p-4 rounded shadow">
                <p><strong>Ofrece:</strong> {i.pokemonOfrecido.name}</p>
                <p><strong>Quiere:</strong> {i.pokemonDeseado.name}</p>
                <button
                  onClick={() => handleAceptarIntercambio(i.id)}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
                >
                  Aceptar
                </button>
              </div>
            ))}
          </div>
        </div>
      )
      
}

export default GTSPage
