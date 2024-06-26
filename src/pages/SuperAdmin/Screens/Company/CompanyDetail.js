import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import companyAPI from "../../../../services/companyAPI";

const CompanyDetail = () => {
  const { id } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await companyAPI.getCompanyById(id);
        setCompanyData(data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (!companyData) {
    return (
      <div className="mt-6 w-5/6 mx-auto animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/6"></div>
          </div>
        </div>

        <div className="text-xl font-semibold text-gray-600 text-left mt-8">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg mt-2 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/6"></div>
        </div>

        <div className="text-xl font-semibold text-gray-600 text-left mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg mt-2 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/6"></div>
        </div>

        <div className="text-xl font-semibold text-gray-600 text-left mt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="overflow-x-auto mt-2 animate-pulse">
          <table className="w-full">
            <thead>
              <tr>
                <th>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </th>
                <th>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </th>
                <th>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <div className="h-4 bg-gray-200 rounded mx-auto w-3/4"></div>
                  </td>
                  <td className="py-2">
                    <div className="h-4 bg-gray-200 rounded mx-auto w-3/4"></div>
                  </td>
                  <td className="py-2">
                    <div className="h-4 bg-gray-200 rounded mx-auto w-3/4"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const handlePartnerClick = (partnerId) => {
    navigate(`/admin/partner/${partnerId}`);
  };
  const handleDeliveryClick = (deliveryId) => {
    navigate(`/admin/delivery/${deliveryId}`);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="text-2xl font-bold mb-4">Thông tin công ty</div>
      <div className="bg-white rounded-xl overflow-hidden sm:rounded-lg mb-4">
        <div className="p-6">
          <p className="">
            Tên công ty: <strong>{companyData.name}</strong>
          </p>
          <p className="">
            Số điện thoại: <strong>{companyData.phoneNumber}</strong>
          </p>
          <p className="">
            Email: <strong>{companyData.email}</strong>
          </p>
          <p className="">
            Địa chỉ: <strong>{companyData.address}</strong>
          </p>
          <p className="">
            Số lượng tài khoản:{" "}
            <strong
              className="cursor-pointer hover:text-green-500"
              onClick={() => navigate(`user`)}
            >
              {companyData.memberCount}
            </strong>
          </p>
          <button onClick={() => navigate(`user`)} className="btn-open">
            Danh sách người dùng
          </button>
        </div>
      </div>

      <div className="text-lg font-semibold text-gray-600 text-left mt-4">
        Đối tác
      </div>
      <div className="bg-white rounded-xl overflow-hidden sm:rounded-lg mt-2 p-6">
        <p className="">
          Tên:{" "}
          <strong
            className="font-medium cursor-pointer hover:text-green-500"
            onClick={() => handlePartnerClick(companyData.partner.id)}
          >
            {companyData.partner.name}
          </strong>
        </p>
      </div>
      <div className="mb-4">
        <div className="text-lg font-semibold text-gray-600 text-left mt-4">
          Đơn vị vận chuyển
        </div>
        <div className="bg-white rounded-xl overflow-hidden sm:rounded-lg mt-2 p-6">
          <p className="">
            Tên:{" "}
            <strong
              className="font-medium cursor-pointer hover:text-green-500"
              onClick={() => handleDeliveryClick(companyData.delivery.id)}
            >
              {companyData.delivery.name}
            </strong>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <p className="text-xl font-semibold text-gray-600 text-left">
          Danh sách bữa ăn
        </p>
        <div className="overflow-x-auto max-h-96 mt-2">
          <table className="w-full table-auto mb-4">
            <thead className="sticky top-0">
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-3 px-6">Bữa ăn</th>
                <th className="py-3 px-6">Thời gian bắt đầu</th>
                <th className="py-3 px-6">Thời gian kết thúc</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {companyData && companyData.meals.length > 0 ? (
                companyData.meals.map((meal) => (
                  <tr key={meal.id} className="border-b">
                    <td className="py-3 px-6 text-left">{meal.mealType}</td>
                    <td className="py-3 px-6 text-left">{meal.startTime}</td>
                    <td className="py-3 px-6 text-left">{meal.endTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2.5 px-3 text-center" colSpan="3">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
