export default interface User{
    id: number
    name: string
    email: string
    maxLevel: number
    password: string
    pokePuntos: number
    role: string
    accepNotifications?: boolean
}