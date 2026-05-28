import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useCart } from "../../context/CartContext";
import { formatInr } from "../../utils/formatCurrency";

const FoodItem = ({ id, name, price, description, image }) => {
  const { quantities, addOne, removeOne } = useCart();
  const itemCount = quantities[id] || 0;

  return (
    <div className="food-item" data-food-id={id}>
      <div className="food-item-img-container">
        <img className="food-item-img" src={image} alt={name} />
        {itemCount === 0 ? (
          <button
            type="button"
            className="food-item-add-btn"
            onClick={() => addOne(id)}
            aria-label="Add to cart"
          >
            <img src={assets.add_icon_white} className="add" alt="" />
          </button>
        ) : (
          <div className="food-item-counter">
            <button
              type="button"
              className="food-item-counter-btn"
              onClick={() => removeOne(id)}
              aria-label="Remove one"
            >
              <img src={assets.remove_icon_red} alt="" />
            </button>
            <p>{itemCount}</p>
            <button
              type="button"
              className="food-item-counter-btn"
              onClick={() => addOne(id)}
              aria-label="Add one"
            >
              <img src={assets.add_icon_green} alt="" />
            </button>
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{formatInr(price)}</p>
      </div>
    </div>
  );
};

export default FoodItem;
