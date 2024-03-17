import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Html5QrcodeScanner } from "html5-qrcode";

const ScanQR = () => {
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const [qrCodeMessage, setQrCodeMessage] = useState("");
  const scannerInstance = useRef(null); // Thêm biến ref để giữ instance

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!qrRef.current) return; // Kiểm tra nếu ref không tồn tại

    // Chỉ khởi tạo scanner nếu chưa tồn tại
    if (!scannerInstance.current) {
      console.log("check");
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      scannerInstance.current = new Html5QrcodeScanner(
        "qr-reader",
        config,
        false
      );

      const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        if (decodedText.startsWith("pb")) {
          // Save the string after 'pb' into orderId
          const result = decodedText.substring(3); // Remove 'pb' and save the rest
          setQrCodeMessage(result);
          navigate(`/order/${result}`);
        }
      };

      scannerInstance.current.render(qrCodeSuccessCallback);
    }

    // Cleanup
    return () => {
      if (scannerInstance.current) {
        scannerInstance.current.clear();
        scannerInstance.current = null;
      }
    };
  }, [navigate]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-3">
        <button onClick={handleGoBack}>
          <ArrowBackIosIcon />
        </button>
        <h2 className="text-2xl font-bold text-center flex-grow">Quét mã</h2>
      </div>
      <div id="qr-reader" ref={qrRef} className="qr-reader" />
      {qrCodeMessage && (
        <p className="text-center mt-4">Kết quả: {qrCodeMessage}</p>
      )}
    </div>
  );
};

export default ScanQR;
