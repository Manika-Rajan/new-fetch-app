import React, { useState } from "react";

const App = () => {
  const [fileKey, setFileKey] = useState(""); // Store user input for file key
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPresignedUrl = async () => {
    if (!fileKey) {
      setError("Please enter a file key.");
      return;
    }
    
    setIsLoading(true); // Start spinner
    setError(null); // Reset error
    setResponse(null); // Reset response
    try {
      const res = await fetch(
        "https://vtwyu7hv50.execute-api.ap-south-1.amazonaws.com/default/RBR_report_pre-signed_URL",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_key: fileKey, // Use the user-provided file key
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.presigned_url || "No URL in response");
    } catch (err) {
      setError(err.message || "Unknown error occurred");
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Test Fetch Presigned URL</h1>
      
      {/* Input field for file key */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="fileKey">Enter File Key: </label>
        <input
          type="text"
          id="fileKey"
          value={fileKey}
          onChange={(e) => setFileKey(e.target.value)} // Update fileKey on input change
          placeholder="e.g., compressed.tracemonkey-pldi-09.pdf"
        />
      </div>

      <button onClick={fetchPresignedUrl} disabled={isLoading}>
        {isLoading ? "Loading..." : "Fetch Presigned URL"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {isLoading && <p>Fetching...</p>}
        {response && (
          <div>
            <h3>Presigned URL:</h3>
            <a href={response} target="_blank" rel="noopener noreferrer">
              {response}
            </a>
          </div>
        )}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
      </div>
    </div>
  );
};

export default App;
