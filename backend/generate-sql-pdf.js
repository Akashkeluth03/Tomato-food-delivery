const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function generatePDF() {
  console.log("Generating SQL Documentation PDF...");
  
  const doc = new PDFDocument({ margin: 50 });
  const outputPath = path.join(__dirname, "../SQL_Database_Documentation.pdf");
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  try {
    // Fetch live data to demonstrate
    const locationsRes = await pool.query("SELECT * FROM locations ORDER BY id ASC");
    const restaurantsRes = await pool.query(
      "SELECT r.id, r.name, r.cuisine, r.rating, l.name as city FROM restaurants r JOIN locations l ON r.location_id = l.id LIMIT 5"
    );
    const foodItemsRes = await pool.query(
      "SELECT f.name, f.price, f.category, r.name as restaurant FROM food_items f JOIN restaurants r ON f.restaurant_id = r.id LIMIT 5"
    );

    // --- TITLE PAGE / HEADER ---
    doc.fillColor("#FF6347").fontSize(26).font("Helvetica-Bold").text("TOMATO FOOD DELIVERY APP", { align: "center" });
    doc.moveDown(0.3);
    doc.fillColor("#262626").fontSize(18).font("Helvetica-Bold").text("PostgreSQL Database Schema & Live Demo", { align: "center" });
    doc.moveDown(0.5);
    doc.fillColor("#666666").fontSize(10).font("Helvetica-Oblique").text("Generated automatically from active database records", { align: "center" });
    doc.moveDown(1.5);
    
    // Draw divider
    doc.strokeColor("#E2E8F0").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    // --- SECTION 1: DATABASE SCHEMA ---
    doc.fillColor("#FF6347").fontSize(14).font("Helvetica-Bold").text("1. Relational Table Schema (DDL)");
    doc.moveDown(0.8);

    const schemaText = `-- 1. Locations Table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Restaurants Table (Linked to Locations)
CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location_id INT REFERENCES locations(id) ON DELETE CASCADE,
  image_url TEXT,
  cuisine VARCHAR(100),
  rating DECIMAL(3, 1),
  is_online_delivery BOOLEAN DEFAULT true
);

-- 3. Food Items Table (Linked to Restaurants)
CREATE TABLE food_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  image_url TEXT
);`;

    doc.fillColor("#2D3748")
       .font("Courier")
       .fontSize(9.5)
       .text(schemaText, { lineGap: 3, paragraphGap: 5 });

    doc.moveDown(1.5);
    
    // --- SECTION 2: LIVE DATA DEMONSTRATION ---
    doc.addPage();
    doc.fillColor("#FF6347").font("Helvetica-Bold").fontSize(14).text("2. Live Data Records");
    doc.moveDown(1);

    // Locations Data
    doc.fillColor("#262626").font("Helvetica-Bold").fontSize(11).text("Table: locations (Sample Cities)");
    doc.moveDown(0.4);
    locationsRes.rows.forEach(loc => {
      doc.fillColor("#4A5568").font("Helvetica").fontSize(9.5).text(` • ID: ${loc.id} | City: ${loc.name}`);
    });
    doc.moveDown(1.5);

    // Restaurants Data
    doc.fillColor("#262626").font("Helvetica-Bold").fontSize(11).text("Table: restaurants (Sample Restaurants)");
    doc.moveDown(0.4);
    restaurantsRes.rows.forEach(rest => {
      doc.fillColor("#4A5568").font("Helvetica").fontSize(9.5)
         .text(` • [ID: ${rest.id}] ${rest.name} (${rest.city}) | Cuisine: ${rest.cuisine} | Rating: ${parseFloat(rest.rating).toFixed(1)}`);
    });
    doc.moveDown(1.5);

    // Food Items Data
    doc.fillColor("#262626").font("Helvetica-Bold").fontSize(11).text("Table: food_items (Sample Menu Items)");
    doc.moveDown(0.4);
    foodItemsRes.rows.forEach(item => {
      doc.fillColor("#4A5568").font("Helvetica").fontSize(9.5)
         .text(` • ${item.name} (Rs. ${Math.round(item.price)}) | Category: ${item.category} | Restaurant: ${item.restaurant}`);
    });

    // --- SECTION 3: KEY SQL QUERIES ---
    doc.moveDown(1.5);
    doc.fillColor("#FF6347").font("Helvetica-Bold").fontSize(14).text("3. Core SQL Queries Used in App");
    doc.moveDown(0.8);

    const queryExample = `-- Query restaurants and join cities:
SELECT r.name, r.cuisine, r.rating, l.name as city
FROM restaurants r
JOIN locations l ON r.location_id = l.id
WHERE l.name = 'Bellary' AND r.is_online_delivery = true;

-- Query specific restaurant menu items:
SELECT f.name, f.price, f.category
FROM food_items f
JOIN restaurants r ON f.restaurant_id = r.id
WHERE r.id = 1;`;

    doc.fillColor("#2D3748")
       .font("Courier")
       .fontSize(9.5)
       .text(queryExample, { lineGap: 3, paragraphGap: 5 });

    // End Document
    doc.end();
    console.log("PDF generated successfully!");
  } catch (err) {
    console.error("Error generating PDF:", err);
  } finally {
    await pool.end();
  }
}

generatePDF();
