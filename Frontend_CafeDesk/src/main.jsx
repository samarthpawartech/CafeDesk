import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css"; // Tailwind + global styles

// Get the root element (renamed to rootElement to avoid conflicts)
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Create React root
const root = createRoot(rootElement);

// Render the App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
