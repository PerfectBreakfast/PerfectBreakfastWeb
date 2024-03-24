import React, { useEffect, useState } from "react";
import dishAPI from "../../../../services/dishAPI";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";
import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Loading from "../../../Loading/Loading";

const SupplierFoodAssigment = () => {
  const { dailyOrderId } = useParams();
  const [orderFoodData, setOrderFoodData] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [tempAssignments, setTempAssignments] = useState({});
  const [errorMessages, setErrorMessages] = useState({});

  console.log("test id", dailyOrderId);

  // useEffect(() => {
  //   const fetchOrderFoodData = async () => {
  //     try {
  //       const data = await dishAPI.getDailyOrderDetailById(dailyOrderId);
  //       setOrderFoodData(data);
  //     } catch (error) {
  //       console.error("Error fetching dish data:", error);
  //     }
  //   };

  //   const fetchSupplier = async () => {
  //     try {
  //       const data = await supplierUnitAPI.getsAllSupplierByPartner();
  //       setSupplierData(data);
  //     } catch (error) {
  //       console.error("Error fetching supplier data:", error);
  //     }
  //   };

  //   fetchSupplier();
  //   fetchOrderFoodData();
  // }, []);
  // console.log("supplier", supplierData);

  useEffect(() => {
    const fetchOrderFoodData = async () => {
      try {
        const data = await dishAPI.getDailyOrderDetailById(dailyOrderId);
        setOrderFoodData(data);
        fetchSuppliersForFoods(data.totalFoodResponses); // Gọi hàm mới để fetch suppliers dựa trên foods
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchOrderFoodData();
  }, []);

  const fetchSuppliersForFoods = async (foods) => {
    const supplierDataByFoodId = {};
    await Promise.all(
      foods.map(async (food) => {
        try {
          const data = await supplierUnitAPI.fetchSuppliersForFood(food.id); // Giả định rằng API đã được cập nhật để nhận foodId
          supplierDataByFoodId[food.id] = data;
        } catch (error) {
          console.error(`Error fetching suppliers for food ${food.id}:`, error);
        }
      })
    );
    setSupplierData(supplierDataByFoodId);
  };

  const submitAssignments = async () => {
    // Kiểm tra xem tất cả các nhà cung cấp đã được chọn
    const allSuppliersSelected = Object.values(tempAssignments).every(
      (assignments) => assignments.every((assignment) => assignment.supplierId)
    );

    if (!allSuppliersSelected) {
      // Nếu tìm thấy assignment nào chưa chọn nhà cung cấp, hiển thị thông báo lỗi và ngăn submit
      toast.error("Vui lòng chọn nhà cung cấp cho tất cả các món ăn.");
      return; // Dừng xử lý submit
    }

    // Biến đổi assignments hiện tại thành dạng đối tượng mới
    const assignmentsToSubmit = {
      dailyOrderId: dailyOrderId, // Thêm trường này từ useParams
      supplierFoodAssignmentRequest: Object.entries(tempAssignments).flatMap(
        ([foodId, assignments]) =>
          assignments.map((assignment) => ({
            ...assignment,
            foodId,
          }))
      ),
    };
    console.log("api", assignmentsToSubmit);
    try {
      // Gửi đối tượng mới đến API
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
      const totalAssigned = assignments.reduce((acc, cur, curIndex) => {
        // Tính tổng không bao gồm phần tử hiện tại đang được cập nhật
        return curIndex !== index ? acc + Number(cur.amountCooked) : acc;
      }, 0);

      const maxAllowed =
        orderFoodData.totalFoodResponses.find((item) => item.id === foodId)
          ?.quantity - totalAssigned;

      if (field === "amountCooked") {
        // Đảm bảo giá trị nhập không làm tổng số lượng vượt quá số lượng còn lại
        if (Number(value) > maxAllowed) {
          // toast.error(
          //   `Số lượng phân món không được vượt quá số lượng còn lại!`,
          //   { toastId: "max-quantity-error" }
          // );

          setErrorMessages({
            ...errorMessages,
            [foodId]: `Số lượng phân món không được vượt quá ${maxAllowed}.`,
          });
          return prev; // Dừng và giữ nguyên trạng thái hiện tại nếu số lượng vượt quá
        } else {
          // Nếu không vượt quá, xóa thông báo lỗi nếu có
          const newErrorMessages = { ...errorMessages };
          delete newErrorMessages[foodId];
          setErrorMessages(newErrorMessages);
        }
      }

      // Cập nhật giá trị nếu hợp lệ
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
  if (!orderFoodData) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 pt-2 pb-8">
      <h2 className="text-2xl font-bold mt-3 mb-2 text-gray-800">
        Phân phối món ăn
      </h2>
      {orderFoodData ? (
        <div className="overflow-x-auto">
          {orderFoodData.totalFoodResponses.map((item, index) => (
            <div key={index} className="p-4 bg-white shadow rounded-lg mb-6">
              <div className="mb-4">
                <span className="text-base font-normal text-gray-700">
                  Tên món ăn:
                  <span className="text-base font-medium text-gray-700">
                    {" "}
                    {item.name} |
                  </span>
                </span>
                <span className="text-base font-normal ml-4 text-gray-700">
                  Số lượng:
                  <span className="text-base font-medium text-gray-700">
                    {" "}
                    {item.quantity} món |
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
                    {/* <select
                      className="input-form"
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
                      {supplierData[item.id] &&
                        supplierData[item.id].map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                    </select> */}
                    <select
                      className="input-form"
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
                      {supplierData[item.id] &&
                      supplierData[item.id].length > 0 ? (
                        supplierData[item.id].map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Không có nhà cung cấp tương ứng
                        </option>
                      )}
                    </select>

                    <input
                      type="number"
                      className="number-input-form "
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
                      className="text-white bg-red-600 hover:bg-red-800 font-medium p-2 px-3 rounded-full shadow"
                    >
                      -
                    </button>
                  </div>
                ))}
                {errorMessages[item.id] && (
                  <p className="formik-error-message">
                    {errorMessages[item.id]}
                  </p>
                )}
                {totalAmountCooked(item.id) < item.quantity && (
                  <button
                    onClick={() => addSupplierSelection(item.id)}
                    className="self-start bg-green-500 hover:bg-green-800 text-white font-medium p-2 px-3 rounded-full shadow"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ClipLoader />
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

export default SupplierFoodAssigment;
