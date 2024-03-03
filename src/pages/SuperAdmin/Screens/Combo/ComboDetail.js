import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import comboAPI from "../../../../services/comboAPI";

const ComboDetail = () => {
  const { id } = useParams();
  const [comboData, setComboData] = useState(null);

  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const data = await comboAPI.getComboById(id);
        setComboData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchComboData();
  }, [id]);
  if (!comboData) {
    return (
      <div className="mt-6 w-5/6 mx-auto">
        <div className="text-2xl font-semibold mb-4">Chi tiết Combo</div>
        <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
          <div className="p-6">
            <div className="flex flex-wrap -mx-3 justify-center">
              {/* Skeleton Image Section */}
              <div className="px-3 w-full lg:w-1/2 animate-pulse">
                <div className="aspect-w-1 aspect-h-1 w-full mx-auto rounded-lg overflow-hidden">
                  <div className="w-96 h-80 bg-gray-300 rounded-2xl"></div>
                </div>
              </div>
              {/* Skeleton Details Section */}
              <div className="px-2 w-full md:w-1/2">
                <div>
                  <div className="h-8 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 w-5/6 mx-auto">
      <div className="text-2xl font-semibold mb-4">Chi tiết Combo</div>
      <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
        <div className="p-6">
          <div className="flex flex-wrap -mx-3 justify-center">
            {/* Image Section */}
            <div className="px-3 w-full lg:w-1/2">
              <div className="aspect-w-1 aspect-h-1 w-full mx-auto rounded-lg overflow-hidden">
                <img
                  src={comboData.image}
                  alt={comboData.name}
                  className="w-96 h-80 object-center object-cover rounded-2xl"
                />
              </div>
            </div>
            {/* Details Section */}
            <div className="px-2 w-full md:w-1/2">
              <div>
                <div className="text-3xl font-bold mb-2">{comboData.name}</div>
                <div className=" text-base text-gray-600 mb-2">
                  Món ăn:{" "}
                  <span className="mb-2 font-semibold">{comboData.foods}</span>
                </div>{" "}
                <div className=" text-base text-gray-600 mb-2">
                  Đơn giá:{" "}
                  <span className="mb-2 font-semibold">
                    {comboData.comboPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>{" "}
                <div className=" text-base text-gray-600 mb-2">
                  Mô tả:{" "}
                  <span className="mb-2 font-semibold">
                    {comboData.content}
                  </span>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboDetail;
