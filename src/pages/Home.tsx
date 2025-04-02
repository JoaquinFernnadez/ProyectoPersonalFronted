import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() { // Acabar la redireccion del click a la pagina correspondiente 
  const { user } = useAuth()
  const navigate = useNavigate();


  return (
    <div className="text-white flex-wrap ">
      <h1 className="flex justify-center text-6xl">Bienvenido a PokeTu</h1>
      
      {user ? (<div className="flex flex-wrap justify-center py-10 px-50 text-white">
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-5">
          <img src="src/images/pokedex.jpeg" className="rounded h-55"/>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Pokedex</h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">A realy good tool for users to see all pokemons and know what Pokemons still didnt appear. U also can check 
            pokemon details of that pokemons u already have.
          </p>
          <button className="mt-auto w-full border border-gray-600 bg-gray-700 hover:bg-blue-900  h-10 w-15 rounded" onClick={() => navigate('/pokedex')}>GO</button>
        </div>
      </div>
        <div className="flex max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">

        <div className="flex flex-col p-5">
        <img src="src/images/mejorespacks.webp" className="rounded h-55"/>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">PokePacks  </h5>
          
          <p className="mb-3 font-normal text-gray-700  dark:text-gray-400">Here u can unlock new pokemons to build a stronger Team.</p>
          <button className="mt-auto w-full border border-gray-600 bg-gray-700 hover:bg-blue-900  h-10 w-15 rounded" onClick={() => navigate('/packs')}>GO</button>
        </div>
      </div>
      <div className="flex max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">

        <div className="flex flex-col p-5">
        <img src="src/images/pokemons.webp" className="rounded h-55"/>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Mis pokemons</h5>
          
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here you can see all your unlocked pokemons and also select what 6 pokemons are gonna be part of your team. </p>
          <button className="mt-auto w-full border border-gray-600 bg-gray-700 hover:bg-blue-900  h-10 w-15 rounded" onClick={() => navigate('/team')}>GO</button>
        </div>
      </div>
      <div className="flex max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col p-5">
        <img src="src/images/equipo.jpg" className="rounded h-55"/>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Mi equipo</h5>
          
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here you can see your 6 selected pokemons for your team.</p>
          <button className="mt-auto w-full border border-gray-600 bg-gray-700 hover:bg-blue-900  h-10 w-15 rounded" onClick={() => navigate('/myteam')}>GO</button>
        </div>
      </div>
      </div>
      ) : (
        <div className="text-center text-2xl " >
          <p>¡No estás autenticado!</p>
          <Link to="/login">Iniciar sesión</Link> | <Link to="/register">Registrarse</Link>
        </div>
      )}
    </div>
  )

}

export default Home