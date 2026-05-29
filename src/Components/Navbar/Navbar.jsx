import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useCart } from "../../context/CartContext";
import { useFood } from "../../context/FoodContext";

const Navbar = ({ setShowLogin, setShowContact, user, onLogout }) => {
  const [menu, setMenu] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, menuName, targetId) => {
    setMenu(menuName);
    
    if (menuName === "contact-us") {
      setShowContact?.(true);
    }

    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        if (e && e.preventDefault) {
          e.preventDefault();
        }
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/", { state: { scrollTo: targetId } });
      }
    } else if (menuName === "home") {
      if (location.pathname === "/") {
        if (e && e.preventDefault) {
          e.preventDefault();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    }
  };
  const { totalItems } = useCart();
  const { locations, selectedLocation, setSelectedLocation, addCustomCity } = useFood();
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [customCityName, setCustomCityName] = useState("");
  const [cityError, setCityError] = useState("");

  const handleAddCitySubmit = async (e) => {
    e.preventDefault();
    if (!customCityName.trim()) return;
    try {
      setCityError("");
      await addCustomCity(customCityName.trim());
      setCustomCityName("");
      setIsAddingCity(false);
    } catch (err) {
      setCityError("Error adding city");
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left-group" style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          className="navbar-logo-btn"
          onClick={(e) => handleNavClick(e, "home", null)}
          aria-label="Home"
        >
          <img className="logo" src={assets.logo} alt="" />
        </Link>
        {locations.length > 0 && (
          <div className="navbar-location-wrapper" style={{ display: "flex", alignItems: "center", position: "relative" }}>
            {!isAddingCity ? (
              <div className="navbar-location-container">
                <span className="navbar-location-icon">📍</span>
                <select
                  className="navbar-location-select"
                  value={selectedLocation?.id || ""}
                  onChange={(e) => {
                    const loc = locations.find((l) => l.id === parseInt(e.target.value));
                    if (loc) setSelectedLocation(loc);
                  }}
                  aria-label="Select Location"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="navbar-add-city-btn"
                  onClick={() => setIsAddingCity(true)}
                  title="Add custom city"
                >
                  + Add City
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddCitySubmit} className="navbar-add-city-form">
                <span className="navbar-location-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Enter city (e.g. Goa)"
                  value={customCityName}
                  onChange={(e) => setCustomCityName(e.target.value)}
                  className="navbar-add-city-input"
                  autoFocus
                  required
                />
                <button type="submit" className="navbar-add-city-submit">Add</button>
                <button
                  type="button"
                  className="navbar-add-city-cancel"
                  onClick={() => {
                    setIsAddingCity(false);
                    setCityError("");
                  }}
                >
                  ✕
                </button>
                {cityError && <span className="city-error-tooltip">{cityError}</span>}
              </form>
            )}
          </div>
        )}
      </div>
      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            className={`navbar-menu-link ${location.pathname === "/" && menu === "home" ? "active" : ""}`}
            onClick={(e) => handleNavClick(e, "home", null)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className={`navbar-menu-link ${location.pathname === "/" && menu === "menu" ? "active" : ""}`}
            onClick={(e) => handleNavClick(e, "menu", "explore-menu")}
          >
            Menu
          </Link>
        </li>
        <li>
          <button
            type="button"
            className={`navbar-menu-link ${menu === "mobile-app" ? "active" : ""}`}
            onClick={(e) => handleNavClick(e, "mobile-app", "app-download")}
          >
            Mobile-App
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`navbar-menu-link ${menu === "contact-us" ? "active" : ""}`}
            onClick={(e) => handleNavClick(e, "contact-us", "footer")}
          >
            contact us
          </button>
        </li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link
            to="/cart"
            className="navbar-cart-btn"
            aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
          >
            <img src={assets.basket_icon} alt="" />
            {totalItems > 0 && (
              <span className="navbar-cart-badge">{totalItems}</span>
            )}
          </Link>
        </div>
        {user ? (
          <div className="navbar-user">
            <span className="navbar-user-name" title={user.email}>
              Hi, {user.name}
            </span>
            <button
              type="button"
              className="navbar-signout"
              onClick={() => onLogout?.()}
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="navbar-signin"
            onClick={() => setShowLogin?.(true)}
          >
            sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
