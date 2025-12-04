import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
throw new Error("Could not find root element to mount to");
}

// Detectar si estamos en producción real (dominio)
const isProductionDomain =
typeof window !== "undefined" &&
window.location.hostname.includes("aprende.marketing");

// Elegir Router dinámicamente
const Router = isProductionDomain ? BrowserRouter : HashRouter;

const root = ReactDOM.createRoot(rootElement);
root.render(
<React.StrictMode>
<Router>
<App />
</Router>
</React.StrictMode>
);