export default interface User{
    id?: number
    name?: string
    email: string
    maxLevel: number
    password: string
    role: string
    accepNotifications?: boolean
}