import { useEffect, useState } from 'react'
import { fetchAPI } from '../utils/FetchAPI'
import User from '../models/User'

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function UserList() {

  const [users, setUsers] = useState<User[]>([])
  const [orden, setOrden] = useState("desc")
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [criterioOrden, setCriterioOrden] = useState('maxLevel')

  useEffect(() => {

    async function fetchUsers() {
      try {
        const userList = await fetchAPI(API_URL_BASE + `/user/bestScores`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        setUsers(userList)  // ordenados por MaxLevel    desc
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error desconocido'
        setMessage(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

   function handleOrdenChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const valor = e?.target.value
    setCriterioOrden(valor  )
    let auxUsers: User[] = []

    if (valor === "wins") auxUsers = ([...users].sort((a, b) => b.wins - a.wins))
      else if (valor  === "maxLevel") auxUsers = ([...users].sort((a, b) => b.maxLevel - a.maxLevel))
      else auxUsers = ([...users].sort((a, b) => b.id - a.id))

    if (orden == "asc") {
      setUsers(auxUsers.reverse())
    }else{
      setUsers(auxUsers)
    }
  }

  const toggleOrden = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value
    setOrden(valor)
  }

  if (loading) return <div>Loading...</div>

  return (

    <div className='bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 h-screen w-full'>
      <div className=" flex flex-col text-center items-center pt-5  mx-auto mb-4">
        <label htmlFor="orden" className="block mb-2 text-sm font-medium text-white">
          Ordenar por:
        </label>
        <div className='flex'>
        <select
          id="orden"
          className="block w-35 px-4 py-2 border border-gray-300 bg-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => handleOrdenChange(e)}
          value={criterioOrden}
        >
          <option value="maxLevel">MaxLevel</option>
          <option value="wins">Wins</option>
          <option value="id">ID</option>
        </select>

        <select
          onChange={toggleOrden}
          className="block w-35 px-4 py-2 border border-gray-300 bg-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
        </div>
      </div>
      <div className="relative overflow-x-auto items-center flex flex-col py-10 ">
        {message}
        <table className="w-200 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
           
            <tr>

              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                MaxLevel
              </th>
              <th scope="col" className="px-6 py-3 ">
                Wins
              </th>

            </tr>

          </thead>
          <tbody>
            {users.map(user =>
              <tr key={user.id} className="bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user.id}
                </th>
                <td className="px-6 py-4">
                  {user.name}
                </td>
                <td className="px-6 py-4">
                  {user.maxLevel}
                </td>
                <td className="px-6 py-4">
                  {user.wins}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserList