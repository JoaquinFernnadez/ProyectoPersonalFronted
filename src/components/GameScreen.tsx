import { useEffect, useState } from "react"
// import { useAuth } from "../contexts/AuthContext"
import socketGameService from "../services/multiplayerService"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "./LoadingScreen"
import React from "react"
import { joinedGame } from "../models/Game"
import { AutoCompleteInput } from "./AutoCompleteInput"
import { useAuth } from "../contexts/AuthContext"
import socket from "../sockets/socket"
import PokemonService from "../services/pokemonService"

const GameScreen = ({ children }: { children: React.ReactNode }) => {

    // const { user } = useAuth()
    const navigate = useNavigate()

    const [goGame, setGoGame] = useState(false)
    const [info, setInfo] = useState<joinedGame>()
    const [createGame, setCreateGame] = useState(false)
    const [joinGame, setJoinGame] = useState(false)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [gameId, setGameId] = useState("")
    const [gamesOn, setGamesOn] = useState<string[]>([])

    const { user } = useAuth()
    const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

    const handleJoinGame = async () => {
        
        socketGameService.joinGame(parseInt(gameId), user?.id as number, password)
        const player1 = await PokemonService.getPlayer1Id(parseInt(gameId))
        
        setGoGame(true)
        setInfo({gameId: parseInt(gameId), players: {player1Id: player1, player2Id: user?.id as number}, ready: true})

    }
    const searchGamesOn = async () => {
        const response = await fetch(API_URL_BASE + `/pokemon/games`)
        const games = await response.json() as number[]
        const gamesAsString: string[] = games.map(id => id.toString())
        setGamesOn(gamesAsString)
    }
    const handleCreateGame = () => {
        if (!socket.connected) {
            console.log("Esperando conexión de socket...")
            socket.once("connect", () => {
                console.log("✅ Socket conectado")
                socketGameService.createGame(password, user?.id as number)
            })
        } else {
            console.log("✅ Socket ya conectado")
            socketGameService.createGame(password, user?.id as number)
        }

        setLoading(true)


    }

    useEffect(() => {
        socketGameService.connect()
        searchGamesOn()
        socketGameService.onJoinedGame((data: joinedGame) => {
            setInfo(data)
            if (data.ready) {
                setLoading(false)
                setGoGame(true)
            }
        })
        return () => {
            socketGameService.removeAllListeners()
            socketGameService.disconnect()
        }
    }, [])


    if (loading) return <LoadingScreen />
    else {

        if (!goGame) {
            return (
                <div className="flexl flex-col  justify-items-center bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 w-full h-screen ">

                    {(!joinGame && !createGame) ?
                        <div className="flex flex-col items-center py-20 space-y-6">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setCreateGame(true)}
                                    className="cursor-pointer px-4 py-2 bg-green-400 rounded"
                                >
                                    Crear Nueva Partida
                                </button>
                                <button
                                    onClick={() => setJoinGame(true)}
                                    className="cursor-pointer px-4 py-2 bg-amber-500 rounded"
                                >
                                    Unirse A Partida
                                </button>
                            </div>

                            <button
                                onClick={() => navigate("/")}
                                className="rounded cursor-pointer px-4 py-2 bg-red-400 hover:bg-red-600"
                            >
                                Salir
                            </button>
                        </div>

                        : joinGame
                            ? (
                                <div className="py-20 flex flex-col items-center space-y-4">
                                    <div className="flex space-x-4">
                                        <AutoCompleteInput
                                            value={gameId}
                                            onChange={setGameId}
                                            listaDeOpciones={gamesOn}
                                            color="text-white"
                                            placeholder="GameId">
                                        </AutoCompleteInput>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className=" border rounded p-2 mr-2 bg-black border-gray-500 text-white" ></input>
                                        <p className="text-transparent">///</p>
                                        <button disabled={!password || !gameId} onClick={handleJoinGame} className=" cursor-pointer px-2 py-2 border bg-green-600 rounded  hover:bg-green-700 disabled:opacity-30 "> Unirse </button>
                                    </div>
                                    <button
                                        className="rounded cursor-pointer bg-red-500 hover:bg-red-600 py-2 px-4 mt-4"
                                        onClick={() => setJoinGame(false)}
                                    >
                                        Volver
                                    </button>
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center space-y-4">
                                    <div className="flex space-x-4">
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            className="border rounded p-2 mr-2 bg-black border-gray-500 text-white"
                                        />
                                        <button
                                            onClick={handleCreateGame}
                                            disabled={!password}
                                            className="cursor-pointer px-2 py-2 border bg-green-600 rounded hover:bg-green-700 disabled:opacity-30"
                                        >
                                            Crear Partida
                                        </button>
                                    </div>
                                    <button
                                        className="rounded cursor-pointer bg-red-500 hover:bg-red-600 py-2 px-4 mt-4"
                                        onClick={() => setCreateGame(false)}
                                    >
                                        Volver
                                    </button>
                                </div>

                            )}

                </div>
            )

        }
        return goGame ? React.cloneElement(children as React.ReactElement, { players: info?.players, gameId: info?.gameId, url: API_URL_BASE}) : null
    }
}

export default GameScreen

