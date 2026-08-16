import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Footer from "./components/layout/Footer";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";  // ✅ Import karo

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />  {/* ✅ New Route */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;