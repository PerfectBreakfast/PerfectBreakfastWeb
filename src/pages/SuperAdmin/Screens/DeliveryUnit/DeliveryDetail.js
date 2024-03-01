import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";

const DeliveryDetail = () => {
  const { id } = useParams();
  const [deliveryData, setDeliveryData] = useState(null);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const data = await deliveryUnitAPI.getDeliveryById(id);
        setDeliveryData(data);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    };

    fetchDeliveryData();
  }, [id]);

  if (!deliveryData) {
    return <div>Loading...</div>; // or any other loading state representation
  }

  // Destructuring for easier access
  const { name, address, phoneNumber, commissionRate, memberCount } =
    deliveryData;

  return (
    <div>
      <h1>{name}</h1>
      <p>
        <strong>Address:</strong> {address}
      </p>
      <p>
        <strong>Phone Number:</strong> {phoneNumber}
      </p>
      <p>
        <strong>Commission Rate:</strong> {commissionRate}%
      </p>
      <p>
        <strong>Member Count:</strong> {memberCount}
      </p>
    </div>
  );
};

export default DeliveryDetail;
