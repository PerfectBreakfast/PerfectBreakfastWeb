import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrScanner = () => {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    qrScanner.render((decodedText, decodedResult) => {
      setOrderId(decodedText);
      qrScanner.clear(); // Dừng camera sau khi quét thành công
    });

    return () => {
      qrScanner.clear(); // Đảm bảo dừng camera khi component unmount
    };
  }, []);

  return (
    <div>
      <div id="qr-reader" style={{ width: "500px", height: "500px" }}></div>
      {orderId && <p>Order ID: {orderId}</p>}
    </div>
  );
};

export default QrScanner;
