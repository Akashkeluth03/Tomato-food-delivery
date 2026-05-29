import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header/Header";
import ExploreMenu from "../ExploreMenu/ExploreMenu";
import FoodItem from "../Components/FoodItem/FoodItem";
import { useFood } from "../context/FoodContext";
import "./HomePage.css";

function HomePage() {
  const [category, setCategory] = useState("All");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Use a small timeout to let rendering finish
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);
  const { 
    selectedLocation, 
    restaurants, 
    selectedRestaurant, 
    setSelectedRestaurant, 
    foodList, 
    loading 
  } = useFood();

  const filteredFood = foodList.filter((item) => {
    const categoryMatch = category === "All" || item.category === category;
    
    // Determine restaurant matching
    let restaurantMatch = false;
    if (selectedRestaurant) {
      restaurantMatch = String(item.restaurant_id) === String(selectedRestaurant.id);
    } else {
      // If no specific restaurant is selected, show items from any active restaurant in the selected location
      restaurantMatch = restaurants.some((r) => String(r.id) === String(item.restaurant_id));
    }
    
    return categoryMatch && restaurantMatch;
  });

  return (
    <div className="app">
      <Header />
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading restaurants and dishes...</p>
        </div>
      ) : (
        <>
          {selectedLocation && (
            <section className="restaurants-section">
              <h2 className="section-title">
                Top restaurants with online delivery in {selectedLocation.name}
              </h2>
              {restaurants.length === 0 ? (
                <p className="no-restaurants">
                  No online delivery restaurants active in this location right now.
                </p>
              ) : (
                <div className="restaurants-grid">
                  {restaurants.map((restaurant) => {
                    const isSelected = selectedRestaurant?.id === restaurant.id;
                    return (
                      <div
                        key={restaurant.id}
                        className={`restaurant-card ${isSelected ? "active" : ""}`}
                        onClick={() => setSelectedRestaurant(isSelected ? null : restaurant)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedRestaurant(isSelected ? null : restaurant);
                          }
                        }}
                      >
                        <div className="restaurant-card-img-container">
                          <img src={restaurant.image_url} alt={restaurant.name} />
                          {isSelected && (
                            <span className="selected-badge">Viewing Menu</span>
                          )}
                        </div>
                        <div className="restaurant-card-info">
                          <div className="restaurant-card-header">
                            <h3>{restaurant.name}</h3>
                            <span className="restaurant-rating">
                              ★ {parseFloat(restaurant.rating).toFixed(1)}
                            </span>
                          </div>
                          <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                          <div className="restaurant-card-footer">
                            <span className="delivery-status">🟢 Online Delivery</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {selectedRestaurant && (
                <div className="filter-info-bar">
                  <span>
                    Showing menu for: <strong>{selectedRestaurant.name}</strong>
                  </span>
                  <button
                    className="clear-filter-btn"
                    onClick={() => setSelectedRestaurant(null)}
                  >
                    Show All Menus
                  </button>
                </div>
              )}
            </section>
          )}

          <ExploreMenu category={category} setCategory={setCategory} />
          
          <main className="food-item-section">
            {filteredFood.length > 0 ? (
              filteredFood.map((item) => (
                <FoodItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={Number(item.price)}
                  description={item.description}
                  image={item.image}
                />
              ))
            ) : (
              <p className="food-item-empty">No items to show in this category.</p>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default HomePage;
