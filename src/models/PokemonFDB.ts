
export default interface SalidaDatabase {
    id: number
    isTeam: boolean
    pokemon: PokemonDetails2
    pokemonName: string
    sprite: string
    unlocked: boolean
    userId: number
}
export interface PokemonDetails2 {

    id?: number
    name: string
    height: number
    weight: number
    sprite: string
    types: string[]
    abilities: string[]
    stats:  Stats
}
export interface Stats { 
    hp: number
    attack: number
    defense: number
    special_atk: number
    special_dfs: number
    speed: number
}

