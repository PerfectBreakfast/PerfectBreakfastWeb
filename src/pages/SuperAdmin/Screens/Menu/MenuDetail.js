import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import menuAPI from "../../../../services/menuAPI";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import Modal from "react-modal";

const MenuDetail = () => {
  const { id } = useParams();
  const [menuDetail, setMenuDetail] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuDetail();
  }, [id]);
  const fetchMenuDetail = async () => {
    try {
      const data = await menuAPI.getMenuById(id);
      setMenuDetail(data);
    } catch (error) {
      console.error("Failed to fetch menu details:", error);
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleEnableMenu = async () => {
    if (id) {
      setIsLoading(true);
      closeModal();
      try {
        await menuAPI.updateMenuVisibility(id);
        toast.success("Menu đã được cập nhật!");
        fetchMenuDetail();
      } catch (error) {
        console.error("Error update menu:", error);
        toast.error("Có lỗi xảy ra khi cập nhật menu");
      }
      setIsLoading(false);
    }
  };
  const handleDetailClick = (comboId) => {
    navigate(`/admin/combo/${comboId}`);
  };
  const handleFoodDetailClick = (foodId) => {
    navigate(`/admin/food/${foodId}`);
  };

  if (!menuDetail)
    return (
      <div class="mt-6 w-5/6 mx-auto animate-pulse">
        <div class="text-2xl font-bold mb-1 text-left"> </div>
        <div class="bg-white shadow-xl overflow-hidden sm:rounded-lg">
          <div class="p-6">
            <div class="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>

            <div class="mt-4 bg-gray-300 h-8 w-24 rounded"></div>
          </div>
        </div>
        <p class="text-xl font-semibold text-gray-600 text-left mt-4"></p>
        <div class="overflow-x-auto max-h-96 mt-2">
          <table class="min-w-max w-full table-auto mb-4">
            <thead class="bg-gray-200 sticky top-0">
              <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th class="py-2.5 px-3"> </th>
                <th class="py-2.5 px-3"> </th>
                <th class="py-2.5 px-3"> </th>
                <th class="py-2.5 px-3"> </th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              <tr class="border-b">
                <td class="py-2.5 px-3">
                  <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                </td>
                <td class="py-2.5 px-3">
                  <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                </td>
                <td class="py-2.5 px-3">
                  <div class="h-4 bg-gray-300 rounded w-1/2"></div>
                </td>
                <td class="py-2.5 px-3">
                  <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="text-2xl font-bold mb-4">Chi tiết menu</div>
        <div className="bg-white rounded-xl overflow-hidden sm:rounded-lg mb-4">
          <div className="p-6">
            <h2 className="text-lg font-semibold">{menuDetail.name}</h2>
            <p className="">
              Ngày tạo:{" "}
              <span className="text-gray-600 font-semibold">
                {new Date(menuDetail.creationDate).toLocaleDateString()}
              </span>
            </p>
            <p className="">
              Trạng thái menu:{" "}
              <span
                className={`${
                  menuDetail.isSelected ? "text-green-500" : "text-red-500"
                } font-semibold`}
              >
                {menuDetail.isSelected ? "Được hiển thị" : "Ẩn"}
              </span>
            </p>

            {!menuDetail.isSelected && (
              <button onClick={() => openModal()} className="btn-open">
                Hiện menu
              </button>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 mb-4">
          {" "}
          <p className="text-xl font-semibold text-gray-600 text-left">
            Danh sách combo
          </p>
          <div className="overflow-x-auto max-h-96 mt-2">
            <table className="w-full table-auto mb-4">
              <thead className="sticky top-0">
                <tr className="bg-gray-200 text-gray-800 leading-normal">
                  <th className="py-2.5 px-3 w-1/5">Hình ảnh</th>
                  <th className="py-2.5 px-3 text-left w-2/5">Tên combo</th>
                  <th className="py-2.5 px-3 w-1/5">Món ăn</th>
                  <th className="py-2.5 px-3 text-right w-1/5">Đơn giá</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {menuDetail && menuDetail.comboFoodResponses.length > 0 ? (
                  menuDetail.comboFoodResponses.map((combo) => (
                    <tr key={combo.id} className="border-b">
                      <td className="py-2.5 px-3 text-left">
                        <img
                          src={combo.image}
                          alt={combo.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-left">
                        {" "}
                        <span
                          className="font-medium cursor-pointer hover:text-green-500"
                          onClick={() => handleDetailClick(combo.id)}
                        >
                          {combo.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-left">{combo.foods}</td>
                      <td className="py-2.5 px-3 text-right">
                        {combo.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
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

        <div className="bg-white rounded-xl p-4 ">
          <p className="text-xl font-semibold text-gray-600 text-left">
            Danh sách món ăn
          </p>
          <div className="overflow-x-auto max-h-96 mt-2">
            <table className="w-full table-auto mb-4">
              <thead className="sticky top-0">
                <tr className="bg-gray-200 text-gray-800 leading-normal">
                  {" "}
                  <th className="py-2.5 px-3 w-1/5">Hình ảnh</th>
                  <th className="py-2.5 px-3 text-left w-3/5">Tên món ăn</th>
                  <th className="py-2.5 px-3 text-right w-1/5">Đơn giá</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {menuDetail && menuDetail.foodResponses.length > 0 ? (
                  menuDetail.foodResponses.map((food) => (
                    <tr key={food.id} className="border-b">
                      <td className="py-2.5 px-3 text-left">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-left">
                        {" "}
                        <span
                          className="font-medium cursor-pointer hover:text-green-500"
                          onClick={() => handleFoodDetailClick(food.id)}
                        >
                          {food.name}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        {food.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
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

      {isLoading && <Loading />}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn hiện menu này?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
              onClick={() => handleEnableMenu()}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default MenuDetail;
