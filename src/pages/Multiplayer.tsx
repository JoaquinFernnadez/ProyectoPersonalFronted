import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import socketGameService from "../services/multiplayerService"
import LoadingScreen from "../components/LoadingScreen"
import SalidaDatabase, { PokemonDetails2 } from "../models/PokemonFDB"
import { AnimatePresence, motion } from "framer-motion"
import PokemonService from "../services/pokemonService"
import PokemonDetails from "../models/PokemonDetails"
import { GameEnd, GameUpdate } from "../models/Game"
import EndGameScreen from "../components/EndGameScreen"

const API_URL_BASE = import.meta.env.VITE_API_URL

interface MultiplayerProps {
    players?: {
        player1Id: number
        player2Id: number
    }
    gameId?: number
}

const stats = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"]
const setStatsWasted = new Set()

function Multiplayer({ players, gameId }: MultiplayerProps) {

    const { user } = useAuth()

    const [myTeam, setMyTeam] = useState<SalidaDatabase[]>([])
    const [enemyTeam, setEnemyTeam] = useState<SalidaDatabase[]>([])

    const [myScore, setMyScore] = useState<number>(0)
    const [enemyScore, setEnemyScore] = useState<number>(0)
    const [round, setRound] = useState<number>(1)
    const [myStat, setMyStat] = useState<number | null>(null)
    const [enemyStat, setEnemyStat] = useState<number | null>(null)
    const [selectedStat, setSelectedStat] = useState<string>("")
    const [selectedStatIndex, setSelectedStatIndex] = useState<number>(0)
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)
    const [jugar, setJugar] = useState<boolean>(false)
    const [enemySelection, setEnemySelection] = useState<SalidaDatabase>()
    const [turn, setTurn] = useState<number>(1)

    const [myIndex, setMyIndex] = useState<number>(0)

    const [gameWinner, setGameWinner] = useState<string>()


    const [loading, setLoading] = useState(false)
    const [showBattleAnimation, setShowBattleAnimation] = useState<boolean>(false)

    const fetchTeams = async () => {
        const myId = user?.id
        const enemyId = (user?.id === players?.player1Id) ? players?.player2Id : players?.player1Id
        try {

            const userResponse = await fetch(API_URL_BASE + `/pokemon/verEquipo?id=${myId}`)
            const userTeam = await userResponse.json()
            setMyTeam(userTeam)

            const enemyResponse = await fetch(API_URL_BASE + `/pokemon/verEquipo?id=${enemyId}`)
            const enemyteam = await enemyResponse.json()
            setEnemyTeam(enemyteam)

            setLoading(false)

        } catch (error) {
            console.error("Error al cargar los equipos", error)
        }
    }
    const getMyIndex = () => {
        const playerIndex = (players?.player1Id === user?.id) ? 1 : 2
        setMyIndex(playerIndex)
    }

    useEffect(() => {
        getMyIndex()
        fetchTeams()
        socketGameService.connect()
        socketGameService.onGameUpdate(async function gestionarDatos(newData: GameUpdate) {
            if (turn === 2) {
                setShowBattleAnimation(true)
                setTimeout(() => {
                    setShowBattleAnimation(false)
                    setSelectedStat("")
                    setJugar(false)
                }, 3000)
            }
            setTurn(newData.gameUpdated.currentTurn)
            if (newData.round.player1Choice) {
                if (players?.player1Id == user?.id) {
                    setMyStat(newData.round.player1Choice.stat)
                    if (newData.round.player2Choice) {
                        setEnemyStat(newData.round.player2Choice.stat)
                        setEnemySelection(await PokemonService.fetchPokemonDetails(newData.round.player2Choice?.pokeId))
                    }
                } else {
                    setEnemyStat(newData.round.player1Choice.stat)
                    setEnemySelection(await PokemonService.fetchPokemonDetails(newData.round.player1Choice?.pokeId))
                    if (newData.round.player2Choice) {
                        setMyStat(newData.round.player2Choice.stat)
                    }
                }
            }
            setRound(prev => prev + 1)
            if (newData.round.winner == "player1") {
                setMyScore(prev => prev + 1)
            } else {
                setEnemyScore(prev => prev + 1)
            }
        })
        socketGameService.onGameEnd(async function gestionarFinal(newData: GameEnd) {
            console.log(newData)
            setGameWinner(newData.finalGameState.winner || "vacio")
        })
        return () => {
            socketGameService.removeAllListeners()
            socketGameService.disconnect()
        }
    }, [])

    const getRandomStat = () => {
        const index = Math.floor(Math.random() * stats.length)
        const randomStat = stats[index]
        setSelectedStat(randomStat)
        stats.splice(index, 1)
        setStatsWasted.add(randomStat)
        setSelectedStatIndex(index)
        setJugar(true)
    }
    const getUserValue = (pokemon: PokemonDetails2) => {
        const stats = PokemonService.getArrayFromStats(pokemon)

        return stats[selectedStatIndex]
    }
    const handleSelectedPokemon = (pokemon: SalidaDatabase) => {
        const data = {
            gameId: gameId || 0,
            playerId: user?.id || 0,
            turn,
            choice: pokemon.id,
            roundNumber: round,
            selectedStat: selectedStatIndex
        }
        socketGameService.sendTurn(data)
        console.log(data)

    }
    if (gameWinner) return <EndGameScreen team={myTeam} iWin={myScore > 1 ? true : false}/>

    return (
        <>
            {loading ? <LoadingScreen />
                : (
                    <div className="">
                        <div className="teams">
                            <div className="team">
                                <h2 className="text-center text-4xl text-blue-400 py-3">Tu equipo</h2>
                                <div className="pokemon-list flex justify-center gap-4 flex-wrap">
                                    {myTeam.map((pokemon) => (
                                        <div key={pokemon.id} className="pokemon-card text-center">
                                            <button className="py-3 " onClick={async () => setSelectedPokemon(await PokemonService.fetchPokemonDetails(pokemon.id))}>
                                                <img src={pokemon.sprite} alt={pokemon.pokemon.name} className="w-24 h-24" />
                                            </button>
                                            <h1></h1>
                                            <button onClick={() => handleSelectedPokemon(pokemon)} disabled={jugar !== true || turn !== myIndex} className="mt-2 align-bottom p-1 bg-blue-600 text-white rounded-3xl ">
                                                Choose
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="pt-5 px-80 text-blue-400">Tu Puntuación: {myScore}</p>

                        <div className="round-info text-center text-3xl py-6">
                            <h2 className="py-2 text-green-400">Ronda {round}</h2>
                            <p className="py-2 text-green-400">{selectedStat
                                ? `Stat seleccionada: ${selectedStat}`
                                : (myStat && enemyStat)
                                    ? `My : ${myStat} ----  Enemy : ${enemyStat}`
                                    : "\u00A0"
                            }</p>
                            <button disabled={!(!selectedStat)} className="text-green-400" onClick={getRandomStat}>Play</button>
                        </div>

                        <div className="team">
                            <p className="text-right text-red-400 px-80">Puntuación del Rival: {enemyScore}</p>
                            <h2 className="text-center text-red-400 text-4xl py-4">Equipo rival</h2>

                            <div className="pokemon-list flex justify-center gap-4 flex-wrap">
                                {enemyTeam.map((pokemon) => (
                                    <div key={pokemon.sprite} className="pokemon-card text-center">
                                        <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24" />
                                    </div>
                                ))}
                            </div>

                        </div>
                        <AnimatePresence>
                            {showBattleAnimation && (
                                <motion.div
                                    className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center z-50 text-white"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="text-4xl font-bold mb-6">¡Batalla Pokémon!</div>

                                    <div className="flex items-center justify-around w-full max-w-4xl px-10">
                                        <div className="text-center">
                                            <img src={myTeam.find(p => getUserValue(p.pokemon) === myStat)?.sprite} className="w-32 h-32 mx-auto" />
                                            <p className="mt-2">Tú</p>
                                            <p className="text-2xl">{myStat}</p>
                                        </div>

                                        <div className="text-center text-5xl font-extrabold text-red-500">VS</div>

                                        <div className="text-center">
                                            <img src={enemySelection?.sprite} className="w-32 h-32 mx-auto" />
                                            <p className="mt-2">Enemy</p>
                                            <p className="text-2xl">{enemyStat}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-2xl">
                                        Stat: <span className="capitalize text-yellow-300">{selectedStat}</span>
                                    </div>

                                    <motion.div
                                        className="mt-4 text-3xl font-bold"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2 }}
                                    >
                                        {(myStat || 0) > (enemyStat || 0)
                                            ? "¡Ganaste la ronda!"
                                            : "Perdiste la ronda..."
                                        }
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {selectedPokemon && (
                            <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
                                <div className="bg-white/85 p-6 text-black rounded-lg shadow-lg w-96">
                                    <h2 className="text-2xl font-bold">{(selectedPokemon.name).toUpperCase()}</h2>
                                    <h3 className="mt-3 font-bold">Estadísticas:</h3>
                                    <ul>
                                        {selectedPokemon.stats.map((stats) => (
                                            <li key={stats.stat}>{stats.stat}: {stats.base_stat}</li>
                                        ))}
                                    </ul>
                                    <button
                                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                                        onClick={() => setSelectedPokemon(null)}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </>
    )
}

export default Multiplayer
