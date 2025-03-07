import "./App.css";
import { BrowserRouter , Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

import { AuthProvider } from "./contexts/AuthContext";
import Pokedex from "./pages/Pokedex";
import Packs from "./pages/Packs";
import UserTeam from "./pages/MyTeam";
import Team from "./pages/TeamSelector";

function App() {

  return (
    <>
      <BrowserRouter>
      <AuthProvider>

        <div className="flex flex-col">
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} /> 
          <div className="flex-grow flex justify-center items-center   ">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pokedex" element={<Pokedex />} />
              <Route path="/packs" element={<Packs />} />
              <Route path="/myteam" element={<UserTeam />} />
              <Route path="/team" element={<Team />} />
            </Routes>
          </div>
          <div className=" fixed bottom-0  w-full">
          <Footer />
          </div>
        </div>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
