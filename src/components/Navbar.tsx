import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { user } = useAuth();

  return (
    

<nav className="bg-white border-gray-200 dark:bg-gray-900">
<div className=" text-gray-400 max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
{user ? user.email : ''}

  
  <div className="items-center  justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar">
    <ul className="flex flex-col  p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ">
      <li>
        <Link to="/" className="block py-2 px-3 text-white  bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</Link>
      </li>
      <li>
        <Link to="/complaints" className="block py-2 px-3 text-white  bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Complaints</Link>
      </li>
      <li>
        <Link to="/users" className="block py-2 px-3 text-white  bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Usuarios</Link>
      </li>
    </ul>
  </div> 
  </div>
</nav>

  )
}

export default Navbar