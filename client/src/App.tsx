import { useState, useEffect } from "react";

function App() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/core/health')
      .then(r => r.json())
      .then(d => setStatus(d.message))
      .catch(() => setStatus("Error connecting to API"));
  }, []);

  return (
    <div className="App">
      <h1>HouseParty Client!</h1>
      <p>API Status: {status}</p>
    </div>
  );
}

export default App;