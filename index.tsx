import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
throw new Error("Could not find root element to mount to");
}

// Detectar entorno: local usa HashRouter, cualquier dominio real usa BrowserRouter
const hostname =
typeof window !== "undefined" ? window.location.hostname : "";

const isLocal =
hostname === "localhost" || hostname === "127.0.0.1";

const Router = isLocal ? HashRouter : BrowserRouter;

const root = ReactDOM.createRoot(rootElement);
root.render(
<React.StrictMode>
<Router>
<App />
</Router>
</React.StrictMode>
);