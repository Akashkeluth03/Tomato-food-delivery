import { createContext, useContext, useState, useEffect } from "react";
import { food_images, food_list } from "../assets/assets";

const FoodContext = createContext(null);

const MOCK_LOCATIONS = [
  { id: 1, name: "Bellary" },
  { id: 2, name: "Bangalore" },
  { id: 3, name: "Hubli" },
  { id: 4, name: "Mysore" },
  { id: 5, name: "Mangalore" },
  { id: 6, name: "Hyderabad" },
  { id: 7, name: "Mumbai" },
  { id: 8, name: "Delhi" },
  { id: 9, name: "Chennai" },
  { id: 10, name: "Pune" }
];

const getMockRestaurants = (locId, cityName) => [
  {
    id: locId * 10 + 1,
    name: `${cityName} Biryani Kitchen`,
    rating: "4.4",
    cuisine: "Biryani, North Indian",
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop"
  },
  {
    id: locId * 10 + 2,
    name: `${cityName} Salad & Co.`,
    rating: "4.6",
    cuisine: "Healthy Food, Salad, Sandwich",
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop"
  },
  {
    id: locId * 10 + 3,
    name: `${cityName} Bakers & Desserts`,
    rating: "4.2",
    cuisine: "Desserts, Cake, Bakery",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop"
  },
  {
    id: locId * 10 + 4,
    name: `${cityName} Pure Veg Bistro`,
    rating: "4.3",
    cuisine: "Pure Veg, South Indian",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
  },
  {
    id: locId * 10 + 5,
    name: `${cityName} Continental Hub`,
    rating: "4.1",
    cuisine: "Pasta, Noodles, Rolls",
    image_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop"
  }
];

const mapMockFoodItems = (locId) => {
  return food_list.map((item) => {
    let restId = locId * 10 + 5; // Default to Continental Hub
    if (item.category === "Biryani") {
      restId = locId * 10 + 1;
    } else if (item.category === "Salad" || item.category === "Sandwich") {
      restId = locId * 10 + 2;
    } else if (item.category === "Cake" || item.category === "Deserts") {
      restId = locId * 10 + 3;
    } else if (item.category === "Pure Veg") {
      restId = locId * 10 + 4;
    }
    return {
      _id: item._id,
      name: item.name,
      price: Number(item.price),
      description: item.description,
      category: item.category,
      restaurant_id: restId,
      image: item.image
    };
  });
};

export const FoodProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  // 1. Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/locations");
        if (res.ok) {
          const data = await res.json();
          setLocations(data);
          setIsMockMode(false);
          const bellary = data.find((l) => l.name.toLowerCase() === "bellary");
          if (bellary) {
            setSelectedLocation(bellary);
          } else if (data.length > 0) {
            setSelectedLocation(data[0]);
          }
        } else {
          throw new Error("Backend locations not OK");
        }
      } catch (err) {
        console.warn("Backend not available, switching to local mock mode:", err.message);
        setIsMockMode(true);
        setLocations(MOCK_LOCATIONS);
        const bellary = MOCK_LOCATIONS.find((l) => l.name.toLowerCase() === "bellary");
        setSelectedLocation(bellary || MOCK_LOCATIONS[0]);
      }
    };
    fetchLocations();
  }, []);

  // 2. Fetch restaurants whenever selectedLocation changes
  useEffect(() => {
    if (!selectedLocation) return;

    if (isMockMode) {
      const mockRes = getMockRestaurants(selectedLocation.id, selectedLocation.name);
      setRestaurants(mockRes);
      setSelectedRestaurant(null);
      return;
    }

    const fetchRestaurants = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/restaurants?locationId=${selectedLocation.id}&onlineOnly=true`
        );
        if (res.ok) {
          const data = await res.json();
          setRestaurants(data);
          setSelectedRestaurant(null);
        } else {
          throw new Error("Backend restaurants not OK");
        }
      } catch (err) {
        console.error("Error fetching restaurants, falling back to mock:", err);
        const mockRes = getMockRestaurants(selectedLocation.id, selectedLocation.name);
        setRestaurants(mockRes);
        setSelectedRestaurant(null);
      }
    };
    fetchRestaurants();
  }, [selectedLocation, isMockMode]);

  // 3. Fetch all food items on mount
  useEffect(() => {
    if (isMockMode) {
      if (selectedLocation) {
        setFoodList(mapMockFoodItems(selectedLocation.id));
      }
      setLoading(false);
      return;
    }

    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5001/api/food-items");
        if (res.ok) {
          const data = await res.json();
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
        } else {
          throw new Error("Backend food items not OK");
        }
      } catch (err) {
        console.error("Error fetching food items, falling back to mock:", err);
        if (selectedLocation) {
          setFoodList(mapMockFoodItems(selectedLocation.id));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, [isMockMode, selectedLocation]);

  const addCustomCity = async (cityName) => {
    if (isMockMode) {
      const newId = locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 11;
      const newCity = { id: newId, name: cityName };
      setLocations((prev) => {
        if (prev.some((l) => l.name.toLowerCase() === cityName.toLowerCase())) return prev;
        return [...prev, newCity].sort((a, b) => a.name.localeCompare(b.name));
      });
      setSelectedLocation(newCity);
      return newCity;
    }

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
