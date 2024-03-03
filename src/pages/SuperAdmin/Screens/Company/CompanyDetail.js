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
    return <div>Loading...</div>;
  }

  const handlePartnerClick = (partnerId) => {
    navigate(`/admin/partner/${partnerId}`);
  };
  const handleDeliveryClick = (deliveryId) => {
    navigate(`/admin/delivery/${deliveryId}`);
  };
  return (
    <div className="mt-6 w-5/6 mx-auto">
      <div className="text-2xl font-bold mb-1 text-left">Thông tin công ty</div>
      <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
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
            Số lượng tài khoản: <strong>{companyData.memberCount}</strong>
          </p>
        </div>
      </div>

      <div className="text-xl font-semibold text-gray-600 text-left mt-4">
        Đối tác
      </div>
      <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg mt-2 p-6">
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

      <div className="text-xl font-semibold text-gray-600 text-left mt-4">
        Đơn vị vận chuyển
      </div>
      <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg mt-2 p-6">
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

      <div className="text-xl font-semibold text-gray-600 text-left mt-4">
        Danh sách bữa ăn
      </div>
      <div className="overflow-x-auto mt-2">
        <table className="w-full table-auto mb-4">
          <thead className="bg-gray-200 sticky top-0">
            <tr className="text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">Mã món ăn</th>
              <th className="py-3 px-6">Loại món ăn</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {companyData.meals.map((meal) => (
              <tr key={meal.id} className="border-b">
                <td className="py-3 px-6 text-left">{meal.id}</td>
                <td className="py-3 px-6 text-left">{meal.mealType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyDetail;
