import "./App.css"
import { BrowserRouter , Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
// import Footer from "./components/Footer"

import { AuthProvider } from "./contexts/AuthContext"
import Pokedex from "./pages/Pokedex"
import Packs from "./pages/Packs"
import UserTeam from "./pages/MyTeam"
import Team from "./pages/TeamSelector"
import ComplaintsList from "./pages/Complaints"
import ComplaintsForm from "./pages/ComplaintForm"
import UserList from "./pages/ListUsers"
import Game from "./pages/Game"
import News from "./pages/News"
import TeamGuardRoute from "./components/TeamGuardRoute"
import GTSPage from "./pages/GTSPage"


function App() {

  return (
    <>
      <BrowserRouter>
      <AuthProvider>

        <div className="flex flex-col">
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} /> 
          <div className="flex-grow flex justify-center items-center bg-gray-900">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/news" element={<News />} />
              <Route path="/team" element={<Team />} />
              <Route path="/gts" element={<GTSPage />} />
              <Route path="/packs" element={<Packs />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/myteam" element={<UserTeam />} />
              <Route path="/pokedex" element={<Pokedex />} />
              <Route path="/game" element={ <TeamGuardRoute><Game /></TeamGuardRoute>} />

              <Route path="/complaints" element={<ComplaintsList />} />
              <Route path="/newComplaint" element={<ComplaintsForm />} />
            </Routes>
          </div>
          <div className=" fixed bottom-0  w-full">
          {/* <Footer /> */}
          </div>
        </div>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
