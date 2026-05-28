const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

async function seed() {
  console.log("Starting database seeding (Expanded Multi-City)...");

  try {
    // 1. Read and run schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await pool.query(schemaSql);
    console.log("Database schema verified.");

    // 2. Clear existing data
    await pool.query("TRUNCATE TABLE food_items, restaurants, locations RESTART IDENTITY CASCADE");
    console.log("Cleaned existing tables.");

    // 3. Seed locations
    const locationsResult = await pool.query(`
      INSERT INTO locations (name) VALUES 
      ('Bellary'),
      ('Bangalore'),
      ('Hubli'),
      ('Mysore'),
      ('Mangalore'),
      ('Hyderabad'),
      ('Mumbai'),
      ('Delhi'),
      ('Chennai'),
      ('Pune')
      RETURNING id, name
    `);
    const locations = locationsResult.rows;
    console.log("Locations seeded successfully.");

    const getLocId = (name) => locations.find(l => l.name === name).id;

    // 4. Seed restaurants
    const restaurantsData = [
      // Bellary
      { name: "Bellary Biryani Paradise", location_id: getLocId('Bellary'), cuisine: "Biryani & North Indian", rating: 4.5, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "Royal Palace Restaurant", location_id: getLocId('Bellary'), cuisine: "South Indian & Chinese", rating: 4.2, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop" },
      { name: "Sri Krishna Grand", location_id: getLocId('Bellary'), cuisine: "Pure Veg & South Indian", rating: 4.6, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Bellary Spice Cafe", location_id: getLocId('Bellary'), cuisine: "Cafe & Fast Food", rating: 4.0, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop" },
      { name: "The Pizza Corner Bellary", location_id: getLocId('Bellary'), cuisine: "Italian & Pizza", rating: 4.3, is_online_delivery: false, image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop" },
      
      // Bangalore
      { name: "Bangalore Biryani Club", location_id: getLocId('Bangalore'), cuisine: "Biryani & Mughlai", rating: 4.7, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "The Corner House", location_id: getLocId('Bangalore'), cuisine: "Desserts & Ice Cream", rating: 4.8, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop" },
      { name: "Indiranagar Diner", location_id: getLocId('Bangalore'), cuisine: "Continental & Burgers", rating: 4.4, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop" },
      { name: "Suhani Pure Veg", location_id: getLocId('Bangalore'), cuisine: "Pure Veg & South Indian", rating: 4.1, is_online_delivery: false, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      
      // Hubli
      { name: "Hubli Dharwad Darshini", location_id: getLocId('Hubli'), cuisine: "South Indian Veg & Meals", rating: 4.6, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Golden Gate Restaurant Hubli", location_id: getLocId('Hubli'), cuisine: "North Indian & Chinese", rating: 4.3, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop" },
      
      // Mysore
      { name: "Mysore Mylari Dosa", location_id: getLocId('Mysore'), cuisine: "South Indian Dosa", rating: 4.8, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Hotel RRR Mysore", location_id: getLocId('Mysore'), cuisine: "Andhra Biryani", rating: 4.6, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "Gufha Restaurant", location_id: getLocId('Mysore'), cuisine: "Multi-cuisine", rating: 4.2, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop" },
      { name: "The Old House Mysore", location_id: getLocId('Mysore'), cuisine: "Italian Veg", rating: 4.5, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop" },
      
      // Mangalore
      { name: "Giri Manja's", location_id: getLocId('Mangalore'), cuisine: "Coastal Seafood", rating: 4.9, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Machali", location_id: getLocId('Mangalore'), cuisine: "Seafood & South Indian", rating: 4.7, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Ideal Ice Cream Parlour", location_id: getLocId('Mangalore'), cuisine: "Desserts & Sundaes", rating: 4.8, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop" },
      
      // Hyderabad
      { name: "Paradise Biryani", location_id: getLocId('Hyderabad'), cuisine: "Hyderabadi Biryani", rating: 4.5, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "Bawarchi", location_id: getLocId('Hyderabad'), cuisine: "Mughlai Biryani", rating: 4.7, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "Shah Ghouse Cafe", location_id: getLocId('Hyderabad'), cuisine: "Biryani & Haleem", rating: 4.6, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "Chutneys", location_id: getLocId('Hyderabad'), cuisine: "South Indian Veg", rating: 4.4, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      
      // Mumbai
      { name: "BadeMiya", location_id: getLocId('Mumbai'), cuisine: "North Indian Kababs", rating: 4.3, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop" },
      { name: "Leopold Cafe", location_id: getLocId('Mumbai'), cuisine: "Multi-cuisine Cafe", rating: 4.2, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop" },
      { name: "Mahesh Lunch Home", location_id: getLocId('Mumbai'), cuisine: "Coastal Seafood", rating: 4.6, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Shiv Sagar Mumbai", location_id: getLocId('Mumbai'), cuisine: "Veg Fast Food", rating: 4.1, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      
      // Delhi
      { name: "Karim's", location_id: getLocId('Delhi'), cuisine: "Mughlai", rating: 4.6, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "Bukhara", location_id: getLocId('Delhi'), cuisine: "North Indian Tandoori", rating: 4.9, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "Saravana Bhavan Delhi", location_id: getLocId('Delhi'), cuisine: "South Indian Veg", rating: 4.4, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Wenger's", location_id: getLocId('Delhi'), cuisine: "Bakery & Cafe", rating: 4.5, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1586985289688-ca924911586c?w=500&auto=format&fit=crop" },
      
      // Chennai
      { name: "Murugan Idli Shop", location_id: getLocId('Chennai'), cuisine: "South Indian Breakfast", rating: 4.7, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Saravana Bhavan Chennai", location_id: getLocId('Chennai'), cuisine: "South Indian Veg", rating: 4.5, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Thalappakatti Biryani", location_id: getLocId('Chennai'), cuisine: "Chettinad Biryani", rating: 4.4, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      
      // Pune
      { name: "Vaishali Restaurant", location_id: getLocId('Pune'), cuisine: "South Indian Cafe", rating: 4.6, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop" },
      { name: "Shabree", location_id: getLocId('Pune'), cuisine: "Maharashtrian Thali", rating: 4.5, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop" },
      { name: "Blue Nile", location_id: getLocId('Pune'), cuisine: "Mughlai Biryani", rating: 4.3, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop" },
      { name: "German Bakery Pune", location_id: getLocId('Pune'), cuisine: "Cafe & Bakery", rating: 4.4, is_online_delivery: true, image_url: "https://images.unsplash.com/photo-1586985289688-ca924911586c?w=500&auto=format&fit=crop" }
    ];

    const restaurantIds = {};
    for (const rest of restaurantsData) {
      const res = await pool.query(
        `INSERT INTO restaurants (name, location_id, cuisine, rating, is_online_delivery, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [rest.name, rest.location_id, rest.cuisine, rest.rating, rest.is_online_delivery, rest.image_url]
      );
      restaurantIds[rest.name] = res.rows[0].id;
    }
    console.log("Restaurants seeded successfully.");

    // 5. Seed Food Items
    const foodListRaw = [
      { name: "Greek salad", image: "food_1", price: 22, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
      { name: "Veg salad", image: "food_2", price: 70, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
      { name: "Clover Salad", image: "food_3", price: 90, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
      { name: "Chicken Salad", image: "food_4", price: 90, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
      { name: "Lasagna Rolls", image: "food_5", price: 80, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
      { name: "Peri Peri Rolls", image: "food_6", price: 89, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
      { name: "Chicken Rolls", image: "food_7", price: 90, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
      { name: "Veg Rolls", image: "food_8", price: 45, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
      { name: "Ripple Ice Cream", image: "food_9", price: 62, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
      { name: "Fruit Ice Cream", image: "food_10", price: 76, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
      { name: "Jar Ice Cream", image: "food_11", price: 50, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
      { name: "Vanilla Ice Cream", image: "food_12", price: 100, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
      { name: "Chicken Sandwich", image: "food_13", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
      { name: "Vegan Sandwich", image: "food_14", price: 110, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
      { name: "Grilled Sandwich", image: "food_15", price: 99, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
      { name: "Bread Sandwich", image: "food_16", price: 150, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
      { name: "Cup Cake", image: "food_17", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
      { name: "Vegan Cake", image: "food_18", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
      { name: "Butterscotch Cake", image: "food_19", price: 150, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
      { name: "Sliced Cake", image: "food_20", price: 60, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
      { name: "Garlic Mushroom", image: "food_21", price: 120, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
      { name: "Fried Cauliflower", image: "food_22", price: 86, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
      { name: "Mix Veg Pulao", image: "food_23", price: 80, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
      { name: "Rice Zucchini", image: "food_24", price: 90, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
      { name: "Cheese Pasta", image: "food_25", price: 70, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
      { name: "Tomato Pasta", image: "food_26", price: 149, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
      { name: "Creamy Pasta", image: "food_27", price: 132, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
      { name: "Chicken Pasta", image: "food_28", price: 199, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
      { name: "Buttter Noodles", image: "food_29", price: 116, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
      { name: "Veg Noodles", image: "food_30", price: 99, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
      { name: "Somen Noodles", image: "food_31", price: 166, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
      { name: "Cooked Noodles", image: "food_32", price: 124, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" }
    ];

    const newFoodItems = [
      { name: "Mediterranean Chickpea Salad", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop", price: 120, description: "Fresh chickpeas, cucumbers, tomatoes, feta cheese, and olives tossed in lemon vinaigrette", category: "Salad" },
      { name: "Avocado Quinoa Salad", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop", price: 160, description: "Fluffy quinoa, ripe avocado, cherry tomatoes, and spinach with honey mustard dressing", category: "Salad" },
      { name: "Paneer Tikka Roll", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop", price: 110, description: "Spicy marinated paneer chunks wrapped in a soft flatbread with mint chutney and onions", category: "Rolls" },
      { name: "Schezwan Chicken Roll", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop", price: 130, description: "Juicy chicken pieces tossed in fiery Schezwan sauce, wrapped with crunchy veggies", category: "Rolls" },
      { name: "Sizzling Chocolate Brownie", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop", price: 140, description: "Warm chocolate brownie served on a hot sizzler plate with vanilla ice cream and hot fudge", category: "Deserts" },
      { name: "Bellary Double Ka Meetha", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop", price: 90, description: "Traditional bread pudding dessert of Bellary soaked in saffron and cardamom milk", category: "Deserts" },
      { name: "Club House Sandwich", image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=500&auto=format&fit=crop", price: 140, description: "Triple-layered sandwich loaded with cheese, grilled chicken, lettuce, tomato, and fried egg", category: "Sandwich" },
      { name: "Pesto Caprese Sandwich", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop", price: 120, description: "Fresh mozzarella, tomatoes, and basil pesto grilled between sourdough slices", category: "Sandwich" },
      { name: "Red Velvet Dream Slice", image: "https://images.unsplash.com/photo-1586985289688-ca924911586c?w=500&auto=format&fit=crop", price: 150, description: "Decadent layers of red velvet sponge and rich cream cheese frosting", category: "Cake" },
      { name: "Classic Black Forest", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop", price: 130, description: "Layers of chocolate sponge, whipped cream, and cherries topped with chocolate shavings", category: "Cake" },
      { name: "Paneer Butter Masala Combo", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop", price: 180, description: "Rich, creamy paneer butter masala served with 2 butter naans or jeera rice", category: "Pure Veg" },
      { name: "Dal Makhani Grand", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop", price: 150, description: "Slow-cooked black lentils and red kidney beans cooked with butter and cream", category: "Pure Veg" },
      { name: "Penne Alfredo with Chicken", image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop", price: 190, description: "Penne pasta tossed in rich Parmesan cream sauce with grilled chicken breast and garlic", category: "Pasta" },
      { name: "Spicy Arrabbiata Pasta", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop", price: 150, description: "Spicy tomato sauce flavored with garlic, dried red chili peppers cooked in olive oil", category: "Pasta" },
      { name: "Schezwan Hakka Noodles", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop", price: 130, description: "Stir-fried noodles with crisp vegetables and a spicy, tangy Schezwan kick", category: "Noodles" },
      { name: "Singapore Fried Noodles", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop", price: 150, description: "Thin rice noodles stir-fried with vegetables, seasoned with curry powder and spices", category: "Noodles" },
      { name: "Bellary Mutton Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop", price: 260, description: "Aromatic basmati rice cooked with tender mutton pieces, local spices, and saffron", category: "Biryani" },
      { name: "Hyderabadi Chicken Dum Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop", price: 220, description: "Classic dum-cooked chicken biryani served with raita and mirchi ka salan", category: "Biryani" }
    ];

    const allFoodItems = [...foodListRaw, ...newFoodItems];

    // Seed food items dynamically based on restaurant cuisine types
    for (const restName in restaurantIds) {
      const restId = restaurantIds[restName];
      
      const itemsToSeed = allFoodItems.filter(item => {
        if (item.category === "Biryani") {
          return restName.toLowerCase().includes("biryani") || restName.toLowerCase().includes("mylari") || restName.toLowerCase().includes("bukhar") || restName.toLowerCase().includes("karim") || restName.toLowerCase().includes("nile") || restName.toLowerCase().includes("gate");
        }
        if (item.category === "Deserts" || item.category === "Cake" || item.category === "Sandwich") {
          return restName.toLowerCase().includes("cafe") || restName.toLowerCase().includes("house") || restName.toLowerCase().includes("diner") || restName.toLowerCase().includes("bakery");
        }
        if (item.category === "Pure Veg") {
          return restName.toLowerCase().includes("grand") || restName.toLowerCase().includes("darshini") || restName.toLowerCase().includes("suhani") || restName.toLowerCase().includes("veg") || restName.toLowerCase().includes("chutney") || restName.toLowerCase().includes("shabree") || restName.toLowerCase().includes("vaishali") || restName.toLowerCase().includes("palace");
        }
        if (item.category === "Salad" || item.category === "Rolls") {
          return !restName.toLowerCase().includes("house") && !restName.toLowerCase().includes("parlour") && !restName.toLowerCase().includes("idli");
        }
        // Pasta & Noodles
        return !restName.toLowerCase().includes("idli") && !restName.toLowerCase().includes("darshini") && !restName.toLowerCase().includes("parlour");
      });

      // Backup: if no items matched, give it desserts
      const finalItems = itemsToSeed.length > 0 ? itemsToSeed : allFoodItems.filter(item => item.category === "Deserts" || item.category === "Cake");

      for (const item of finalItems) {
        await pool.query(
          `INSERT INTO food_items (restaurant_id, name, price, description, category, image_url) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [restId, item.name, item.price, item.description, item.category, item.image]
        );
      }
    }

    console.log("Seeding completed successfully for all 10 cities!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seed();
