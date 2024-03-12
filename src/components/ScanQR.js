import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const QrScanner = () => {
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate(); // Use the useNavigate hook

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    ); // verbose set to false

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      // Check if QR Code contains 'pb' at the beginning
      if (decodedText.startsWith("pb")) {
        // Save the string after 'pb' into orderId
        const result = decodedText.substring(3); // Remove 'pb' and save the rest
        setOrderId(result);
        qrScanner.clear().then(() => {
          // Use navigate to redirect after successful scan and stop the camera
          navigate(`/order/${result}`);
        });
      }
    };

    qrScanner.render(qrCodeSuccessCallback);

    return () => {
      qrScanner.clear(); // Ensure the camera is stopped when the component unmounts
    };
  }, [navigate]); // Add navigate to the useEffect dependency list

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        id="qr-reader"
        className="w-full max-w-md h-auto aspect-square bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div className="flex justify-center items-center h-full">
          {/* Placeholder for QR scanner */}
        </div>
      </div>
    </div>
  );
};

export default QrScanner;
