import { useState, useEffect } from "react";
import { LoginSignup } from "./component/LoginSignup/LoginSignup";

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/core/health')
      .then(r => r.json())
      .then(d => setStatus(d.message))
      .catch(() => setStatus("Error connecting to API"));
  }, []);

  return (
    <div className="app-container">
      <LoginSignup/>
    </div>
  );
}

export default App;