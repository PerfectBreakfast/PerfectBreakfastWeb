import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";

const OrderDetailByCompany = () => {
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const bookingDate = searchParams.get("bookingDate");

  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await DailyOrderAPI.getDailyOrderDetailByCompany(
          companyId,
          bookingDate
        );
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchOrderDetail();
  }, [companyId, bookingDate]);

  return (
    <div>
      <h2>Order Details</h2>
      {orderData ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrderDetailByCompany;
