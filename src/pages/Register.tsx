import React, { ChangeEvent, FormEvent, useState } from "react"
import { AuthService } from "../services/authService"
import User from "../models/User"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import ErrorMsgData from "../utils/ErrorMsgData"
import InputForm from "../components/InputForm"

const Register: React.FC = () => {
  const [form, setForm] = useState<Partial<User>>({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleSubmit = async (e: FormEvent) => {
    try {
      setLoading(true)
      setErrors({})

      e.preventDefault()

      await AuthService.registerUser(form)

      toast.success("Usuario registrado con éxito!")
      navigate("/")
    } catch (error) {
      toast.error("Error al registrar el usuario.")

      if (Array.isArray(error)) {
        const errorObj: Record<string, string> = error?.reduce((acc: Record<string, string>, err: unknown) => {
          const errorDetail = err as ErrorMsgData
          acc[errorDetail.path] = errorDetail.msg
          return acc
        }, {})
        setErrors(errorObj)
      } else if (error instanceof Error) {
        const msg = error instanceof Error ? error.message : "Error desconocido"
        setErrors({ message: msg || 'Error desconocido' })
      } else {
        setErrors({ message: error as string || 'Error desconocido' })
      }

    } finally {
      setLoading(false)
    }
  }


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = e.target
    
    setForm({ ...form, [name]: value })
  }


  if (loading) return <p>Loading...</p>

  return (
    <div className="bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 w-full h-screen">
    <form className="max-w-sm mx-auto min-w-sm pt-30" onSubmit={handleSubmit}>
      <InputForm text="Nombre de Usuario" name="name" value={form.name || ''} handleChange={handleChange} error={errors.name} />
      {/* <InputForm text="Apellidos" name="surname" value={form.surname || ''} handleChange={handleChange} error={errors.surname} /> */}
      <InputForm text="Email" name="email" value={form.email || ''} handleChange={handleChange} error={errors.email} />
      <InputForm text="Password" name="password" value={form.password || ''} handleChange={handleChange} error={errors.password} />

      <div className="flex items-start mb-5">
        
        

      </div>
      {errors && errors.message && <p className="text-center mt-4 text-red-500">{errors.message}</p>}
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
    </div>
  )
}

export default Register