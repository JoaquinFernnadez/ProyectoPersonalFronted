import { fetchAPI } from "../utils/FetchAPI";

//const URL_BASE = 'http://localhost:3000/api/'
const API_URL_BASE = import.meta.env.VITE_API_URL_BASE;

export class UserService {
  static async getAll() {
    return await fetchAPI(API_URL_BASE + "/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  }
  static async actualizarPokePuntos(idUser: number, body: number[]){
    console.log(body)
    await fetchAPI(API_URL_BASE + `/user/actualizarPuntos?id=${idUser}`,{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({array: body})
    })
    return console.log("PokePuntos Actualizados")
  }
  static async getPokePuntos(idUser: number){
    
    return await fetchAPI(API_URL_BASE + `/user/getPuntos?id=${idUser}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
  }
   
}
