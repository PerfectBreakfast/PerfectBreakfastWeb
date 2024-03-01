import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";
import { toast } from "react-toastify";

const EditSupplier = () => {
  const [supplierData, setSupplierData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const data = await supplierUnitAPI.getSupplierById(id);
        if (data) {
          setSupplierData(data);
        }
      } catch (error) {
        console.error("Error fetching supplier data:", error);
        toast.error("Failed to fetch supplier data!");
      }
    };

    fetchSupplierData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSupplier = async (e) => {
    e.preventDefault(); // Prevent form from submitting traditionally
    try {
      await supplierUnitAPI.editSupplier(id, supplierData);
      toast.success("Supplier updated successfully!");
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier!");
    }
  };

  return (
    <div className="edit-supplier-container">
      <h2>Edit Supplier</h2>
      <form onSubmit={handleEditSupplier}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={supplierData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={supplierData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={supplierData.phoneNumber}
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

export default EditSupplier;
