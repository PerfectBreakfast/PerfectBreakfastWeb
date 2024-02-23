import React, { useEffect, useState } from "react";
import dishAPI from "../../../../services/dishAPI";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";
import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";

const TotalOrderFood = () => {
  const [orderFoodData, setOrderFoodData] = useState(null);
  const [supplierData, setSupplierData] = useState(null);

  // New state for tracking food assignments
  const [foodAssignments, setFoodAssignments] = useState([]);
  const [tempAssignments, setTempAssignments] = useState({});

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

    fetchSupplier();
    fetchOrderFoodData();
  }, []);
  const handleSelectChange = (foodId, event) => {
    const amount = event.target.nextSibling.value;
    const supplierId = event.target.value;
    const newAssignment = {
      supplierId,
      foodId,
      amountCooked: Number(amount),
    };
    setFoodAssignments((prevAssignments) => {
      // Remove any existing assignment for this foodId
      const filteredAssignments = prevAssignments.filter(
        (assignment) => assignment.foodId !== foodId
      );
      return [...filteredAssignments, newAssignment];
    });
  };

  const handleAmountChange = (foodId, event) => {
    const amount = event.target.value;
    const supplierSelect = event.target.previousSibling;
    const supplierId = supplierSelect.value;
    if (supplierId) {
      const newAssignment = {
        supplierId,
        foodId,
        amountCooked: Number(amount),
      };
      setFoodAssignments((prevAssignments) => {
        const filteredAssignments = prevAssignments.filter(
          (assignment) => assignment.foodId !== foodId
        );
        return [...filteredAssignments, newAssignment];
      });
    }
  };

  const submitAssignments = async () => {
    // Chuyển tempAssignments thành một mảng của các assignments với foodId
    const assignmentsToSubmit = Object.entries(tempAssignments).flatMap(
      ([foodId, assignments]) =>
        assignments.map((assignment) => ({
          ...assignment,
          foodId,
        }))
    );

    try {
      await SupplierFoodAssignmentAPI.FoodAssigment(assignmentsToSubmit);
      alert("Assignments submitted successfully!");
    } catch (error) {
      console.error("Error submitting assignments:", error);
    }
  };

  const addSupplierSelection = (foodId) => {
    setTempAssignments((prev) => {
      const existingAssignments = prev[foodId] || [];
      return {
        ...prev,
        [foodId]: [...existingAssignments, { supplierId: "", amountCooked: 0 }],
      };
    });
  };

  const handleAssignmentChange = (foodId, index, field, value) => {
    setTempAssignments((prev) => {
      const assignments = [...(prev[foodId] || [])];
      if (assignments[index]) {
        assignments[index] = { ...assignments[index], [field]: value };
      }
      return { ...prev, [foodId]: assignments };
    });
  };

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
              <div key={index}>
                <div>
                  {item.name} - {item.quantity} units
                </div>
                {(tempAssignments[item.id] || []).map((assignment, idx) => (
                  <div key={idx}>
                    <select
                      value={assignment.supplierId}
                      onChange={(e) =>
                        handleAssignmentChange(
                          item.id,
                          idx,
                          "supplierId",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select a supplier</option>
                      {supplierData.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={assignment.amountCooked}
                      placeholder="Amount"
                      min="0"
                      onChange={(e) =>
                        handleAssignmentChange(
                          item.id,
                          idx,
                          "amountCooked",
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
                <button onClick={() => addSupplierSelection(item.id)}>+</button>
              </div>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      {/* Button to submit assignments */}
      <button onClick={submitAssignments}>Submit Assignments</button>
    </div>
  );
};

export default TotalOrderFood;
