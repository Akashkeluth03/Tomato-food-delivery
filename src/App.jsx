import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import ContactUs from "./Components/ContactUs/ContactUs";
import AppDownload from "./Components/AppDownloader/AppDownload";
import { CartProvider } from "./context/CartContext";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <CartProvider>
      <Navbar
        setShowLogin={setShowLogin}
        setShowContact={setShowContact}
        user={user}
        onLogout={() => setUser(null)}
      />
      {showLogin && (
        <Login setShowLogin={setShowLogin} setUser={setUser} />
      )}
      {showContact && <ContactUs setShowContact={setShowContact} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>

      <AppDownload />

      <Footer />
    </CartProvider>
  );
}

export default App;
