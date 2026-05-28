import "./Header.css";
import { assets } from "../../assets/assets";

const scrollToMenu = () => {
  document
    .getElementById("explore-menu")
    ?.scrollIntoView({ behavior: "smooth" });
};

const Header = () => {
  return (
    <div
      className="header"
      style={{ backgroundImage: `url(${assets.header_img})` }}
    >
      <div className="header-contents">
        <h2>Order Your favorite food Here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <button type="button" onClick={scrollToMenu}>
          View Menu
        </button>
      </div>
    </div>
  );
};
export default Header;
