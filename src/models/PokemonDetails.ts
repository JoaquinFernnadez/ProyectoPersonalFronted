export default interface PokemonDetails {
    id?:number
    name: string
    height: number
    weight: number
    sprite: string
    types: string[]
    abilities: string[]
    stats: { stat: string ; base_stat: number} []
  }
  