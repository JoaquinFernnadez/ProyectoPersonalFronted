import { PokemonDetails2 } from "../models/PokemonFDB"

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

export class PokemonService {
    static async getUserLevel(id: number = 0) {
        const response = await fetch(API_URL_BASE + `/user/level?id=${id}`)
        const userLvl = await response.json()
        return userLvl
    }
    static async getArrayFromStats(pokemon: PokemonDetails2) {
        const userStats = []

        userStats[0] = pokemon.stats.hp
        userStats[1] = pokemon.stats.attack
        userStats[2] = pokemon.stats.defense
        userStats[3] = pokemon.stats["special-attack"]
        userStats[4] = pokemon.stats["special-defense"]
        userStats[5] = pokemon.stats.speed

        return userStats
    }
}