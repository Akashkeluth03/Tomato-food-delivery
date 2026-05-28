import { createContext, useContext, useState, useEffect } from "react";
import { food_images } from "../assets/assets";

const FoodContext = createContext(null);

export const FoodProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/locations");
        if (res.ok) {
          const data = await res.json();
          setLocations(data);
          // Default to Bellary
          const bellary = data.find((l) => l.name.toLowerCase() === "bellary");
          if (bellary) {
            setSelectedLocation(bellary);
          } else if (data.length > 0) {
            setSelectedLocation(data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

  // 2. Fetch restaurants whenever selectedLocation changes
  useEffect(() => {
    if (!selectedLocation) return;
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/restaurants?locationId=${selectedLocation.id}&onlineOnly=true`
        );
        if (res.ok) {
          const data = await res.json();
          setRestaurants(data);
          setSelectedRestaurant(null); // Reset selected restaurant when location changes
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurants();
  }, [selectedLocation]);

  // 3. Fetch all food items on mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5001/api/food-items");
        if (res.ok) {
          const data = await res.json();
          // Map backend image keys/URLs to React assets
          const resolved = data.map((item) => {
            const img = item.image_url;
            const imageUrl =
              typeof img === "string" && img.startsWith("http")
                ? img
                : food_images[img] || img;
            return {
              ...item,
              image: imageUrl,
            };
          });
          setFoodList(resolved);
        }
      } catch (err) {
        console.error("Error fetching food items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, []);

  const addCustomCity = async (cityName) => {
    try {
      const res = await fetch("http://localhost:5001/api/locations/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName }),
      });
      if (res.ok) {
        const newCity = await res.json();
        setLocations((prev) => {
          if (prev.some((l) => l.id === newCity.id)) return prev;
          return [...prev, newCity].sort((a, b) => a.name.localeCompare(b.name));
        });
        setSelectedLocation(newCity);
        
        // Refresh food list to include menu items for the newly generated restaurants
        const foodRes = await fetch("http://localhost:5001/api/food-items");
        if (foodRes.ok) {
          const foodData = await foodRes.json();
          const resolved = foodData.map((item) => {
            const img = item.image_url;
            const imageUrl =
              typeof img === "string" && img.startsWith("http")
                ? img
                : food_images[img] || img;
            return {
              ...item,
              image: imageUrl,
            };
          });
          setFoodList(resolved);
        }
        return newCity;
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add custom city");
      }
    } catch (err) {
      console.error("Error adding custom city:", err);
      throw err;
    }
  };

  const value = {
    locations,
    selectedLocation,
    setSelectedLocation,
    restaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    foodList,
    loading,
    addCustomCity,
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return context;
};
