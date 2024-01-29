import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import managementUnitAPI from "../../../../services/managementUnitAPI";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";
import companyAPI from "../../../../services/companyAPI";

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
      // Xử lý sau khi tạo công ty thành công (nếu cần)
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
    <div>
      <form>
        <TextField
          label="Name"
          type="text"
          name="name"
          value={companyData.name}
          onChange={handleInputChange}
        />

        <TextField
          label="Phone Number"
          type="text"
          name="phoneNumber"
          value={companyData.phoneNumber}
          onChange={handleInputChange}
        />

        <TextField
          label="Email"
          type="text"
          name="email"
          value={companyData.email}
          onChange={handleInputChange}
        />

        <TextField
          label="Address"
          type="text"
          name="address"
          value={companyData.address}
          onChange={handleInputChange}
        />

        <TextField
          label="Start Work Hour"
          type="time"
          name="startWorkHour"
          value={companyData.startWorkHour}
          onChange={handleInputChange}
          inputProps={{
            step: 1, // Cho phép chọn theo giây
          }}
        />

        <TextField
          label="Management Unit"
          select
          value={managementUnitId}
          onChange={handleManagementUnitChange}
        >
          {managementData.map((management) => (
            <MenuItem key={management.id} value={management.id}>
              {management.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Delivery Unit"
          select
          value={deliveryUnitId}
          onChange={handleDeliveryUnitChange}
        >
          {deliveryData.map((delivery) => (
            <MenuItem key={delivery.id} value={delivery.id}>
              {delivery.name}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" onClick={handleSubmit}>
          Create Company
        </Button>
      </form>
    </div>
  );
};

export default CreateCompany;
