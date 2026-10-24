import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [musics, setMusics] = useState([]);
  const [errorStatus, setErrorStatus] = useState("");

  // Fix 1: Renamed the function to 'loadMusic' to avoid shadowing the global fetch API
  async function loadMusic() {
    console.log("Fetching music data...");
    try {
      // Enforce global window.fetch explicitly to bypass any remaining scoping issues
      let res = await window.fetch("http://localhost:3000/");
      
      if (!res.ok) throw new Error(`HTTP Server Error: ${res.status}`);
      
      let data = await res.json();
      console.log("Data received:", data);
      
      // Fix 2: Actually save the fetched array to your React state so the UI updates
      setMusics(data); 
    } catch (err) {
      console.error("Network fetch failed:", err.message);
      setErrorStatus(err.message);
    }
  }

  useEffect(() => {
    loadMusic();
  }, []);
  
  return (
    <main className="container">
      {/* Fix 3: Updated click handler to reference the renamed function */}
      <button onClick={loadMusic}>MusicMiner</button>

      {errorStatus && <div style={{ color: "red" }}>Error: {errorStatus}</div>}

      <div>
        {/* Added optional chaining and key index parameters for clean React list rendering */}
        {musics?.map((a, index) => (
          <div key={index}>{a.hi}</div>
        ))}
      </div>
    </main>
  );
}

export default App;
