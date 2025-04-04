import { useState, useEffect } from "react";
import PokemonDetails from "../models/PokemonDetails";
import { useAuth } from "../contexts/AuthContext";
import SalidaDatabase, { PokemonDetails2 } from "../models/PokemonFDB";


const stats = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"];
const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function Game() {
  const { user } = useAuth();
  const [userPokemons, setUserPokemons] = useState<SalidaDatabase[]>([])
  const [aiPokemons, setAiPokemons] = useState<PokemonDetails[]>([])
  const [level, setLevel] = useState(0)
  const [selectedStat, setSelectedStat] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [winner, setWinner] = useState<string | null>(null)
  const [selectedStatIndex, setSelectedStatIndex] = useState<number>(0)

  const setStatsWasted = new Set()

  

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userResponse = await fetch(API_URL_BASE + `/pokemon/verEquipo?id=${user?.id}`)
        const aiResponse = await fetch(API_URL_BASE + `/pokemon/getTeams?id=${user?.id}`)
  
        if (!userResponse.ok || !aiResponse.ok) {
          throw new Error("Error al cargar los equipos");
        }
  
        const userTeam = await userResponse.json()
        const aiTeam = await aiResponse.json()
  
        setUserPokemons(userTeam)
        setAiPokemons(aiTeam)
        console.log(aiTeam)
        setLevel(await getLevel())
      } catch (error) {
        console.error("Error al cargar los equipos", error)
      }
    }

    fetchTeams()
  }, [])

  const getLevel = async () => {
    const response = await fetch(API_URL_BASE + `/user/level?id=${user?.id}`)
    const userLvl = await response.json()
    return userLvl
  }

  /* const recargarAITeam = async () => {
    const aiResponse = await fetch(API_URL_BASE + `/pokemon/getTeams?id=${user?.id}`)
    const aiTeam = await aiResponse.json()
    setAiPokemons(aiTeam)
  } */

  const getRandomStat = () => {
    const index = Math.floor(Math.random() * stats.length)
    const randomStat = stats[index];
    setSelectedStat(randomStat);
    setStatsWasted.add(randomStat)
    setSelectedStatIndex(index)

  }

  const handleSelectedPokemon = (userPokemon: SalidaDatabase) => {
    
    const pokemon: PokemonDetails2 = userPokemon.pokemon
    console.log(pokemon)
    const userChoice = getUserValue(pokemon) 
    const aiPokemon = AiSelection()
    const aiChoice = aiPokemon.stats[selectedStatIndex].base_stat

    if (userChoice > aiChoice) setUserScore(userScore + 1)
    if (userChoice < aiChoice) setAiScore(aiScore + 1)
    if (userChoice == aiChoice) {
      const TBSUser = getTBS2(pokemon)
      const TBSAi = getTBS(aiPokemon)
      if (TBSUser > TBSAi) setUserScore(userScore + 1)
      else {
        setAiScore(aiScore + 1)
      }
    }
    if (round == 1 || (round == 2 && (userScore == aiScore))) setRound(round + 1)
    if ((round == 2 && userScore != aiScore) || round == 3) {
      if (userScore > aiScore) setWinner("user")
      else setWinner("ai")
      handleWinner()
    }
    setSelectedStat("")

  }

  const getArrayFromStats = (pokemon: PokemonDetails2) => {
    const  userStats = []
    userStats[0] = pokemon.stats.hp
    userStats[1] = pokemon.stats.attack
    userStats[2] = pokemon.stats.defense
    userStats[3] = pokemon.stats.special_atk
    userStats[4] = pokemon.stats.special_dfs
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
    const ganador = winner
    if (ganador === "ai") setLevel(0)
    else setLevel(level + 1)
    await fetch(API_URL_BASE + `/user/actualizarlvl?id=${user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(level),
      credentials: 'include'
    })
  }


  const getTBS = (pokemon: PokemonDetails) => {
    let TBS = 0
    for (let i = 0; i < 6; i++) {
      TBS += pokemon.stats[i].base_stat
    }
    return TBS
  }
  const getTBS2 = (pokemon : PokemonDetails2) => {
    const TBS = pokemon.stats.attack + pokemon.stats.defense + pokemon.stats.hp + pokemon.stats.special_atk + pokemon.stats.special_dfs + pokemon.stats.speed
    return TBS    
  }
  /* const getBetterPokemon = (team : PokemonDetails[]) => {
    let betterTBS = 0
    
    for(let i = 0;i<team.length;i++){
        const TBS = getTBS(team[i])
        if(TBS > betterTBS) betterTBS = TBS
    }

  } */
  

  return (
    <>
      <div className="game-container text-white">
        <h1 className="text-center py-5">¡Bienvenido al Juego Pokémon! Estas en el nivel {level}</h1>
        <div className="teams">
          <div className="team">
            <h2 className="text-center text-4xl text-blue-400 py-3">Tu equipo</h2>
            <div className="pokemon-list flex justify-center gap-4 flex-wrap">
              {userPokemons.map((pokemon) => (
                <div key={pokemon.id} className="pokemon-card text-center">
                 
                  <img src={pokemon.sprite} alt={pokemon.pokemon.name} className="w-24 h-24" />
                  
                  <button onClick={() => handleSelectedPokemon(pokemon)} className="mt-2 p-1 bg-blue-600 text-white rounded-3xl ">
                    Choose
                  </button>
                </div>
              ))}
            </div>
          </div>
         
        </div>
        <p className="pt-5 text-blue-400">Tu Puntuación: {userScore}</p>
        <div className="round-info text-center text-3xl py-6">
          <h2 className="py-2 text-green-400">Ronda {round}</h2>
          <p className="py-2 text-green-400">{selectedStat ? `Stat seleccionada: ${selectedStat}` : "\u00A0"}</p>
          <button className="text-green-400" onClick={getRandomStat}>Play</button>
        </div>
        <div className="scoreboard">
          
          <p className="text-right text-red-400">Puntuación del Rival: {aiScore}</p>
        </div>
        <div className="team">
            <h2 className="text-center text-red-400 text-4xl py-4">Equipo rival</h2>
            <div className="pokemon-list flex justify-center gap-4 flex-wrap">
              {aiPokemons.map((pokemon) => (
                
                <div key={pokemon.id} className="pokemon-card text-center">
                  <img src={pokemon.sprite} alt={pokemon.name} className="w-24 h-24" />
                  
                </div>
              ))}
            </div>
          </div>
      </div>
    </>
  )
}






export default Game;

