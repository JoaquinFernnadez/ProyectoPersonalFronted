import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

import { AuthProvider } from "./contexts/AuthContext";

function App() {

  return (
    <>
      <BrowserRouter>
      <AuthProvider>

        <div className="flex flex-col">
          <Navbar />
          <Toaster position="top-center" reverseOrder={false} />
          <div className="flex grow justify-center items-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <Footer />
        </div>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
