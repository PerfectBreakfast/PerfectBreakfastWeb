import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QrScan = () => {
  const [result, setResult] = useState("No result");
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  return (
    <div>
      <button onClick={toggleScanner}>
        {showScanner ? "Stop Scanning" : "Start Scanning"}
      </button>
      {showScanner && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      )}
      <p>{result}</p>
    </div>
  );
};

export default QrScan;
