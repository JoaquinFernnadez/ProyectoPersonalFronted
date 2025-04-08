import { useEffect, useState } from 'react'
import { fetchAPI } from '../utils/FetchAPI'
import User from '../models/User'

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function UserList() {

  const [users, setUsers] = useState<User[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function fetchUsers(){
      try{
        const userList =  await fetchAPI(API_URL_BASE + `/user/bestScores`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        
        setUsers(userList)      
      }catch(error){
        const msg = error instanceof Error ? error.message : 'Error desconocido'
        setMessage(msg)
      }finally{
        setLoading(false)
      }
    }
    fetchUsers()
  },[])

  if(loading)    return <div>Loading...</div>
  

  return (


    <div className="relative overflow-x-auto">
      {message}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
          </tr>
        </thead>
        <tbody>
        { users.map( user => 
          <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {user.id}
            </th>
            <td className="px-6 py-4">
              {user.name}
            </td>
            <td className="px-6 py-4">
              {user.maxLevel}
            </td>
           
          </tr>
        )}

        </tbody>
      </table>
    </div>

  )
}

export default UserList