import React, { useState } from "react";

const ShipperSelectModal = ({ shipperData, onClose, onSubmit }) => {
  const [selectedShipperIds, setSelectedShipperIds] = useState([]);

  const handleShipperChange = (event) => {
    const value = event.target.value;
    setSelectedShipperIds((prev) =>
      prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedShipperIds);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-3xl">
        <div>
          <div className="text-lg font-bold mb-4">Chọn người giao hàng</div>
          {shipperData &&
            shipperData.map((shipper) => (
              <div key={shipper.id} className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    className="mr-2"
                    value={shipper.id}
                    onChange={handleShipperChange}
                    checked={selectedShipperIds.includes(shipper.id)}
                  />
                  {shipper.name}
                </label>
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipperSelectModal;
