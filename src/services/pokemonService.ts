import PokemonDetails from "../models/PokemonDetails"
import { PokemonDetails2 } from "../models/PokemonFDB"

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

export default class PokemonService {
    static async getUserLevel(id: number = 0) {
        const response = await fetch(API_URL_BASE + `/user/level?id=${id}`)
        const userLvl = await response.json()
        return userLvl
    }
    static getArrayFromStats(pokemon: PokemonDetails2) {
        const userStats = []

        userStats[0] = pokemon.stats.hp
        userStats[1] = pokemon.stats.attack
        userStats[2] = pokemon.stats.defense
        userStats[3] = pokemon.stats["special-attack"]
        userStats[4] = pokemon.stats["special-defense"]
        userStats[5] = pokemon.stats.speed

        return userStats
    }
    static getTBS(pokemon: PokemonDetails) {
        let TBS = 0
        for (let i = 0; i < 6; i++) {
            TBS += pokemon.stats[i].base_stat
        }
        return TBS
    }
    static getTBS2(pokemon: PokemonDetails2) {
        const TBS = pokemon.stats.attack + pokemon.stats.defense + pokemon.stats.hp + pokemon.stats["special-attack"] + pokemon.stats["special-defense"] + pokemon.stats.speed
        return TBS
    }
    static async fetchPokemonDetails(id?: number) {
        try {

            const response = await fetch(`${API_URL_BASE}/pokemon/getDetail?id=${id}`)
            if (!response.ok) throw new Error("Error al obtener detalles del Pokémon")
            const data = await response.json()
            return data
        } catch (error) {
            console.error(error)
        }
    }
    static async getId(url: string) {
        const response = await fetch(url)
        const data = await response.json() as Partial<PokemonDetails>
    
        return data.id
    }
    static async handleAceptarIntercambio(id: number, userId?: number) {
        
        try {
            const res = await fetch(API_URL_BASE + `/pokemon/gts/aceptar?id=${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({ usuarioAceptaId: userId }),
            })

            if (!res.ok) throw new Error("No se pudo aceptar el intercambio")
            return "Intercambio realizado con exito"
        } catch (err) {
            return err
        }
    }
    static async handleEliminarIntercambio(id: number) {
        try {
            const res = await fetch(API_URL_BASE + `/pokemon/gts/cancelar?id=${id}`, {
                method: "GET",
            })

            if (!res.ok) throw new Error("No se pudo aceptar el intercambio")
            return 
        } catch (err) {
            alert(err)
        }
    } 
}
