import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SalidaDatabase from "../models/PokemonFDB"
import { useAuth } from "../contexts/AuthContext"

type FinalScreenProps = {
    team: SalidaDatabase[]
    iWin: boolean
}

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function EndGameScreen({ team, iWin }: FinalScreenProps) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [wins, setWins] = useState<number>()

    useEffect(() => {
        console.log(iWin)
        const fetchWins = async () => {
            const winsRepsonse = await fetch(API_URL_BASE + `/user/getWins?id=${user?.id}`)
            const wins = await winsRepsonse.json() as number
            setWins(wins)
        }
        fetchWins()
    }, [])

    return (
        <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 w-full h-screen">

            <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 text-white p-6 rounded-2xl shadow-xl border-4 border-yellow-400 text-center">
                <h1 className="text-3xl font-bold text-yellow-400 mb-4 drop-shadow">{iWin ? "Has Ganado" : "Has Perdidio"}</h1>

                <p className="text-lg text-cyan-300 mb-6">
                    Victorias Totales: <span className="font-semibold text-white">{wins}</span>
                </p>

                <div className="grid grid-cols-3 gap-4 justify-items-center">
                    {team.map((poke) => (
                        <div
                            key={poke.id}
                            className="bg-gray-900 p-5 rounded-xl border-2 border-yellow-300 w-36 flex flex-col items-center"
                        >
                            <img
                                src={poke.sprite}
                                alt={poke.name}
                                className="w-16 h-16 mb-1"
                            />
                            <p className="text-sm text-white">{poke.name}</p>
                        </div>
                    ))}
                </div>


                <button
                    className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    )
}

export default EndGameScreen
