import { useEffect, useState } from "react"
// import { useAuth } from "../contexts/AuthContext"
import socketGameService  from "../services/multiplayerService"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "./LoadingScreen"
import React from "react"
import { joinedGame } from "../models/Game"

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

    

    const handleJoinGame = () => {
        
        socketGameService.joinGame(parseInt(gameId), password)
        setGoGame(true)

    }
    const handleCreateGame = () => {
        socketGameService.createGame(password)
        setLoading(true)
        socketGameService.onJoinedGame((data: joinedGame) => {
            setInfo(data)
            if (data.ready) {
                setLoading(false)
            }
        })
    }
    
    useEffect(() => {
        socketGameService.connect()
        return () => {
            socketGameService.removeAllListeners()
            socketGameService.disconnect()
        }
    }, [])


    if (loading) return <LoadingScreen />
    else {

        if (!goGame) {
            return (
                <div>
                    <button onClick={() => navigate("/")} className=" cursor-pointer px-2 py-2 bg-red-400 hover:bg-red-600"> Salir </button>
                    {(!joinGame && !createGame) ?
                        <div>
                            <button onClick={() => setCreateGame(true)} className=" cursor-pointer px-2 py-2"> Crear Nueva Partida </button>
                            <button onClick={() => setJoinGame(true)} className=" cursor-pointer px-2 py-2"> Unirse A Partida </button>
                        </div>
                        : joinGame
                            ? (
                                <div>
                                    <input value={gameId} onChange={(e) => setGameId(e.target.value)} placeholder="GameId" ></input>
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" ></input>
                                    <button disabled={!password || !gameId} onClick={handleJoinGame} className=" cursor-pointer px-2 py-2"> Unirse </button>
                                </div>
                            ) : (
                                <div>
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" ></input>
                                    <button onClick={handleCreateGame} disabled={!password} className=" cursor-pointer px-2 py-2">Crear Partida</button>
                                </div>
                            )}
                </div>
            )

        }
        return goGame ? React.cloneElement(children as React.ReactElement,{players: info?.players, gameId: info?.gameId} ) : null
    }
}

export default GameScreen

