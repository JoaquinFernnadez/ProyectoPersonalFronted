import { useState, useEffect } from "react";
import PokemonDetails from "../models/PokemonDetails";
import { useAuth } from "../contexts/AuthContext";
import SalidaDatabase, { PokemonDetails2 } from "../models/PokemonFDB";
import { useNavigate } from "react-router-dom";
import { UserService } from "../services/userService";


let stats: string[] = [];
const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function Game() {
  const { user } = useAuth();
  const UserId: number = user?.id || 0
  const [userPokemons, setUserPokemons] = useState<SalidaDatabase[]>([])
  const [aiPokemons, setAiPokemons] = useState<PokemonDetails[]>([])
  const [level, setLevel] = useState(1)
  const [selectedStat, setSelectedStat] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [win, setWin] = useState<boolean | null>(null)
  const [selectedStatIndex, setSelectedStatIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null)
  const [jugar, setJugar] = useState<boolean>(false)
  const navigate = useNavigate()

  const setStatsWasted = new Set()

  const fetchTeams = async () => {
    stats = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"];
    try {
      if (userPokemons.length < 6) {
        const userResponse = await fetch(API_URL_BASE + `/pokemon/verEquipo?id=${UserId}`)
        const userTeam = await userResponse.json()
        setUserPokemons(userTeam)
      }
      // Evitar dobles llamadas a la api en produccion

      const aiResponse = await fetch(API_URL_BASE + `/pokemon/getTeams?id=${UserId}`)
      const aiTeam = await aiResponse.json()
      console.log(aiTeam)
      setAiPokemons(aiTeam)

      setLevel(await getLevel())
    } catch (error) {
      console.error("Error al cargar los equipos", error)
    }
  }

  useEffect(() => {

    fetchTeams()
  }, [])

  const getLevel = async () => {
    const response = await fetch(API_URL_BASE + `/user/level?id=${user?.id}`)
    const userLvl = await response.json()
    return userLvl
  }

  const getRandomStat = () => {


    const index = Math.floor(Math.random() * stats.length)
    const randomStat = stats[index];
    setSelectedStat(randomStat);
    stats.splice(index, 1)
    setStatsWasted.add(randomStat)
    setSelectedStatIndex(index)
    setJugar(true)

  }

  const handleSelectedPokemon = (userPokemon: SalidaDatabase) => {

    const pokemon: PokemonDetails2 = userPokemon.pokemon
    const userChoice = getUserValue(pokemon)
    const aiPokemon = AiSelection()
    const aiChoice = aiPokemon.stats[selectedStatIndex].base_stat

    if (userChoice > aiChoice) setUserScore(userScore + 1)
    else if (userChoice < aiChoice) setAiScore(aiScore + 1)
    else if (userChoice == aiChoice) {
      const TBSUser = getTBS2(pokemon)
      const TBSAi = getTBS(aiPokemon)
      if (TBSUser > TBSAi) setUserScore(userScore + 1)
      else {
        setAiScore(aiScore + 1)
      }
    }
    if (round == 1 || (round == 2 && (userScore == aiScore))) setRound(round + 1)
    if ((round == 2 && userScore != aiScore) || round == 3) {
      if (userScore > aiScore) setWin(true)
      else setWin(false)
      setLoading(true)

    }
    setSelectedStat("")
    setJugar(false)
  }

  const getArrayFromStats = (pokemon: PokemonDetails2) => {
    const userStats = []

    userStats[0] = pokemon.stats.hp
    userStats[1] = pokemon.stats.attack
    userStats[2] = pokemon.stats.defense
    userStats[3] = pokemon.stats["special-attack"]
    userStats[4] = pokemon.stats["special-defense"]
    userStats[5] = pokemon.stats.speed

    return userStats
  }


  const getUserValue = (pokemon: PokemonDetails2) => {
    const stats = getArrayFromStats(pokemon)

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


    if (win == true) {
      const message = await fetch(API_URL_BASE + `/user/actualizarlvl?id=${UserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ level: level + 1 }),
        credentials: 'include'
      })
      console.log(message, "mensaje del res.ststus del backend")

      UserService.actualizarPokePuntos(UserId,[0,level])

    } if (win == false) {
      const message = await fetch(API_URL_BASE + `/user/actualizarlvl?id=${UserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ level: 0 }),
        credentials: 'include'
      })
      console.log(message, "mensaje del res.ststus del backend")
    }



  }


  const getTBS = (pokemon: PokemonDetails) => {
    let TBS = 0
    for (let i = 0; i < 6; i++) {
      TBS += pokemon.stats[i].base_stat
    }
    return TBS
  }
  const getTBS2 = (pokemon: PokemonDetails2) => {
    const TBS = pokemon.stats.attack + pokemon.stats.defense + pokemon.stats.hp + pokemon.stats["special-attack"] + pokemon.stats["special-defense"] + pokemon.stats.speed
    return TBS
  }

  const handleExit = () => {
    navigate("/")

  }
  const handleRetry = async () => {
    await handleWinner()
    setTimeout(async () => await fetchTeams(), 1000)

    setLoading(false)
  }
  const handleNextLevel = async () => {
    await handleWinner()
    setTimeout(async () => await fetchTeams(), 1000)
    setLoading(false)
  }
  const fetchPokemonDetails = async (id: number) => {
    try {
      const response = await fetch(`${API_URL_BASE}/pokemon/getDetail?id=${id}`);
      if (!response.ok) throw new Error("Error al obtener detalles del Pokémon");
      const data = await response.json();
      setSelectedPokemon(data)


    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="items-center bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 h-screen w-full">
      <div className="game-container text-white ">
        {!loading ? (<div>
          <h1 className="text-center py-5">¡Bienvenido al Juego Pokémon! Estas en el nivel {level}</h1>

          <div className="teams">
            <div className="team">
              <h2 className="text-center text-4xl text-blue-400 py-3">Tu equipo</h2>
              <div className="pokemon-list flex justify-center gap-4 flex-wrap">
                {userPokemons.map((pokemon) => (
                  <div key={pokemon.id} className="pokemon-card text-center">
                    <button className="py-3 " onClick={() => fetchPokemonDetails(pokemon.id)}>
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
            <p className="py-2 text-green-400">{selectedStat ? `Stat seleccionada: ${selectedStat}` : "\u00A0"}</p>
            <button disabled={!(!selectedStat)} className="text-green-400" onClick={getRandomStat}>Play</button>
          </div>
          <div className="team">
            <h2 className="text-center text-red-400 text-4xl py-4">Equipo rival</h2>
            <div className="pokemon-list flex justify-center gap-4 flex-wrap">
              {aiPokemons.map((pokemon) => (

                <div key={pokemon.sprite} className="pokemon-card text-center">
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24" />

                </div>
              ))}

            </div>
            <p className="text-right text-red-400 px-80">Puntuación del Rival: {aiScore}</p>

          </div>
          {selectedPokemon && (
            <div className="fixed inset-0 bg-black/60  flex justify-center items-center">
              <div className=" bg-white/85 p-6 text-black rounded-lg shadow-lg w-96">
                <h2 className="text-2xl  font-bold">{(selectedPokemon.name).toUpperCase()}</h2>
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
        </div>) : (<div className="  flex flex-col items-center justify-center  text-white p-6">
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
              onClick={win ? handleNextLevel : handleRetry}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              {win ? 'Siguiente Nivel' : 'Reintentar Juego'}
            </button>
          </div>
        </div>)}
      </div>
    </div>
  )
}


export default Game;

