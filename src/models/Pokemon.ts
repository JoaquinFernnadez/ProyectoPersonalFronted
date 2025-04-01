export default interface Pokemon{
    pokemonName?: string
    sprites: {
        front_default: string
    }
    id: number
    name: string
    sprite: string
    unlocked?: boolean
    url : string 
} 
