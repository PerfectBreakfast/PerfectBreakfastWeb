import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";

const SupplierDetail = () => {
  const { id } = useParams();
  const [supplierData, setSupplierData] = useState(null);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const data = await supplierUnitAPI.getSupplierById(id);
        setSupplierData(data);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };

    fetchSupplierData();
  }, [id]);
  console.log("sp", id);
  return (
    <div>
      <h2>Supplier Details</h2>
      {supplierData ? (
        <div>
          <p>
            <strong>Name:</strong> {supplierData.name}
          </p>
          <p>
            <strong>Address:</strong> {supplierData.address}
          </p>
          <p>
            <strong>Phone Number:</strong> {supplierData.phoneNumber}
          </p>
          <h3>Management Units</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Commission Rate</th>
              </tr>
            </thead>
            <tbody>
              {supplierData.managementUnitDtos.map((unit) => (
                <tr key={unit.id}>
                  <td>{unit.name}</td>
                  <td>{unit.address}</td>
                  <td>{unit.phoneNumber}</td>
                  <td>{unit.commissionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading supplier details...</p>
      )}
    </div>
  );
};

export default SupplierDetail;
