import React, { useEffect, useState } from "react";
import PackageAPI from "../../../../services/PackageAPI";
import Modal from "react-modal";
import SupplierFoodAssigmentStatus from "../../../../components/Status/SupplierFoodAssigmentStatus";

const PackageList = () => {
  const [packageList, setPackageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchOrderList = async () => {
      setIsLoading(true);
      try {
        const result = await PackageAPI.getPackage(); // Giả định lấy data thành công
        setPackageList(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderList();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const openModal = (packageDetails) => {
    console.log("package", packageDetails);
    setSelectedPackageDetails(packageDetails);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };
  const MealStatus = (meal) => {
    switch (meal) {
      case "Bữa Sáng":
        return "text-lime-500 hover:text-lime-700";
      case "Bữa Trưa":
        return "text-yellow-500 hover:text-yellow-700";
      case "Bữa Tối":
        return "text-violet-500 hover:text-violet-700";
      default:
        return "text-gray-500 hover:text-gray-700";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-semibold mb-4">Tổng hợp đơn hàng</h4>
      <div className="bg-white rounded-xl p-4">
        <div>
          <table className="w-full table-dailyoder">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5">Ngày giao hàng</th>
                <th className="py-2.5">Tên công ty</th>
                <th className="py-2.5">Bữa ăn</th>
                <th className="py-2.5 text-center">
                  Số lượng món được phân bổ
                </th>
                <th className="py-2.5 text-center">Số lượng món thiếu</th>
                <th className="py-2.5 text-center">Số lượng món hoàn thành</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="text-center py-3 px-3">
                    Đang tải...
                  </td>
                </tr>
              ) : (
                packageList.map((packageItem, index) =>
                  packageItem.companyForPackages.flatMap(
                    (company, companyIndex) =>
                      company.mealForCompanies.map((meal, mealIndex) => (
                        <tr key={`${index}-${companyIndex}-${mealIndex}`}>
                          {mealIndex === 0 && companyIndex === 0 ? (
                            <td
                              rowSpan={packageItem.companyForPackages.reduce(
                                (total, comp) =>
                                  total + comp.mealForCompanies.length,
                                0
                              )}
                            >
                              {formatDate(packageItem.bookingDate)}
                            </td>
                          ) : null}
                          {mealIndex === 0 ? (
                            <td
                              className="font-bold"
                              rowSpan={company.mealForCompanies.length}
                            >
                              {company.companyName}
                            </td>
                          ) : null}
                          <td>
                            <button
                              className={`${MealStatus(
                                meal.mealType
                              )} font-semibold`}
                              onClick={() => openModal(meal.packageForMeals)}
                            >
                              {meal.mealType}
                            </button>
                          </td>
                          <td className="text-center">
                            {meal.packageForMeals[0].totalFoodAssignQuantity}
                          </td>
                          <td className="text-center">
                            {meal.packageForMeals[0].missingQuantity}
                          </td>
                          <td className="text-center">
                            {meal.packageForMeals[0].successfulQuantity}
                          </td>
                        </tr>
                      ))
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Order Details"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            minWidth: "75%",
            maxWidth: "60%", // You can adjust the width as needed
            maxHeight: "80vh", // You can adjust the height as needed
            overflow: "auto",
            borderRadius: "12px",
          },
        }}
      >
        <div className="px-4 py-1 ">
          {selectedPackageDetails.length > 0 && (
            <>
              <h2 className="mb-2 font-bold text-lg text-gray-600">
                Chi tiết đơn hàng
              </h2>
              <div className="mb-2.5">
                <h2 className="mb-2 font-semibold text-gray-600">
                  Số lượng món ăn được phân bổ:{" "}
                  {selectedPackageDetails[0].totalFoodAssignQuantity}
                </h2>
                <h2 className="mb-2 font-semibold text-gray-600">
                  Số lượng món ăn thiếu:{" "}
                  {selectedPackageDetails[0].missingQuantity}
                </h2>
                <h2 className="mb-2 font-semibold text-gray-600">
                  Số lượng món ăn hoàn thành:{" "}
                  {selectedPackageDetails[0].successfulQuantity}
                </h2>
              </div>

              <table className="bg-slate-100 w-full table-auto mb-3">
                <thead>
                  <tr>
                    <th>Tên món ăn</th>
                    <th>Số lượng</th>
                    <th className="w-56 whitespace-nowrap">Nhà cung cấp</th>
                    <th>Thời gian hoàn thành</th>
                    <th>Trạng thái</th>
                    {/* Add additional headers like unitPrice and image if needed */}
                  </tr>
                </thead>
                <tbody>
                  {selectedPackageDetails[0].foodAssignmentForPackages.map(
                    (detail, index) => (
                      <tr key={index}>
                        <td>{detail.foodName}</td>
                        <td>{detail.amountCooked}</td>
                        <td className="w-56 whitespace-nowrap break-words">
                          {detail.supplierName}
                        </td>
                        <td>{formatDateTime(detail.deliveryDeadline)}</td>
                        <td>
                          {" "}
                          <SupplierFoodAssigmentStatus status={detail.status} />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </>
          )}
          <div className="justify-end flex">
            <button className="btn-cancel" onClick={closeModal}>
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PackageList;
