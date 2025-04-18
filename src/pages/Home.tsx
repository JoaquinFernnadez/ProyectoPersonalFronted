import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate();


  return (
    <div className="text-white flex-wrap bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 h-400 w-screen">
      <h1 className="flex text-blue-400 py-18 justify-center text-6xl">Bienvenido a PokeTu</h1>

      {user ? (<div className="flex flex-wrap justify-center  px-20 text-white">
        <div className="flex max-w-sm pr-5  border-gray-200 rounded-lg shadow-sm  dark:border-gray-700">

          <div className="flex flex-col p-5  rounded">
            <img src="src/images/game.png" className="rounded h-55" />
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-blue-400">Game  </h5>

            <p className="mb-3 font-normal text-gray-700  dark:text-green-300">Do you wanna test the strong of your team?. Here u can see what level your team can reach</p>
            <button className="mt-auto w-full text-blue-300 border border-gray-600 bg-gray-700 hover:bg-green-800  h-10  rounded" onClick={() => navigate('/game')}>GO</button>
          </div>
        </div>
        <div className="flex max-w-sm  pl-5 border-gray-200 rounded-lg shadow-sm  dark:border-gray-700">

          <div className="flex flex-col p-5  rounded">
            <img src="src/images/pokenews.jpg" className="rounded h-55" />
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-blue-400">News  </h5>

            <p className="mb-3 font-normal text-gray-700  dark:text-green-300">Do you wanna stay informed about all Pokemon news?. Then click here and know about all Pokemon news</p>
            <button className="mt-auto w-full text-blue-300 border border-gray-600 bg-gray-700 hover:bg-green-800  h-10  rounded" onClick={() => navigate('/news')}>GO</button>
          </div>
        </div>
        <div className="max-w-sm  pr-5 rounded-lg shadow-sm  dark:border-gray-700">
          <div className="p-5    rounded ">
            <img src="src/images/pokedex.jpeg" className="rounded h-55" />
            <h5 className="mb-2 text-2xl text-center font-bold  tracking-tight text-gray-900 dark:text-blue-400">Pokedex</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-green-300">A realy good tool for users to see all pokemons and know what Pokemons still didnt appear. U also can check
              pokemon details of that pokemons u already have.
            </p>
            <button className="mt-auto w-full text-blue-300 border border-gray-600 bg-gray-700 hover:bg-green-800  h-10  rounded" onClick={() => navigate('/pokedex')}>GO</button>
          </div>
        </div>
        <div className="flex max-w-sm pl-5  border-gray-200 rounded-lg shadow-sm  dark:border-gray-700">

          <div className="flex flex-col p-5 rounded">
            <img src="src/images/mejorespacks.webp" className="rounded h-55" />
            <h5 className="mb-2 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-blue-400">PokePacks  </h5>

            <p className="mb-3 font-normal text-gray-700  dark:text-green-300">Here u can unlock new pokemons to build a stronger Team.</p>
            <button className="mt-auto w-full text-blue-300 border border-gray-600 bg-gray-700 hover:bg-green-800  h-10  rounded" onClick={() => navigate('/packs')}>GO</button>
          </div>
        </div>
        <div className="flex max-w-sm  pr-5 border-gray-200 rounded-lg shadow-sm  dark:border-gray-700">

          <div className="flex flex-col p-5  rounded">
            <img src="src/images/pokemons.webp" className="rounded h-55" />
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-blue-400">Mis pokemons</h5>

            <p className="mb-3 font-normal text-gray-700 dark:text-green-300">Here you can see all your unlocked pokemons and also select what 6 pokemons are gonna be part of your team. </p>
            <button className="mt-auto w-full text-blue-300 border border-gray-600 bg-gray-700 hover:bg-green-800  h-10  rounded" onClick={() => navigate('/team')}>GO</button>
          </div>
        </div>
        <div className="flex max-w-sm  pl-5
         border-gray-200 rounded-lg shadow-sm  dark:border-gray-700">
          <div className="flex flex-col p-5  rounded">
            <img src="src/images/equipo.jpg" className="rounded h-55" />
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-blue-400">Mi equipo</h5>

            <p className="mb-3 font-normal text-gray-700 dark:text-green-300">Here you can see your 6 selected pokemons for your team.</p>
            <button className="mt-auto w-full  text-blue-300 border border-gray-600 bg-gray-700 hover:bg-green-800  h-10  rounded" onClick={() => navigate('/myteam')}>GO</button>
          </div>
        </div>

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