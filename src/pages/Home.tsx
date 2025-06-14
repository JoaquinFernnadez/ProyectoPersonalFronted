import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import HomeCard from "../components/HomeCard"

function Home() {
  const { user } = useAuth()

  return (
    <div className="text-white flex-wrap  bg-gradient-to-bl from-purple-800 via-gray-900 to-blue-800 min-h-screen w-screen">
      
      <div className="flex justify-center items-center"><img src= "src/images/poketu.png" className="py-10"></img></div>

      {user ? (<div className="flex flex-wrap justify-evenly px-20 text-white">
        
        <HomeCard
          title="Game"
          description="Do you wanna test the strong of your team? Here u can see what level your team can reach"
          image="src/images/game.png"
          route="/game"
          gradient="from-blue-700 to-purple-700"
        />

        <HomeCard
          title="PokePacks"
          description="Here u can unlock new pokemons to build a stronger Team."
          image="src/images/mejorespacks.webp"
          route="/packs"
          gradient="from-purple-700 to-blue-700"
        />

        <HomeCard
          title="Pokedex"
          description="A realy good tool to see all pokemons and know which ones still didn’t appear. Check your own too!"
          image="src/images/pokedex.jpeg"
          route="/pokedex"
          gradient="from-blue-700 to-purple-700"
        />

        <HomeCard
          title="Mi equipo"
          description="Here you can see your 6 selected pokemons for your team."
          image="src/images/equipo.jpg"
          route="/myteam"
          gradient="from-purple-700 to-blue-700"
        />

        <HomeCard
          title="Multiplayer"
          description="Click here and play with other Pokemon trainers to become the best"
          image="src/images/pokenews.jpg"
          route="/multiplayer"
          gradient="from-blue-700 to-purple-700"
        />

        <HomeCard
          title="GTS"
          description="Search for trades to unlock all pokemons!"
          image="src/images/gts.jpg"
          route="/gts"
          gradient="from-purple-700 to-blue-700"
        />

      </div>
      ) : (

        <div className="text-center text-2xl " >
          <p className="text-red-700 py-4">¡No estás autenticado!</p>
          <Link to="/login">Iniciar sesión</Link> | <Link to="/register">Registrarse</Link>
        </div>

      )}
    </div>
  )

}

export default Home