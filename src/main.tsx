import React from "react";
import ReactDOM from "react-dom/client";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";
import App from "./App";

class AppErrorBoundary extends React.Component<React.PropsWithChildren, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(error: Error) {
    return { error: error?.stack || error?.message || String(error) };
  }
  componentDidCatch(error: Error) {
    console.error("Simulator render error:", error);
  }
  render() {
    if (this.state.error) {
      return <main style={{minHeight:"100vh",background:"#07111d",color:"#f2b083",padding:"32px",fontFamily:"monospace"}}>
        <h1>Simulator startup error</h1>
        <p>The page loaded, but the application encountered a JavaScript error.</p>
        <pre style={{whiteSpace:"pre-wrap",color:"#d7e1ec",background:"#102235",padding:"16px",borderRadius:"8px"}}>{this.state.error}</pre>
        <p>Please send this error text to the project maintainer.</p>
      </main>;
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Missing #root element in index.html");
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppErrorBoundary><App /></AppErrorBoundary>
  </React.StrictMode>,
);

window.addEventListener("error", (event) => {
  console.error("Global simulator error:", event.error || event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled simulator promise rejection:", event.reason);
});
