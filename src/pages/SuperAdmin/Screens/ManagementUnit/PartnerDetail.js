import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import managementUnitAPI from "../../../../services/managementUnitAPI";

const PartnerDetail = () => {
  const { id } = useParams();
  const [partnerData, setPartnerData] = useState(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const data = await managementUnitAPI.getPartnerById(id);
        setPartnerData(data);
      } catch (error) {
        console.error("Error fetching partner data:", error);
      }
    };

    fetchPartnerData();
  }, [id]);

  return (
    <div>
      {partnerData ? (
        <>
          <h2>Partner Details</h2>
          <p>
            <strong>Name:</strong> {partnerData.name}
          </p>
          <p>
            <strong>Address:</strong> {partnerData.address}
          </p>
          <p>
            <strong>Phone Number:</strong> {partnerData.phoneNumber}
          </p>
          <p>
            <strong>Commission Rate:</strong> {partnerData.commissionRate}%
          </p>

          <h3>Suppliers</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {partnerData.supplierDTO.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Companies</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {partnerData.companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.name}</td>
                  <td>{company.phoneNumber}</td>
                  <td>{company.email}</td>
                  <td>{company.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PartnerDetail;
