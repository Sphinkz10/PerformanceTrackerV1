
  import { createRoot } from "react-dom/client";
  import { initSentry } from "./lib/sentry";
  
  // Initialize Sentry before the app mounts
  initSentry();

  import App from "./App.tsx";
  import "./index.css";
  import { ErrorBoundary } from "./components/ui/ErrorBoundary";

  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  