import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import Sell from "./pages/Sell";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Product from "./pages/Product";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/product/:prod" element={<Product />} />
      </Routes>
    </>
  );
}

export default App;
