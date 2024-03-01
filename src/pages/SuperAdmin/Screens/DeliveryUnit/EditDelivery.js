import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";

const EditDelivery = () => {
  const [deliveryData, setDeliveryData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    commissionRate: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const data = await deliveryUnitAPI.getDeliveryById(id);
        if (data) {
          setDeliveryData(data);
        }
      } catch (error) {
        console.error("Error fetching delivery data:", error);
        toast.error("Failed to fetch delivery data!");
      }
    };

    fetchDeliveryData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditDelivery = async (e) => {
    e.preventDefault(); // Prevent form from submitting traditionally
    try {
      await deliveryUnitAPI.editDelivery(id, deliveryData);
      toast.success("Delivery updated successfully!");
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      console.error("Error updating delivery:", error);
      toast.error("Failed to update delivery!");
    }
  };

  return (
    <div className="edit-delivery-container">
      <h2>Edit Delivery</h2>
      <form onSubmit={handleEditDelivery}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={deliveryData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={deliveryData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={deliveryData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Commission Rate</label>
          <input
            type="text"
            name="commissionRate"
            value={deliveryData.commissionRate}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditDelivery;
