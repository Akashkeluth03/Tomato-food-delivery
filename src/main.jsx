import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { FoodProvider } from "./context/FoodContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FoodProvider>
        <App />
      </FoodProvider>
    </BrowserRouter>
  </StrictMode>
);
