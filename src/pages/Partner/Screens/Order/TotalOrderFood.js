import React, { useEffect, useState } from "react";
import dishAPI from "../../../../services/dishAPI";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";
import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";

const TotalOrderFood = () => {
  const [orderFoodData, setOrderFoodData] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [foodData, setFoodData] = useState(null);

  // New state for tracking food assignments
  const [foodAssignments, setFoodAssignments] = useState([]);

  useEffect(() => {
    const fetchOrderFoodData = async () => {
      try {
        const data = await dishAPI.getOrderFoodForPartner();
        setOrderFoodData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    const fetchSupplier = async () => {
      try {
        const data = await supplierUnitAPI.getSupplierByPartner();
        setSupplierData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    const fetchFood = async () => {
      try {
        const data = await dishAPI.getDishAll();
        setFoodData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchFood();
    fetchSupplier();
    fetchOrderFoodData();
  }, []);

  // Function to handle food assignment changes
  // const handleFoodAssignmentChange = (index, supplierId, amountCooked) => {
  //   const updatedAssignments = [...foodAssignments];
  //   updatedAssignments[index] = {
  //     supplierId,
  //     amountCooked,
  //     foodId: orderFoodData[index].id, // Assuming you have a unique identifier for food
  //   };
  //   setFoodAssignments(updatedAssignments);
  // };
  // Function to handle food assignment changes
  const handleFoodAssignmentChange = (index, supplierId, amountCooked) => {
    const updatedAssignments = [...foodAssignments];
    const foodId = orderFoodData[index].id;

    // Find if there is an existing assignment for the selected supplier
    const existingIndex = updatedAssignments.findIndex(
      (assignment) => assignment.supplierId === supplierId
    );

    if (existingIndex !== -1) {
      // If the supplier already exists, update the foodAssignmentRequests
      updatedAssignments[existingIndex].foodAssignmentRequests.push({
        amountCooked,
        foodId,
      });
    } else {
      // If the supplier doesn't exist, create a new assignment
      updatedAssignments.push({
        supplierId,
        foodAssignmentRequests: [
          {
            amountCooked,
            foodId,
          },
        ],
      });
    }

    setFoodAssignments(updatedAssignments);
  };

  // Function to handle submitting the assignments
  const handleSubmitAssignments = async () => {
    try {
      const assignmentsPayload = foodAssignments.map((assignment) => ({
        supplierId: assignment.supplierId,
        foodAssignmentRequests: [
          {
            amountCooked: assignment.amountCooked,
            foodId: assignment.foodId,
          },
        ],
      }));
      // API call to submit assignments
      await SupplierFoodAssignmentAPI.FoodAssigment(assignmentsPayload);
      // Optionally, you can reset the state after successful submission
      console.log("end", assignmentsPayload);
      setFoodAssignments([]);
    } catch (error) {
      console.error("Error submitting food assignments:", error);
    }
  };
  console.log("data", foodAssignments);

  return (
    <div>
      <h2>Order Details</h2>
      {orderFoodData ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Assign to Supplier</th>
            </tr>
          </thead>
          <tbody>
            {orderFoodData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  {/* Supplier select and amount input */}
                  <select
                    value={foodAssignments[index]?.supplierId || ""}
                    onChange={(e) =>
                      handleFoodAssignmentChange(
                        index,
                        e.target.value,
                        foodAssignments[index]?.amountCooked || 0
                      )
                    }
                  >
                    <option value="">Select Supplier</option>
                    {supplierData &&
                      supplierData.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    value={foodAssignments[index]?.amountCooked || 0}
                    onChange={(e) =>
                      handleFoodAssignmentChange(
                        index,
                        foodAssignments[index]?.supplierId || "",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      {/* Button to submit assignments */}
      <button onClick={handleSubmitAssignments}>Submit Assignments</button>
    </div>
  );
};

export default TotalOrderFood;
