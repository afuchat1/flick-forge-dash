import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { installImageGuard } from "./lib/imageGuard";
import "./index.css";

installImageGuard();

createRoot(document.getElementById("root")!).render(

  <HelmetProvider>
    <App />
  </HelmetProvider>
);
