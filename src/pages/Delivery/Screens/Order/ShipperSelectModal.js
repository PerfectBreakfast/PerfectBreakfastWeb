import React, { useState } from "react";

const ShipperSelectModal = ({ shipperData, onClose, onSubmit }) => {
  const [selectedShipperId, setSelectedShipperId] = useState("");

  const handleShipperChange = (event) => {
    setSelectedShipperId(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(selectedShipperId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <div>
          <div className="text-lg font-bold mb-4">Chọn người giao hàng</div>
          <select
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={selectedShipperId}
            onChange={handleShipperChange}
          >
            <option value="">Vui lòng chọn shipper</option>
            {shipperData &&
              shipperData.map((shipper) => (
                <option key={shipper.id} value={shipper.id}>
                  {shipper.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-l"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipperSelectModal;
