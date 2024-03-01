import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import managementUnitAPI from "../../../../services/managementUnitAPI";
import { toast } from "react-toastify";

const EditPartner = () => {
  const [partnerData, setPartnerData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    commissionRate: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const data = await managementUnitAPI.getPartnerById(id);
        if (data) {
          setPartnerData(data);
        }
      } catch (error) {
        console.error("Error fetching partner data:", error);
        toast.error("Failed to fetch partner data!");
      }
    };

    fetchPartnerData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartnerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditPartner = async (e) => {
    e.preventDefault(); // Prevent form from submitting traditionally
    try {
      await managementUnitAPI.editPartner(id, partnerData);
      toast.success("Partner updated successfully!");
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      console.error("Error updating partner:", error);
      toast.error("Failed to update partner!");
    }
  };

  return (
    <div className="edit-partner-container">
      <h2>Edit Partner</h2>
      <form onSubmit={handleEditPartner}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={partnerData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={partnerData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={partnerData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Commission Rate</label>
          <input
            type="text"
            name="commissionRate"
            value={partnerData.commissionRate}
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

export default EditPartner;
