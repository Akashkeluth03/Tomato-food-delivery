const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pool } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Get all locations
app.get("/api/locations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM locations ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Get restaurants by location and filter by online delivery
app.get("/api/restaurants", async (req, res) => {
  const { locationId, onlineOnly } = req.query;
  try {
    let query = "SELECT * FROM restaurants WHERE 1=1";
    const params = [];

    if (locationId) {
      params.push(locationId);
      query += ` AND location_id = $${params.length}`;
    }

    if (onlineOnly === "true") {
      query += " AND is_online_delivery = true";
    }

    query += " ORDER BY rating DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2.5. Create/generate a custom location with restaurants and menus
app.post("/api/locations/custom", async (req, res) => {
  const { cityName } = req.body;
  if (!cityName || String(cityName).trim() === "") {
    return res.status(400).json({ error: "City name is required" });
  }

  const rawName = String(cityName).trim();
  const capitalized = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if location exists
    const checkLoc = await client.query(
      "SELECT * FROM locations WHERE LOWER(name) = LOWER($1)",
      [capitalized]
    );

    if (checkLoc.rows.length > 0) {
      await client.query("COMMIT");
      return res.json(checkLoc.rows[0]);
    }

    // Create new location
    const newLoc = await client.query(
      "INSERT INTO locations (name) VALUES ($1) RETURNING *",
      [capitalized]
    );
    const locationId = newLoc.rows[0].id;

    // Generate 5 realistic restaurants
    const generatedRests = [
      { name: `${capitalized} Biryani House`, cuisine: "Biryani & North Indian", rating: 4.5, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: `${capitalized} Royal Palace`, cuisine: "South Indian & Chinese", rating: 4.2, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop" },
      { name: `${capitalized} Grand Veg`, cuisine: "Pure Veg & South Indian", rating: 4.6, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: `${capitalized} Coast Cafe`, cuisine: "Cafe & Fast Food", rating: 4.0, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop" },
      { name: `Ocean Delight ${capitalized}`, cuisine: "Seafood & Coastal", rating: 4.7, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" }
    ];

    // Fetch unique food items from database as a template library
    const uniqueItemsRes = await client.query(
      `SELECT DISTINCT ON (name) name, price, description, category, image_url FROM food_items`
    );
    const templateItems = uniqueItemsRes.rows;

    for (const rest of generatedRests) {
      const restRes = await client.query(
        `INSERT INTO restaurants (name, location_id, cuisine, rating, is_online_delivery, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [rest.name, locationId, rest.cuisine, rest.rating, rest.is_online_delivery, rest.image_url]
      );
      const restId = restRes.rows[0].id;

      // Filter and assign items to this restaurant
      const itemsToSeed = templateItems.filter(item => {
        if (item.category === "Biryani") {
          return rest.name.toLowerCase().includes("biryani");
        }
        if (item.category === "Deserts" || item.category === "Cake" || item.category === "Sandwich") {
          return rest.name.toLowerCase().includes("cafe");
        }
        if (item.category === "Pure Veg") {
          return rest.name.toLowerCase().includes("grand") || rest.name.toLowerCase().includes("veg") || rest.name.toLowerCase().includes("palace");
        }
        if (item.category === "Salad" || item.category === "Rolls") {
          return !rest.name.toLowerCase().includes("cafe");
        }
        // General fallback
        return !rest.name.toLowerCase().includes("biryani");
      });

      // Insert menu items
      const finalItems = itemsToSeed.length > 0 ? itemsToSeed : templateItems.filter(item => item.category === "Deserts" || item.category === "Cake");
      for (const item of finalItems) {
        await client.query(
          `INSERT INTO food_items (restaurant_id, name, price, description, category, image_url) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [restId, item.name, item.price, item.description, item.category, item.image_url]
        );
      }
    }

    await client.query("COMMIT");
    res.json(newLoc.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating custom location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

// 3. Get all food items or filter by restaurant / category / location
app.get("/api/food-items", async (req, res) => {
  const { restaurantId, category, locationId } = req.query;
  try {
    let query = "SELECT f.* FROM food_items f";
    const params = [];

    if (locationId) {
      query += " JOIN restaurants r ON f.restaurant_id = r.id";
    }

    query += " WHERE 1=1";

    if (locationId) {
      params.push(locationId);
      query += ` AND r.location_id = $${params.length}`;
    }

    if (restaurantId) {
      params.push(restaurantId);
      query += ` AND f.restaurant_id = $${params.length}`;
    }

    if (category && category !== "All") {
      params.push(category);
      query += ` AND f.category = $${params.length}`;
    }

    // Ensure we return food items with _id mapping for frontend compatibility
    const result = await pool.query(query, params);
    const mappedRows = result.rows.map(row => ({
      ...row,
      _id: String(row.id) // Map 'id' to '_id' for compatibility
    }));

    res.json(mappedRows);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
