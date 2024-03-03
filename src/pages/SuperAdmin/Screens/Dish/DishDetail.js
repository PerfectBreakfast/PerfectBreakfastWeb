import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dishAPI from "../../../../services/dishAPI";

import "../Table/Table.css";
import "../Dish/Dish.css";
import Loading from "../../../Loading/Loading";

const DishDetail = () => {
  const { id } = useParams();
  const [dishData, setDishData] = useState(null);

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        const data = await dishAPI.getDishById(id);
        setDishData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchDishData();
  }, [id]);

  if (!dishData) {
    return (
      <div className="mt-6 w-5/6 mx-auto">
        <div className="animate-pulse">
          <div className="text-2xl font-bold mb-6 text-left bg-gray-300 h-6 rounded-md"></div>
          <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
            <div className="p-6">
              <div className="flex flex-wrap -mx-3 justify-center">
                <div className="px-3 w-full lg:w-1/2">
                  <div className="aspect-w-1 aspect-h-1 w-full mx-auto rounded-lg overflow-hidden">
                    <div className="w-96 h-80 bg-gray-300 object-center object-cover rounded-2xl"></div>
                  </div>
                </div>
                <div className="px-3 w-full lg:w-1/2">
                  <div className="mb-6 space-y-3">
                    <div className="h-4 bg-gray-300 rounded-md w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded-md w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-2/4"></div>
                  </div>
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
      <div className="text-2xl font-bold mb-6 text-left ">Chi tiết món ăn</div>
      <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
        <div className="p-6">
          <div className="flex flex-wrap -mx-3 justify-center">
            <div className="px-3 w-full lg:w-1/2">
              <div className="aspect-w-1 aspect-h-1 w-full mx-auto rounded-lg overflow-hidden">
                <img
                  src={dishData.image}
                  alt={dishData.name}
                  className="w-96 h-80 object-center object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="px-3 w-full lg:w-1/2">
              <div className="mb-6">
                <div className="text-lg text-gray-500 mb-1">
                  Danh mục:{" "}
                  <span className="text-gray-700 font-semibold ">
                    {dishData.categoryResponse.name}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-2">{dishData.name}</div>

                <div className="text-lg text-gray-700">
                  Giá:{" "}
                  <span className="font-semibold">
                    {dishData.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetail;
