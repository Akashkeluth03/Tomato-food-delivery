-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location_id INT REFERENCES locations(id) ON DELETE CASCADE,
  image_url TEXT,
  cuisine VARCHAR(100),
  rating DECIMAL(3, 1),
  is_online_delivery BOOLEAN DEFAULT true
);

-- Create food_items table
CREATE TABLE IF NOT EXISTS food_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  image_url TEXT
);
