import SalidaDatabase from "./PokemonFDB"
import User from "./User"


export default interface Intercambio {
    id :  number 
    usuarioId : number 
    userPokemonId : number 
    pokemonDeseadoId : number
    estado:  EstadoIntercambio
    fechaCreacion : Date

    usuario : User 
    pokemonOfrecido : SalidaDatabase
    pokemonDeseado : SalidaDatabase
}

enum EstadoIntercambio {
    abierto,
    intercambiado
  }