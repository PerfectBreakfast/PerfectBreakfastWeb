import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dishAPI from "../../../../services/dishAPI";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import SupplierCommissionRateAPI from "../../../../services/SupplierCommissionRateAPI";
import Loading from "../../../Loading/Loading";
import FoodStatusText from "../../../../components/Status/FoodStatus";

const FoodRegistration = () => {
  const { id } = useParams();
  const [foodData, setFoodData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, [id, searchTerm]);

  const handleSearch = async () => {
    setSearchTerm(searchInput);
  };

  const fetchData = async () => {
    try {
      const foodData = await dishAPI.getFoodRegistrationSupplier(
        id,
        searchTerm
      );
      setFoodData(foodData);
    } catch (error) {
      // toast.error("Failed to fetch data.");
    }
  };

  const formik = useFormik({
    initialValues: {
      commissionRate: "",
      selectedFoods: [],
    },
    validationSchema: Yup.object({
      commissionRate: Yup.string().required("Vui lòng nhập hoa hồng"),
      selectedFoods: Yup.array().min(1, "Vui lòng chọn ít nhất 1 món ăn"),
    }),
    onSubmit: async (values) => {
      setIsOpen(false);
      setIsLoading(true);
      try {
        const registrationData = {
          foodIds: values.selectedFoods,
          supplierId: id,
          commissionRate: parseFloat(values.commissionRate),
        };

        await SupplierCommissionRateAPI.foodRegistration(registrationData);
        toast.success("Đăng ký món ăn thành công!");
        navigate(-1);
      } catch (error) {
        toast.error("Đăng ký món ăn thất bại!");
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  const handleCheckboxChange = (foodId) => {
    const updatedFoods = formik.values.selectedFoods.includes(foodId)
      ? formik.values.selectedFoods.filter((id) => id !== foodId)
      : [...formik.values.selectedFoods, foodId];

    formik.setFieldValue("selectedFoods", updatedFoods);
  };

  const handleCreateClick = async () => {
    formik.setTouched({
      commissionRate: true,
      selectedFoods: true,
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
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl my-4 h-fit w-5/6">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-2xl font-semibold mb-3">Đăng ký món ăn</h2>
        {/* Name field */}
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              {" "}
              <label className="label-input">Lựa chọn món ăn</label>
              <div className="flex items-center">
                <input
                  type="text"
                  className="input-search "
                  placeholder="Tìm kiếm món ăn"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              {foodData.length > 0 ? (
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-200 sticky top-0 ">
                    <tr>
                      <th className="px-4 py-2">Tên món ăn</th>
                      <th className="px-4 py-2">Ghi chú</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodData.map((food) => (
                      <tr key={food.id} className="border-b">
                        <td className="px-4 py-2 font-semibold">{food.name}</td>
                        <td className="px-4 py-2">
                          {" "}
                          <FoodStatusText status={food.foodStatus} />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={formik.values.selectedFoods.includes(
                              food.id
                            )}
                            onChange={() => handleCheckboxChange(food.id)}
                            className="form-checkbox h-5 w-5 text-green-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">
                  Đã đăng ký tất cả các món ăn.
                </p> // Display message if no food data
              )}
            </div>

            {formik.touched.selectedFoods && formik.errors.selectedFoods && (
              <p className="formik-error-message ">
                {formik.errors.selectedFoods}
              </p>
            )}
          </div>

          <div>
            <label className="label-input" htmlFor="commissionRate">
              Hoa hồng
            </label>
            <input
              id="commissionRate"
              name="commissionRate"
              type="text"
              placeholder="Vui lòng nhập tỷ lệ hoa hồng"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.commissionRate}
              className="input-form"
            />
            {formik.touched.commissionRate && formik.errors.commissionRate && (
              <p className="formik-error-message ">
                {formik.errors.commissionRate}
              </p>
            )}
          </div>

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
          <p>Bạn có chắc chắn muốn đăng ký món ăn này?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-cancel" onClick={closeModal}>
              Hủy bỏ
            </button>
            <button
              className="btn-confirm "
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

export default FoodRegistration;
