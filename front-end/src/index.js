import React from "react"
import App from "./App"
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

// Render the App component into the DOM
root.render(
    <App/>
);