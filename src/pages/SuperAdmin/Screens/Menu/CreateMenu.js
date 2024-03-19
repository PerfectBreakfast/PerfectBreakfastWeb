import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import comboAPI from "../../../../services/comboAPI";
import menuAPI from "../../../../services/menuAPI";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";
import dishAPI from "../../../../services/dishAPI";

const CreateMenu = () => {
  const [combos, setCombos] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const comboData = await comboAPI.getAllCombo();
        setCombos(comboData);
      } catch (error) {
        toast.error("Failed to fetch combo data.");
      }
    };
    const fetchFoodData = async () => {
      try {
        const data = await dishAPI.getFoodForMenu();
        setFoodData(data);
      } catch (error) {
        toast.error("Failed to fetch food data.");
      }
    };
    fetchData();
    fetchFoodData();
  }, []);

  const formik = useFormik({
    initialValues: {
      menuName: "",
      selectedCombos: [],
      selectedFoods: [], // Add this line
    },
    validationSchema: Yup.object({
      menuName: Yup.string().required("Tên menu là bắt buộc"),
      // selectedCombos: Yup.array().min(1, "Phải có ít nhất 1 combo được chọn"),
      selectedCombos: Yup.array(),
      selectedFoods: Yup.array().test(
        "at-least-one-array",
        "Phải có ít nhất 1 combo hoặc món ăn được chọn",
        function (value) {
          return this.parent.selectedCombos.length > 0 || value.length > 0;
        }
      ),
    }),
    onSubmit: async (values) => {
      setIsOpen(false);
      setIsLoading(true);
      try {
        const menuData = {
          name: values.menuName,
          // menuFoodRequests: values.selectedCombos.map((comboId) => ({
          //   comboId,
          // })),
          menuFoodRequests: [
            ...values.selectedCombos.map((comboId) => ({ comboId })),
            ...values.selectedFoods.map((foodId) => ({ foodId })),
          ],
        };

        await menuAPI.createMenu(menuData);
        toast.success("Thêm mới menu thành công!");
        navigate(-1);
      } catch (error) {
        toast.error("Thêm mới menu thất bại!");
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  // const handleCheckboxChange = (comboId) => {
  //   const updatedCombos = formik.values.selectedCombos.includes(comboId)
  //     ? formik.values.selectedCombos.filter((id) => id !== comboId)
  //     : [...formik.values.selectedCombos, comboId];

  //   formik.setFieldValue("selectedCombos", updatedCombos);
  // };

  const handleCheckboxChange = (id, type) => {
    let updatedSelections;
    if (type === "combo") {
      updatedSelections = formik.values.selectedCombos.includes(id)
        ? formik.values.selectedCombos.filter((cid) => cid !== id)
        : [...formik.values.selectedCombos, id];
      formik.setFieldValue("selectedCombos", updatedSelections);
    } else if (type === "food") {
      updatedSelections = formik.values.selectedFoods.includes(id)
        ? formik.values.selectedFoods.filter((fid) => fid !== id)
        : [...formik.values.selectedFoods, id];
      formik.setFieldValue("selectedFoods", updatedSelections);
    }
  };

  const handleCreateClick = async () => {
    setHasSubmitted(true); // Add this line
    formik.setTouched({
      menuName: true,
      selectedCombos: true,
      selectedFoods: true, // Ensure this field is also marked as touched
    });

    const errors = await formik.validateForm();
    formik.setErrors(errors);

    if (Object.keys(errors).length === 0) {
      openModal();
    }
  };
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl w-5/6">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold mb-2">Tạo mới menu</h2>
          <div>
            <label className="label-input" htmlFor="menuName">
              Tên menu
            </label>
            <input
              id="menuName"
              name="menuName"
              type="text"
              placeholder="Nhập tên menu"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.menuName}
              className="input-form"
            />
            {formik.touched.menuName && formik.errors.menuName && (
              <p className="formik-error-message ">{formik.errors.menuName}</p>
            )}
          </div>

          {/* <div>
            <label className="label-input">Lựa chọn combo</label>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200 sticky top-0 ">
                  <tr>
                    <th className="px-4 py-2">Tên combo</th>
                    <th className="px-4 py-2">Món ăn</th>
                    <th className="px-4 py-2">Mô tả</th>
                    <th className="px-4 py-2">Đơn giá</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {combos.map((combo) => (
                    <tr key={combo.id} className="border-b">
                      <td className="px-4 py-2">{combo.name}</td>
                      <td className="px-4 py-2">{combo.foods}</td>
                      <td className="px-4 py-2">{combo.content}</td>
                      <td className="px-4 py-2">
                        {combo.comboPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={formik.values.selectedCombos.includes(
                            combo.id
                          )}
                          onChange={() => handleCheckboxChange(combo.id)}
                          className="form-checkbox h-5 w-5 text-green-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {formik.touched.selectedCombos && formik.errors.selectedCombos && (
              <p className="formik-error-message ">
                {formik.errors.selectedCombos}
              </p>
            )}
          </div> */}

          {/* món ăn */}
          {/* <div>
            <label className="label-input">Chọn món ăn</label>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Tên món ăn</th>
                    <th className="px-4 py-2">Mô tả</th>
                    <th className="px-4 py-2">Đơn giá</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {foodData.map((food) => (
                    <tr key={food.id} className="border-b">
                      <td className="px-4 py-2">{food.name}</td>
                      <td className="px-4 py-2">{food.description}</td>
                      <td className="px-4 py-2">
                        {food.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={formik.values.selectedFoods.includes(
                            food.id
                          )}
                          onChange={() => handleCheckboxChange(food.id, "food")}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}
          {/* Combo Display Section */}
          {combos && combos.length > 0 ? (
            <div className="mb-3">
              <label className="label-input ">
                <span className="font-bold">Chọn combo </span>
              </label>
              <div className="overflow-x-auto max-h-48">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-2">Tên combo</th>
                      <th className="px-4 py-2">Món ăn</th>
                      <th className="px-4 py-2">Mô tả</th>
                      <th className="px-4 py-2">Đơn giá</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {combos.map((combo) => (
                      <tr key={combo.id} className="border-b">
                        <td className="px-4 py-2">{combo.name}</td>
                        <td className="px-4 py-2">{combo.foods}</td>
                        <td className="px-4 py-2">{combo.description}</td>
                        <td className="px-4 py-2">
                          {combo.comboPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={formik.values.selectedCombos.includes(
                              combo.id
                            )}
                            onChange={() =>
                              handleCheckboxChange(combo.id, "combo")
                            }
                            className="form-checkbox h-5 w-5 text-green-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>Đang tải</p>
          )}

          {/* Dish Display Section */}
          {foodData && foodData.length > 0 ? (
            <div>
              <label className="label-input ">
                <span className="font-bold">Chọn món ăn </span>
              </label>
              <div className="overflow-x-auto max-h-48">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-2">Tên món ăn</th>

                      <th className="px-4 py-2">Đơn giá</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodData.map((food) => (
                      <tr key={food.id} className="border-b">
                        <td className="px-4 py-2">{food.name}</td>

                        <td className="px-4 py-2">
                          {food.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={formik.values.selectedFoods.includes(
                              food.id
                            )}
                            onChange={() =>
                              handleCheckboxChange(food.id, "food")
                            }
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>Đang tải</p>
          )}
          {/* After the sections for combos and dishes */}
          {hasSubmitted && formik.errors.selectedFoods && (
            <p className="formik-error-message">
              {formik.errors.selectedFoods}
            </p>
          )}

          {/* Submit Button */}

          <button
            type="button"
            className="btn-submit-form mt-2"
            onClick={handleCreateClick}
          >
            Tạo mới
          </button>
        </div>
      </form>
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
          <p>Bạn có chắc chắn muốn tạo mới menu này?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
              onClick={() => formik.handleSubmit()}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default CreateMenu;
