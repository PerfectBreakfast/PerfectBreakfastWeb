import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";

const DeliveryDetail = () => {
  const { id } = useParams();
  const [deliveryData, setDeliveryData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const data = await deliveryUnitAPI.getDeliveryById(id);
        setDeliveryData(data);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    };

    fetchDeliveryData();
  }, [id]);

  if (!deliveryData) {
    return (
      <div className="mt-6 w-5/6 mx-auto animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
          <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>

          <div className="h-6 bg-gray-300 rounded-md w-1/2"></div>
          <div className="overflow-x-auto mt-2">
            <div className="w-full mb-4">
              <div className="bg-gray-200 rounded-t-lg h-6 w-full"></div>
              <div className="space-y-2 pt-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between space-x-4 p-2">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const handleDetailClick = (companyId) => {
    navigate(`/admin/company/${companyId}`);
  };
  return (
    <div className="mt-6 w-5/6 mx-auto">
      <div className="text-2xl font-bold mb-1 text-left">
        Chi tiết đơn vị vận chuyển
      </div>
      <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
        <div className="p-6">
          <div className="text-xl font-semibold mb-1 text-left">
            {deliveryData.name}
          </div>
          <p className="">
            Địa chỉ: <strong>{deliveryData.address}</strong>
          </p>
          <p className="">
            Số điện thoại: <strong>{deliveryData.phoneNumber}</strong>
          </p>
          <p className="">
            Tỷ lệ doanh thu: <strong>{deliveryData.commissionRate}%</strong>
          </p>
          <p className="">
            Số lượng nhân viên: <strong>{deliveryData.memberCount}</strong>
          </p>
        </div>
      </div>

      <div className="text-xl font-semibold text-gray-600 text-left mt-4">
        Danh sách công ty
      </div>
      <div className="overflow-x-auto max-h-96 mt-2">
        <table className="w-full table-auto mb-4">
          <thead className="bg-gray-200 sticky top-0">
            <tr className="text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">Tên công ty</th>
              <th className="py-3 px-6">Địa chỉ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {deliveryData.assignedCompanies.map((company) => (
              <tr key={company.id} className="border-b">
                <td className="py-3 px-6 text-left">
                  {" "}
                  <span
                    className="font-medium cursor-pointer hover:text-green-500"
                    onClick={() => handleDetailClick(company.id)}
                  >
                    {company.name}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{company.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryDetail;
