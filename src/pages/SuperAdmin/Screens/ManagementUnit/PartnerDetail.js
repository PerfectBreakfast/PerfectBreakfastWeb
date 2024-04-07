import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import managementUnitAPI from "../../../../services/managementUnitAPI";

const PartnerDetail = () => {
  const { id } = useParams();
  const [partnerData, setPartnerData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const data = await managementUnitAPI.getPartnerById(id);
        setPartnerData(data);
      } catch (error) {
        console.error("Error fetching partner data:", error);
      }
    };

    fetchPartnerData();
  }, [id]);
  const handleCompanyClick = (companyId) => {
    navigate(`/admin/company/${companyId}`);
  };
  const handleSupplierClick = (supplierId) => {
    navigate(`/admin/supplier/${supplierId}`);
  };
  return (
    <>
      {partnerData ? (
        <div className="container mx-auto p-4">
          <div className="text-2xl font-bold mb-4">Chi tiết đối tác</div>
          <div className="bg-white rounded-xl overflow-hidden sm:rounded-lg mb-4">
            <div className="p-6">
              <p className="">
                Tên đối tác: <strong>{partnerData.name}</strong>
              </p>
              <p className="">
                Địa chỉ: <strong>{partnerData.address}</strong>
              </p>
              <p className="">
                Số điện thoại: <strong>{partnerData.phoneNumber}</strong>
              </p>
              <p className="">
                Tỷ lệ doanh thu: <strong>{partnerData.commissionRate}%</strong>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 mb-4">
            <p className="text-xl font-semibold text-gray-600 text-left">
              Danh sách doanh nghiệp
            </p>
            <div className="overflow-x-auto max-h-96 mt-2">
              <table className="w-full table-auto mb-4">
                <thead className="sticky top-0">
                  <tr className="bg-gray-200 text-gray-800 leading-normal">
                    <th className="py-2.5 px-3 w-2/6">Tên công ty</th>
                    <th className="py-2.5 px-3 w-2/6 text-left">Địa chỉ</th>
                    <th className="py-2.5 px-3 w-1/6">Email</th>
                    <th className="py-2.5 px-3 w-1/6 text-right">
                      Số điện thoại
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {partnerData && partnerData.companies.length > 0 ? (
                    partnerData.companies.map((company) => (
                      <tr key={company.id} className="border-b">
                        <td className="py-2.5 px-3 text-left">
                          {" "}
                          <span
                            className="font-medium cursor-pointer hover:text-green-500"
                            onClick={() => handleCompanyClick(company.id)}
                          >
                            {company.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-left">
                          {company.address}
                        </td>
                        <td className="py-2.5 px-3 text-left">
                          {company.email}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {company.phoneNumber}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2.5 px-3 text-center" colSpan="4">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-4">
            <p className="text-xl font-semibold text-gray-600 text-left">
              Danh sách nhà cung cấp
            </p>
            <div className="overflow-x-auto max-h-96 mt-2">
              <table className="w-full table-auto mb-4">
                <thead className="sticky top-0">
                  <tr className="bg-gray-200 text-gray-800 leading-normal">
                    {" "}
                    <th className="py-2.5 px-3 w-2/6">Tên nhà cung cấp</th>
                    <th className="py-2.5 px-3 w-3/6 text-left">Địa chỉ</th>
                    <th className="py-2.5 px-3 w-1/6 text-center">
                      Số điện thoại
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {partnerData && partnerData.supplierDTO.length > 0 ? (
                    partnerData.supplierDTO.map((supplier) => (
                      <tr key={supplier.id} className="border-b">
                        <td className="py-2.5 px-3 text-left ">
                          {" "}
                          <span
                            className="font-medium cursor-pointer hover:text-green-500"
                            onClick={() => handleSupplierClick(supplier.id)}
                          >
                            {supplier.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-left">
                          {supplier.address}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {supplier.phoneNumber}
                        </td>
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
      ) : (
        <div className="mt-6 w-5/6 mx-auto animate-pulse">
          <div className="text-2xl font-bold mb-1 text-left">
            <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
          </div>
          <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>

          <div className="text-xl font-semibold text-gray-600 text-left mt-4">
            <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
          </div>
          <div className="overflow-x-auto max-h-96 mt-2">
            <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg p-6">
              <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4">
                    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xl font-semibold text-gray-600 text-left mt-2">
            <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
          </div>
          <div className="overflow-x-auto max-h-96 mt-2">
            <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg p-6">
              <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
                    <div className="h-4 bg-gray-300 rounded col-span-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PartnerDetail;
