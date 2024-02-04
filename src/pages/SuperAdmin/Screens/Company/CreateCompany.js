import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import managementUnitAPI from "../../../../services/managementUnitAPI";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";
import companyAPI from "../../../../services/companyAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateCompany = () => {
  const [managementUnitId, setManagementUnitId] = useState("");
  const [deliveryUnitId, setDeliveryUnitId] = useState("");
  const [managementData, setManagementData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [companyData, setCompanyData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    startWorkHour: "00:00:00", // Giá trị mặc định
  });
  const navigate = useNavigate();
  const handleManagementUnitChange = (event) => {
    const selectedManagementUnitId = event.target.value;
    setManagementUnitId(selectedManagementUnitId);

    // Cập nhật companyData
    setCompanyData((prevData) => ({
      ...prevData,
      managementUnitId: selectedManagementUnitId,
    }));
  };

  const handleDeliveryUnitChange = (event) => {
    const selectedDeliveryUnitId = event.target.value;
    setDeliveryUnitId(selectedDeliveryUnitId);

    // Cập nhật companyData
    setCompanyData((prevData) => ({
      ...prevData,
      deliveryUnitId: selectedDeliveryUnitId,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await companyAPI.createCompanyUnit(companyData);
      toast.success("Tạo mới công ty thành công!");
      navigate(-1); // Or wherever you want to redirect after success
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const managementData = await managementUnitAPI.getAllManagementUnit();
        const deliveryData = await deliveryUnitAPI.getManagementUnit();
        setManagementData(managementData);
        setDeliveryData(deliveryData);
      } catch (error) {
        console.error("Error fetching combo data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <form>
        {/* Text field for Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Tên công ty
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Nhập tên công ty"
            name="name"
            value={companyData.name}
            onChange={handleInputChange}
          />
        </div>

        {/* Text field for Phone Number */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            Số điện thoại
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phoneNumber"
            type="text"
            placeholder="Nhập số điện thoại"
            name="phoneNumber"
            value={companyData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>

        {/* Text field for Email */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="Nhập Email"
            placeholder="Email"
            name="email"
            value={companyData.email}
            onChange={handleInputChange}
          />
        </div>

        {/* Text field for Address */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Địa chỉ
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Nhập địa chỉ công ty"
            name="address"
            value={companyData.address}
            onChange={handleInputChange}
          />
        </div>

        {/* Text field for Start Work Hour */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="startWorkHour"
          >
            Giờ vào làm
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="startWorkHour"
            type="time"
            placeholder="Start Work Hour"
            name="startWorkHour"
            value={companyData.startWorkHour}
            onChange={handleInputChange}
            step="1"
          />
        </div>

        {/* Select field for Management Unit */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="managementUnit"
          >
            Đơn vị đối tác
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="managementUnit"
            name="managementUnit"
            value={managementUnitId}
            onChange={handleManagementUnitChange}
          >
            {managementData.map((management) => (
              <option key={management.id} value={management.id}>
                {management.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select field for Delivery Unit */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="deliveryUnit"
          >
            Đơn vị vận chuyển
          </label>
          <select
            className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="deliveryUnit"
            name="deliveryUnit"
            value={deliveryUnitId}
            onChange={handleDeliveryUnitChange}
          >
            {deliveryData.map((delivery) => (
              <option key={delivery.id} value={delivery.id}>
                {delivery.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            Tạo mới
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompany;
