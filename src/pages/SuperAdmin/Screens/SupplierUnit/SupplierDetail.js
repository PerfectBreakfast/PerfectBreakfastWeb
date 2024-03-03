import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";

const SupplierDetail = () => {
  const { id } = useParams();
  const [supplierData, setSupplierData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const data = await supplierUnitAPI.getSupplierById(id);
        setSupplierData(data);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    };

    fetchSupplierData();
  }, [id]);
  const handleDetailClick = (partnerId) => {
    navigate(`/admin/partner/${partnerId}`);
  };
  return (
    <>
      {supplierData ? (
        <div className="mt-6 w-5/6 mx-auto">
          <div className="text-2xl font-bold mb-1 text-left">
            Chi tiết nhà cung cấp
          </div>
          <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
            <div className="p-6">
              <p className="">
                Tên nhà cung cấp: <strong>{supplierData.name}</strong>
              </p>
              <p className="">
                Địa chỉ: <strong>{supplierData.address}</strong>
              </p>
              <p className="">
                Số điện thoại: <strong>{supplierData.phoneNumber}</strong>
              </p>
            </div>
          </div>

          <div className="text-xl font-semibold text-gray-600 text-left mt-4">
            Danh sách đơn vị quản lý
          </div>
          <div class="overflow-x-auto max-h-96 mt-2">
            <table className="w-full table-auto mb-4">
              <thead className="bg-gray-200 sticky top-0">
                <tr className="text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 w-2/5">Tên đơn vị</th>
                  <th className="py-3 px-6 w-2/5">Địa chỉ</th>
                  <th className="py-3 px-6 w-1/5">Số điện thoại</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {supplierData.managementUnitDtos.map((unit) => (
                  <tr key={unit.id} className="border-b">
                    <td className="py-3 px-6 text-left">
                      {" "}
                      <span
                        className="font-medium cursor-pointer hover:text-green-500"
                        onClick={() => handleDetailClick(unit.id)}
                      >
                        {unit.name}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{unit.address}</td>
                    <td className="py-3 px-6 text-left">{unit.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 w-5/6 mx-auto animate-pulse">
          <div className="text-2xl font-bold mb-1 text-left">
            <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
          </div>
          <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>

          <div className="text-xl font-semibold text-gray-600 text-left mt-4">
            <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
          </div>
          <div className="overflow-x-auto max-h-96 mt-2">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-3 px-6">
                    <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                  </th>
                  <th className="py-3 px-6">
                    <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                  </th>
                  <th className="py-3 px-6">
                    <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(2)].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-6">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default SupplierDetail;
