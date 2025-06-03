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


/* interface stat {
    stat: string
    index: number
} */
interface MultiplayerProps {
    players?: {
        player1Id: number
        player2Id: number
    }
    gameId?: number
    url?: string
}

const stats = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"]
const setStatsWasted = new Set()

function Multiplayer({ players, gameId, url }: MultiplayerProps) {



    const { user } = useAuth()

    const [myTeam, setMyTeam] = useState<SalidaDatabase[]>([])
    const [enemyTeam, setEnemyTeam] = useState<SalidaDatabase[]>([])

    const [player1Score, setplayer1Score] = useState<number>(0)
    const [player2Score, setPlayer2Score] = useState<number>(0)
    const [round, setRound] = useState<number>(1)
    const [myStat, setMyStat] = useState<number | null>(null)
    const [enemyStat, setEnemyStat] = useState<number | null>(null)
    const [selectedStat, setSelectedStat] = useState<string>("")
    const [selectedStatIndex, setSelectedStatIndex] = useState<number>(0)
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)
    const [jugar, setJugar] = useState<boolean>(false)
    const [enemySelection, setEnemySelection] = useState<SalidaDatabase | null>()
    const [turn, setTurn] = useState<number>(1)

    const [imPlayer1, setImPlayer1] = useState<boolean>(true)

    const [myId, setMyId] = useState<number>()

    const [myIndex, setMyIndex] = useState<number>(0)

    const [gameWinner, setGameWinner] = useState<string>()


    const [loading, setLoading] = useState(false)
    const [showBattleAnimation, setShowBattleAnimation] = useState<boolean>(false)

    const fetchTeams = async () => {
        const myId = user?.id
        setMyId(myId)

        const enemyId = (user?.id === players?.player1Id) ? players?.player2Id : players?.player1Id
        try {
            const userResponse = await fetch(url + `/pokemon/verEquipo?id=${myId}`)
            const userTeam = await userResponse.json()
            setMyTeam(userTeam)

            const enemyResponse = await fetch(url + `/pokemon/verEquipo?id=${enemyId}`)
            const enemyteam = await enemyResponse.json()
            setEnemyTeam(enemyteam)

            setLoading(false)

        } catch (error) {
            console.error(error instanceof Error ? error.message : "ns q pasa qui")

        }
    }
    const getMyIndex = () => {
        const playerIndex = (players?.player1Id === user?.id) ? 1 : 2
        setMyIndex(playerIndex)
    }
    const setPlayer = async () => {
        const player1id = await PokemonService.getPlayer1Id(gameId || 0)
        console.log(player1id, user?.id)
        if (user?.id !== player1id) {
            setImPlayer1(false)
        } else {
            setImPlayer1(true)
        }
        console.log(imPlayer1)
    }
    useEffect(() => {
        console.log('Actualizó imPlayer1:', imPlayer1)
    }, [imPlayer1])

    useEffect(() => {
        getMyIndex()
        fetchTeams()
        setPlayer()
        socketGameService.connect()
        socketGameService.onStatSelected(function statSelection(stat: string, index: number) {
            setStatInfo(stat, index)
        })
        socketGameService.onGameUpdate(async function gestionarDatos(newData: GameUpdate) {
            console.log("LLega la info del update ", newData) // Solo para comprobaciones 
            setPlayer()
            
            setTurn(newData.gameUpdated.currentTurn)
            if (newData.round.player1Choice) {
                if (players?.player1Id == user?.id) {
                    setMyStat(newData.round.player1Choice.stat)
                    if (newData.round.player2Choice?.pokeId != 0 && newData.round.player2Choice != undefined) {
                        setEnemyStat(newData.round.player2Choice.stat)
                        setEnemySelection(await PokemonService.fetchPokemonDetails(newData.round.player2Choice?.pokeId))
                    }
                } else {
                    setEnemyStat(newData.round.player1Choice.stat)
                    setEnemySelection(await PokemonService.fetchPokemonDetails(newData.round.player1Choice?.pokeId))
                    if (newData.round.player2Choice?.pokeId != 0 && newData.round.player2Choice != undefined) {
                        setMyStat(newData.round.player2Choice.stat)
                    }
                }
            }
            if (newData.round.winner !== null) {
                setShowBattleAnimation(true)
                setTimeout(() => {
                    setShowBattleAnimation(false)
                    setSelectedStat("")
                    setJugar(false)
                    setEnemySelection(null)
                    setMyStat(null)
                    setEnemyStat(null)
                }, 3000)
                setRound(prev => prev + 1)
                
                if (newData.round.winner == "player1") {
                    setplayer1Score(prev => prev + 1)
                } else {
                    setPlayer2Score(prev => prev + 1)
                    
                }
            }
        })
        socketGameService.onGameEnd(async function gestionarFinal(newData: GameEnd) {
            console.log(newData) // Solo para comprobaciones 
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
        socketGameService.statSelection(randomStat, index)
        console.log(randomStat, index)
        setStatInfo(randomStat, index)
    }
    const setStatInfo = (stat: string, index: number) => {

        setSelectedStat(stat)
        stats.splice(index, 1)
        setStatsWasted.add(stat)
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
            selectedStat: Math.floor(selectedStatIndex)
        }
        socketGameService.sendTurn(data)
        console.log(data)

    }
    if (round === 4 || gameWinner) return <EndGameScreen team={myTeam} iWin={(imPlayer1) ? (player1Score >= 2 ? true : false) : (player1Score >= 2 ? false : true) } />

    return (
        <div className="items-center bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 min-h-screen w-full">
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
                                            <button onClick={() => handleSelectedPokemon(pokemon)} disabled={jugar !== true || turn !== myIndex} className="mt-2 align-bottom p-1 cursor-pointer bg-blue-600 text-white rounded-3xl ">
                                                Choose
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="pt-5 px-80 text-blue-400">Tu Puntuación: {(imPlayer1) ? player1Score : player2Score}</p>

                        <div className="round-info text-center text-3xl py-6">
                            <h2 className="py-2 text-green-400">Ronda {round}</h2>
                            <p className="py-2 text-green-400">{selectedStat
                                ? `Stat seleccionada: ${selectedStat}`
                                : (myStat && enemyStat)
                                    ? `My : ${myStat}  ----  Enemy : ${enemyStat}`
                                    : "\u00A0"
                            }</p>
                            <button disabled={!(!selectedStat) || myId == players?.player2Id} className="text-green-400 cursor-pointer" onClick={getRandomStat}>Play</button>
                        </div>

                        <div className="team">
                            <p className="text-right text-red-400 px-80">Puntuación del Rival: {(imPlayer1) ? player2Score : player1Score}</p>
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
        </div>
    )
}

export default Multiplayer
