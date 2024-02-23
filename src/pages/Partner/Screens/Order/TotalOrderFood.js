import React, { useEffect, useState } from "react";
import dishAPI from "../../../../services/dishAPI";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";
import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";
import { ToastContainer, toast } from "react-toastify";

const TotalOrderFood = () => {
  const [orderFoodData, setOrderFoodData] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
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
        console.error("Error fetching supplier data:", error);
      }
    };

    fetchSupplier();
    fetchOrderFoodData();
  }, []);

  const submitAssignments = async () => {
    const assignmentsToSubmit = Object.entries(tempAssignments).flatMap(
      ([foodId, assignments]) =>
        assignments.map((assignment) => ({
          ...assignment,
          foodId,
        }))
    );

    try {
      await SupplierFoodAssignmentAPI.FoodAssigment(assignmentsToSubmit);
      toast.success("Assignments submitted successfully!");
    } catch (error) {
      toast.error(error.errors);
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

  const removeSupplierSelection = (foodId, index) => {
    setTempAssignments((prev) => {
      const assignments = [...(prev[foodId] || [])];
      assignments.splice(index, 1); // Remove the assignment at the specified index
      return { ...prev, [foodId]: assignments };
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

  const totalAmountCooked = (foodId) => {
    return (tempAssignments[foodId] || []).reduce(
      (total, assignment) => total + Number(assignment.amountCooked),
      0
    );
  };

  return (
    <div className="container mx-auto px-4 pt-2 pb-8">
      <h2 className="text-2xl font-bold my-4 text-gray-800">
        Phân phối món ăn
      </h2>
      {orderFoodData ? (
        <div className="overflow-x-auto">
          {orderFoodData.map((item, index) => (
            <div key={index} className="p-4 bg-white shadow rounded-lg mb-6">
              <div className="mb-4">
                <span className="text-base font-normal text-gray-700">
                  Tên món ăn:
                  <span className="text-base font-medium text-gray-700">
                    {" "}
                    {item.name}{" "}
                  </span>
                </span>
                <span className="text-base font-normal ml-4 text-gray-700">
                  Số lượng:
                  <span className="text-base font-medium text-gray-700">
                    {" "}
                    {item.quantity} món
                  </span>
                </span>
                <span className="text-base font-normal ml-4 text-gray-700">
                  Số lượng còn lại:
                  <span className="text-base font-medium text-gray-700">
                    {" "}
                    {item.quantity - totalAmountCooked(item.id)} món
                  </span>
                </span>
              </div>
              <div className="flex flex-col space-y-4">
                {(tempAssignments[item.id] || []).map((assignment, idx) => (
                  <div
                    key={idx}
                    className="flex flex-row items-center space-x-4"
                  >
                    <select
                      className="form-select block w-full mt-1 rounded-md border-gray-300 shadow focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                      <option value="">Chọn nhà cung cấp</option>
                      {supplierData &&
                        supplierData.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      className="form-input block w-full md:w-40 py-1 mt-1 rounded-md border-gray-300 shadow focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                    <button
                      onClick={() => removeSupplierSelection(item.id, idx)}
                      className="text-white bg-red-600 hover:bg-red-800 font-medium py-1 px-4 rounded shadow"
                    >
                      -
                    </button>
                  </div>
                ))}
                {totalAmountCooked(item.id) < item.quantity && (
                  <button
                    onClick={() => addSupplierSelection(item.id)}
                    className="self-start bg-blue-600 hover:bg-blue-800 text-white font-medium py-1 px-4 rounded shadow"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Loading...</p>
      )}
      <div className="mt-6">
        <button
          onClick={submitAssignments}
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded shadow"
        >
          Phân phối
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TotalOrderFood;
