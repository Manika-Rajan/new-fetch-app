import React, { useState } from "react";

const App = () => {
  const [pdfUrl, setPdfUrl] = useState(""); // To store the presigned URL
  const [isLoading, setIsLoading] = useState(false); // To show a loading spinner
  const [error, setError] = useState(""); // To display errors if any

  const fetchPresignedUrl = async () => {
    setIsLoading(true);
    setError(""); // Clear previous errors
    setPdfUrl(""); // Clear previous URL

    try {
      const response = await fetch(
        "https://vtwyu7hv50.execute-api.ap-south-1.amazonaws.com/default/RBR_report_pre-signed_URL",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_key: "compressed.tracemonkey-pldi-09.pdf" }), // Adjust the file key as needed
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data); // Log the response for debugging

      if (data.presigned_url) {
        setPdfUrl(data.presigned_url); // Save the presigned URL
      } else {
        throw new Error("Presigned URL not found in the response.");
      }
    } catch (error) {
      console.error("Error fetching presigned URL:", error.message);
      setError(error.message); // Set error message
    } finally {
      setIsLoading(false); // Stop the spinner
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Fetch Presigned URL</h1>
      <button
        onClick={fetchPresignedUrl}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Fetch URL
      </button>
      {isLoading && (
        <div style={{ marginTop: "20px" }}>
          <p>Loading...</p>
        </div>
      )}
      {pdfUrl && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Presigned URL:</strong></p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Open PDF
          </a>
        </div>
      )}
      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
