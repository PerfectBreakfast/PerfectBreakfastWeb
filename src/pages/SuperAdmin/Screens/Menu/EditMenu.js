import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import comboAPI from "../../../../services/comboAPI";
import menuAPI from "../../../../services/menuAPI";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

const EditMenu = () => {
  const { id } = useParams();
  const [combos, setCombos] = useState([]);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const comboData = await comboAPI.getAllCombo();
        setCombos(comboData);
      } catch (error) {
        toast.error("Failed to fetch combo data.");
      }
    };

    const fetchMenuData = async () => {
      try {
        const menuData = await menuAPI.getMenuById(id);
        formik.setValues({
          menuName: menuData.name,
          selectedCombos: menuData.comboFoodResponses.map((combo) => combo.id),
        });
      } catch (error) {
        toast.error("Failed to fetch menu data.");
      }
    };

    fetchMenuData();
    fetchComboData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      menuName: "",
      selectedCombos: [],
    },
    validationSchema: Yup.object({
      menuName: Yup.string().required("Tên menu là bắt buộc"),
      selectedCombos: Yup.array().min(1, "Phải có ít nhất 1 combo được chọn"),
    }),
    onSubmit: async (values) => {
      setIsOpen(false);
      setIsLoading(true);
      try {
        const menuData = {
          name: values.menuName,
          menuFoodRequests: values.selectedCombos.map((comboId) => ({
            comboId,
          })),
        };
        await menuAPI.editMenu(id, menuData);
        toast.success("Chỉnh sửa menu thành công!");
        navigate(-1);
      } catch (error) {
        toast.error("Chỉnh sửa menu thất bại!");
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  const handleCheckboxChange = (comboId) => {
    const updatedCombos = formik.values.selectedCombos.includes(comboId)
      ? formik.values.selectedCombos.filter((id) => id !== comboId)
      : [...formik.values.selectedCombos, comboId];

    formik.setFieldValue("selectedCombos", updatedCombos);
  };
  const handleSubmitClick = async () => {
    formik.setTouched({
      menuName: true,
      selectedCombos: true,
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
          <p>Bạn có chắc chắn muốn cập nhật menu này?</p>
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
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa menu</h2>
          <div>
            <label className="label-input" htmlFor="menuName">
              Tên menu
            </label>
            <input
              className="input-form"
              id="menuName"
              type="text"
              placeholder="Nhập tên của menu"
              onChange={formik.handleChange}
              value={formik.values.menuName}
            />
            {formik.touched.menuName && formik.errors.menuName && (
              <p className="formik-error-message ">{formik.errors.menuName}</p>
            )}
          </div>

          <div>
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
          </div>

          <button
            type="button"
            className="btn-submit-form mt-2"
            onClick={handleSubmitClick}
          >
            Cập nhật
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditMenu;
