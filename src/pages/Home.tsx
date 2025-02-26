import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() { // Acabar la redireccion del click a la pagina correspondiente 
  const { user } = useAuth()
  const navigate = useNavigate();
  const handleClick1 = () => {
    navigate('./Pokedex')
}
const handleClick2 = () => {
  navigate('./Packs')
}
const handleClick3 = () => {
  navigate('./TeamSelector')
}
const handleClick4 = () => {
  navigate('./Myteam')
}


  return (
    <div flex-wrap >
      <h1>Bienvenido a la aplicación</h1>
      {user ? (<div>
        <p>Hola, {user.nameUSer}! 🎉</p>
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <img className="rounded-t-lg" src="/images/pokedex.jpeg" alt="" />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Pokedex</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">A realy good tool for user to see all pokemons and know what Pokemons still didnt appear. U Also can check 
            pokemon details of that pokemons u already have.
          </p>
          <button  onClick={() => handleClick1()}> </button>
        </div>
      </div>
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <img className="rounded-t-lg" src="/images/mejorespacks.webp" alt="" />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">PokePacks AbreTu</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here u can unlock new pokemons to build a stronger Team</p>
          <button  onClick={() => handleClick2()}> </button>
        </div>
      </div>
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <img className="rounded-t-lg" src="/images/pokemons.webp" alt="" />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Mis pokemons</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here you can see all your unlocked pokemons and also select what 6 pokemons are gonna be part of your team </p>
          <button  onClick={() => handleClick3()}> </button>
        </div>
      </div>
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <img className="rounded-t-lg" src="/images/equipo.jpg" alt="" />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Mi equipo</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here you can see your 6 selected pokemons for your team</p>
          <button  onClick={() => handleClick4()}> </button>
        </div>
      </div>
      </div>
      ) : (
        <div>
          <p>¡No estás autenticado!</p>
          <Link to="/login">Iniciar sesión</Link> | <Link to="/register">Registrarse</Link>
        </div>
      )}
    </div>
  )

}

export default Home