import { createContext, useContext, useEffect, useState } from "react"
import { AuthService } from "../services/authService"

const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

interface UserPayload{
    id: number
    email: string
    nameUSer: string
}

interface AuthContextType{
    user: UserPayload | null  // Partial<User>
    isAuthenticated: boolean
    login: (email:string, password:string) =>  Promise<void>
    logout: () =>  Promise<void>
}
const AuthContext = createContext<AuthContextType | null>({ // Es mejor proporcionar un objeto vacío con funciones noop para evitar verificaciones innecesarias en useAuth()
    user: null,
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {}
})

export function AuthProvider({children}:{children: React.ReactNode}){
    const [user, setUser] = useState<UserPayload | null>(null)


    
    useEffect(()=>{
        async function callBack(){
            
            try{
                const response = await fetch(API_URL_BASE+'/auth/login',
                 {credentials: 'include', method: 'POST'})
                if (!response.ok) throw new Error("No autenticado")
                const data = await response.json()
                setUser(data)
            }catch(error){
                console.error('Error al cargar el usuario', error)
                setUser(null)
            }
        }
        callBack()
    },[])

    const login = async (email: string, password:string) => {
        try{
            const a = await AuthService.loginUser(email, password)
            const response = await fetch(API_URL_BASE+'/auth/user', {credentials: 'include'})
            console.log(response)
            if (!response.ok) throw new Error("No autenticado")
            const data = await response.json()
            console.log('Usuario logueado:', data)
            console.log('Usuario logueado token:', a)
            setUser(data)
        }catch(error){
            console.error("Error en el login:", error)
            throw new Error("Error en el login")
        }
    }
    const logout = async () => {
        await fetch(API_URL_BASE+'/auth/logout', {method:'POST', credentials: 'include'})
        setUser(null)
    }

    return <AuthContext.Provider value={  
            {user, login, logout, isAuthenticated: !!user }
        }>
            {children}
        </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) {
        console.warn("useAuth se está usando fuera del AuthProvider")
        return { user: null, isAuthenticated: false, logout: () => {}, login: () => {} }
    }
    return context
}