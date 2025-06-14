import { useState, useEffect, useRef } from "react"
import PokemonDetails from "../models/PokemonDetails"
import { useAuth } from "../contexts/AuthContext"
import SalidaDatabase, { PokemonDetails2 } from "../models/PokemonFDB"
import { useNavigate } from "react-router-dom"
import UserService from "../services/userService"
import PokemonService from "../services/pokemonService"
import { AnimatePresence, motion } from "framer-motion"
import LoadingScreen from "../components/LoadingScreen"

let stats: string[] = []
const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function Game() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const UserId: number = user?.id || 0
  const buttonRef = useRef<HTMLButtonElement>(null)
  const setStatsWasted = new Set()

  const [win, setWin] = useState<boolean | null>(null)
  const [level, setLevel] = useState(1)
  const [round, setRound] = useState<number>(1)
  const [jugar, setJugar] = useState<boolean>(false)
  const [aiStat, setAiStat] = useState(0)
  const [aiScore, setAiScore] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [userStat, setUserStat] = useState(0)
  const [userScore, setUserScore] = useState<number>(0)
  const [aiPokemons, setAiPokemons] = useState<PokemonDetails[]>([])
  const [loadingTeams, setLoadingTeams] = useState<boolean>(false)
  const [userPokemons, setUserPokemons] = useState<SalidaDatabase[]>([])
  const [selectedStat, setSelectedStat] = useState<string>("")
  const [seeInformation, setSeeInformation] = useState<boolean>(false)
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)
  const [selectedStatIndex, setSelectedStatIndex] = useState<number>(0)
  const [showBattleAnimation, setShowBattleAnimation] = useState<boolean>(false)


  const fetchTeams = async () => {
    stats = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"]
    try {
      if (userPokemons.length < 6) {
        const userResponse = await fetch(API_URL_BASE + `/pokemon/verEquipo?id=${UserId}`)
        const userTeam = await userResponse.json()
        setUserPokemons(userTeam)
      }

      const aiResponse = await fetch(API_URL_BASE + `/pokemon/getTeams?id=${UserId}`)
      const aiTeam = await aiResponse.json()

      setAiPokemons(aiTeam)

      setLevel(await PokemonService.getUserLevel(user?.id))
    } catch (error) {
      console.error("Error al cargar los equipos", error)
    }
  }

  // Esta funcion impone un tiempo minimo de carga, pero no lo alarga en caso de que por si mismo llegue al minimo
  const loadWithMinDelay = async () => {
    setLoadingTeams(true)
    const minDelay = new Promise(resolve => setTimeout(resolve, 2000))
    await Promise.all([fetchTeams(), minDelay])
    setLoadingTeams(false)
  }

  useEffect(() => {

    loadWithMinDelay()
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

  const handleSelectedPokemon = async (userPokemon: SalidaDatabase) => {

    const pokemon: PokemonDetails2 = userPokemon.pokemon
    const userChoice = getUserValue(pokemon)
    const aiPokemon = AiSelection()
    const aiChoice = aiPokemon.stats[selectedStatIndex].base_stat

    setUserStat(userChoice)
    setAiStat(aiChoice)

    if (userChoice > aiChoice) setUserScore(userScore + 1)
    else if (userChoice < aiChoice) setAiScore(aiScore + 1)
    else if (userChoice == aiChoice) {
      const TBSUser = PokemonService.getTBS2(pokemon)
      const TBSAi = PokemonService.getTBS(aiPokemon)
      if (TBSUser > TBSAi) setUserScore(userScore + 1)
      else {
        setAiScore(aiScore + 1)
      }
    }
    setShowBattleAnimation(true)

    setTimeout(() => {
      setShowBattleAnimation(false)
      setSelectedStat("")
      setJugar(false)
    }, 3000)

    if (round == 1 || (round == 2 && (userScore == aiScore))) setRound(round + 1)
    if ((round == 2 && userScore != aiScore) || round == 3) {
      if (userScore > aiScore) setWin(true)
      else setWin(false)
      setTimeout(() => { setLoading(true) }, 3000)

    }

  }

  const getUserValue = (pokemon: PokemonDetails2) => {
    const stats = PokemonService.getArrayFromStats(pokemon)

    return stats[selectedStatIndex]
  }

  const AiSelection = () => {
    let selection = 0
    let pokemon: PokemonDetails = aiPokemons[0]
    for (let i = 0; i < aiPokemons.length; i++) {
      if (aiPokemons[i].stats[selectedStatIndex].base_stat > selection) {
        selection = aiPokemons[i].stats[selectedStatIndex].base_stat
        pokemon = aiPokemons[i]
      }
    }
    return pokemon
  }

  const handleWinner = async () => {
    setStatsWasted.clear()
    setUserScore(0)
    setAiScore(0)
    setAiPokemons([])
    setRound(1)
    setAiStat(0)
    setUserStat(0)

    if (win == true) {
      await fetch(API_URL_BASE + `/user/actualizarlvl?id=${UserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ level: level + 1 }),
        credentials: 'include'
      })

      UserService.actualizarPokePuntos(UserId, [0, level])

    } else {
      await fetch(API_URL_BASE + `/user/actualizarlvl?id=${UserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ level: 0 }),
        credentials: 'include'
      })
    }
  }

  const handleExit = () => {
    navigate("/")

  }

  const handleNextLevel = async () => {
    await handleWinner()
    setTimeout(async () => await fetchTeams(), 1000)
    setLoading(false)
  }
  
  const abrirInfo = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setButtonPosition({ top: rect.top, left: rect.left })
    }
    setSeeInformation(true)
  }

  return (
    <div className="items-center bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 min-h-screen w-full">
      <div className="game-container text-white ">
        {(!loading && !loadingTeams) ? (
          <div className="">
            <h1 className="text-center py-5">¡Bienvenido al Juego Pokémon! Estas en el nivel {level}</h1>
            <div className="flex justify-end" >
              <button className="pr-10" ref={buttonRef} onClick={() => abrirInfo()}>
                <img className="rounded-full w-10 h-10" src="/src/images/infoIcon.jpg"></img>
              </button>
            </div>
            <div className="teams">
              <div className="team">
                <h2 className="text-center text-4xl text-blue-400 py-3">Tu equipo</h2>
                <div className="pokemon-list flex justify-center gap-4 flex-wrap">
                  {userPokemons.map((pokemon) => (
                    <div key={pokemon.id} className="pokemon-card text-center">
                      <button className="py-3 " onClick={async () => setSelectedPokemon(await PokemonService.fetchPokemonDetails(pokemon.id))}>
                        <img src={pokemon.sprite} alt={pokemon.pokemon.name} className="w-24 h-24" />
                      </button>
                      <h1></h1>
                      <button onClick={() => handleSelectedPokemon(pokemon)} disabled={jugar !== true} className="mt-2 align-bottom p-1 bg-blue-600 text-white rounded-3xl ">
                        Choose
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="pt-5 px-80 text-blue-400">Tu Puntuación: {userScore}</p>

            <div className="round-info text-center text-3xl py-6">
              <h2 className="py-2 text-green-400">Ronda {round}</h2>
              <p className="py-2 text-green-400">{selectedStat
                ? `Stat seleccionada: ${selectedStat}`
                : userStat
                  ? `User : ${userStat} ----  Ai : ${aiStat}`
                  : "\u00A0"
              }</p>
              <button disabled={!(!selectedStat)} className="text-green-400" onClick={getRandomStat}>Play</button>
            </div>

            <div className="team">
              <p className="text-right text-red-400 px-80">Puntuación del Rival: {aiScore}</p>
              <h2 className="text-center text-red-400 text-4xl py-4">Equipo rival</h2>

              <div className="pokemon-list flex justify-center gap-4 flex-wrap">
                {aiPokemons.map((pokemon) => (
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
                      <img src={userPokemons.find(p => getUserValue(p.pokemon) === userStat)?.sprite} className="w-32 h-32 mx-auto" />
                      <p className="mt-2">Tú</p>
                      <p className="text-2xl">{userStat}</p>
                    </div>

                    <div className="text-center text-5xl font-extrabold text-red-500">VS</div>

                    <div className="text-center">
                      <img src={AiSelection()?.sprite} className="w-32 h-32 mx-auto" />
                      <p className="mt-2">IA</p>
                      <p className="text-2xl">{aiStat}</p>
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
                    {userStat > aiStat
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
            <AnimatePresence>
              {seeInformation && buttonPosition && (
                <motion.div
                  className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
                  initial={{
                    scale: 0.2,
                    opacity: 0,
                    originX: buttonPosition?.left,
                    originY: buttonPosition?.top,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    originX: 0,
                    originY: 0,
                  }}
                  exit={{
                    scale: 0.2,
                    opacity: 0,
                    x: buttonPosition?.left,
                    y: buttonPosition?.top
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white/85 p-6 text-black rounded-lg shadow-lg w-full max-w-2xl">
                    <p className="text-3xl text-center pb-3 font-black">Game Info</p>
                    <div>
                      <p className="text-xl font-black pb-2">¿Que puedo hacer con mi equipo?</p>
                      <p>
                        En esta panatalla puedes observar, en la parte superior, tu equipo pokemon con 2 funcionalidades. Al clickar sobre tus pokemons
                        podras ver su informacion, ademas, debajo de cada uno hay un boton choose que te permite seleccionar en cada ronda al pokemon que
                        desees.
                      </p>
                      <p className="text-xl font-black pb-2">¿Como se juega?</p>
                      <p>
                        Para jugar presione el boton de Play y se elegira una estadística aleatoria. Luego elige el pokemon que quieras para esa ronda
                        con el boton choose.
                      </p>
                      <p className="text-xl font-black py-2">Sistema de juego: </p>
                      <p>
                        Cada nivel se basa en un sistema BO3 (esto quiere decir que no siempre se jugaran las 3 rondas) y el ganador de cada ronda se
                        decide en funcion de el valor más alto de la estadística del pokemon que escojas y el escogido por la IA y, en caso de empate, se
                        decidirá en base al TBS (suma de todas las stats) de los pokemons escogidos.
                      </p>
                      <p className="text-xl font-black pb-2">Recompensas: </p>
                      <p>
                        Superar un nivel te dara una cantidad de PokePuntos igual al nivel superado. Puedes usar estos PokePuntos para abrir mas sobres
                        y mejorar tu equipo.
                      </p>
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                      onClick={() => setSeeInformation(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          loading ? (
            <div className="flex flex-col items-center justify-center text-white p-6">
              <h1 className="text-3xl font-bold mb-4">
                {win ? '¡Has superado el nivel!' : 'Has perdido este nivel'}
              </h1>
              <p className="text-lg mb-6">
                {win
                  ? `Nivel superado. Prepárate para el nivel ${level + 1}. Has obtenido ${level} PokePuntos`
                  : `No lograste superar el nivel ${level}. ¿Quieres volver a empezar el juego?`}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleExit}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                >
                  Salir
                </button>
                <button
                  onClick={handleNextLevel}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                >
                  {win ? 'Siguiente Nivel' : 'Reintentar Juego'}
                </button>
              </div>
            </div>
          ) : <LoadingScreen/>
        )}
      </div>
    </div>
  )
}


export default Game

