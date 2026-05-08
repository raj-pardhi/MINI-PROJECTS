import Todos from "./pages/Todos";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./pages/Navbar";


const App = () => {


  return (
    <div className="w-full min-h-screen bg-gray-800 p-10">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Todos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>


  
    </div>
  )
}

export default App