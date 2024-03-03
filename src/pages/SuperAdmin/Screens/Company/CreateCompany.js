import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import managementUnitAPI from "../../../../services/managementUnitAPI";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";
import companyAPI from "../../../../services/companyAPI";
import MealAPI from "../../../../services/MealAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import Modal from "react-modal";

const CreateCompany = () => {
  const [managementData, setManagementData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const navigate = useNavigate();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const managementData = await managementUnitAPI.getAllManagementUnit();
        const deliveryData = await deliveryUnitAPI.getManagementUnit();
        const mealData = await MealAPI.getMealByAdmin();
        setManagementData(managementData);
        setDeliveryData(deliveryData);
        setMealData(mealData);
      } catch (error) {
        console.error("Error fetching combo data:", error);
      }
    };
    fetchData();
  }, []);

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      partnerId: "",
      deliveryId: "",
      selectedMeals: {},
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên công ty không được để trống"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Chỉ được nhập số")
        .matches(/^0\d{9}$/, "Số điện thoại phải bắt đầu từ số 0 và có 10 số")
        .required("Số điện thoại không được để trống"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email không được để trống"),
      address: Yup.string().required("Địa chỉ không được để trống"),
      partnerId: Yup.string().required("Vui lòng chọn đối tác"),
      deliveryId: Yup.string().required("Vui lòng chọn đơn vị vận chuyển"),
      // Validate selectedMeals as an object, ensuring at least one meal is selected
      selectedMeals: Yup.object().test(
        "at-least-one-meal",
        "Vui lòng chọn ít nhất một bữa",
        (selectedMeals) => Object.keys(selectedMeals).length > 0
      ),
    }),
    onSubmit: async (values) => {
      setIsOpen(false);
      setIsLoading(true);
      const mealsForSubmission = Object.entries(values.selectedMeals).map(
        ([mealId, times]) => ({
          mealId,
          startTime: times.startTime,
          endTime: times.endTime,
        })
      );

      try {
        await companyAPI.createCompanyUnit({
          ...values,
          meals: mealsForSubmission,
        });
        toast.success("Tạo mới công ty thành công!");
        navigate(-1); // Or wherever you want to redirect after success
      } catch (error) {
        toast.error("Error creating company");
        console.error("Error creating company:", error);
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  // Helper function to handle meal selection
  const handleMealSelectionChange = (mealId) => {
    const updatedSelection = { ...formik.values.selectedMeals };
    if (updatedSelection[mealId]) {
      delete updatedSelection[mealId];
    } else {
      updatedSelection[mealId] = { startTime: "", endTime: "" };
    }
    formik.setFieldValue("selectedMeals", updatedSelection);
  };

  // Helper function to handle meal time change
  const handleMealTimeChange = (mealId, timeType, value) => {
    const timeValueWithSeconds = `${value}:00`; // Format HH:mm:ss
    const updatedSelection = {
      ...formik.values.selectedMeals,
      [mealId]: {
        ...formik.values.selectedMeals[mealId],
        [timeType]: timeValueWithSeconds,
      },
    };
    formik.setFieldValue("selectedMeals", updatedSelection);
  };

  const handleCreateClick = async () => {
    // Đánh dấu tất cả các trường là đã chạm vào, bao gồm cả selectedImage
    formik.setTouched({
      name: true,
      phoneNumber: true,
      email: true,
      address: true,
      partnerId: true,
      deliveryId: true,
      selectedMeals: true,
    });

    const errors = await formik.validateForm();
    formik.setErrors(errors);

    // Kiểm tra xem form có lỗi không
    if (Object.keys(errors).length === 0) {
      // Nếu không có lỗi, mở modal xác nhận
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
      <h2 className="text-xl font-semibold mb-4">Tạo mới công ty</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="label-input" htmlFor="name">
              Tên công ty
            </label>
            <input
              className="input-form"
              id="name"
              type="text"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              placeholder="Nhập tên công ty"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="formik-error-message">{formik.errors.name}</div>
            ) : null}
          </div>

          <div>
            <label className="label-input" htmlFor="phoneNumber">
              Số điện thoại
            </label>
            <input
              className="input-form"
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              onChange={formik.handleChange}
              value={formik.values.phoneNumber}
              placeholder="Nhập số điện thoại"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <div className="formik-error-message">
                {formik.errors.phoneNumber}
              </div>
            ) : null}
          </div>

          <div>
            <label className="label-input" htmlFor="email">
              Email
            </label>
            <input
              className="input-form"
              id="email"
              type="text"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder="Nhập email của công ty"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="formik-error-message">{formik.errors.email}</div>
            ) : null}
          </div>

          <div>
            <label className="label-input" htmlFor="address">
              Địa chỉ
            </label>
            <input
              className="input-form"
              id="address"
              type="text"
              name="address"
              onChange={formik.handleChange}
              value={formik.values.address}
              placeholder="Nhập địa chỉ công ty"
            />
            {formik.touched.address && formik.errors.address ? (
              <div className="formik-error-message">
                {formik.errors.address}
              </div>
            ) : null}
          </div>

          {/* Select field for Management Unit */}
          <div>
            <label className="label-input" htmlFor="partnerId">
              Đơn vị đối tác
            </label>
            <select
              className="input-form"
              id="partnerId"
              name="partnerId"
              onChange={formik.handleChange}
              value={formik.values.partnerId}
            >
              <option value="">Chọn công ty quản lý</option>
              {managementData.map((management) => (
                <option key={management.id} value={management.id}>
                  {management.name}
                </option>
              ))}
            </select>
            {formik.touched.partnerId && formik.errors.partnerId ? (
              <div className="formik-error-message">
                {formik.errors.partnerId}
              </div>
            ) : null}
          </div>

          {/* Select field for Delivery Unit */}
          {/* Similar to Management Unit, adjust the field accordingly */}

          <div>
            <label className="label-input" htmlFor="deliveryId">
              Đơn vị vận chuyển
            </label>
            <select
              className="input-form"
              id="deliveryId"
              name="deliveryId"
              onChange={formik.handleChange}
              value={formik.values.deliveryId}
            >
              <option value="">Chọn đơn vị vận chuyển</option>
              {deliveryData.map((delivery) => (
                <option key={delivery.id} value={delivery.id}>
                  {delivery.name}
                </option>
              ))}
            </select>
            {formik.touched.deliveryId && formik.errors.deliveryId ? (
              <div className="formik-error-message">
                {formik.errors.deliveryId}
              </div>
            ) : null}
          </div>

          {/* List of Meals as Checkboxes */}
          <div>
            <label className="label-input">Bữa ăn</label>
            {mealData.map((meal) => (
              <div key={meal.id}>
                <label>
                  <input
                    type="checkbox"
                    name={`selectedMeals.${meal.id}`}
                    checked={!!formik.values.selectedMeals[meal.id]}
                    onChange={() => handleMealSelectionChange(meal.id)}
                  />
                  {meal.mealType}
                </label>
                {formik.values.selectedMeals[meal.id] && (
                  <div>
                    <input
                      required
                      type="time"
                      name={`selectedMeals.${meal.id}.startTime`}
                      value={
                        formik.values.selectedMeals[meal.id]?.startTime || ""
                      }
                      onChange={(e) =>
                        handleMealTimeChange(
                          meal.id,
                          "startTime",
                          e.target.value
                        )
                      }
                      placeholder="Thời gian bắt đầu"
                    />
                    <input
                      required
                      type="time"
                      name={`selectedMeals.${meal.id}.endTime`}
                      value={
                        formik.values.selectedMeals[meal.id]?.endTime || ""
                      }
                      onChange={(e) =>
                        handleMealTimeChange(meal.id, "endTime", e.target.value)
                      }
                      placeholder="Thời gian kết thúc"
                    />
                  </div>
                )}
              </div>
            ))}
            {formik.touched.selectedMeals && formik.errors.selectedMeals ? (
              <div className="formik-error-message">
                {formik.errors.selectedMeals}
              </div>
            ) : null}
          </div>

          <button
            className="btn-submit-form"
            type="button"
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
          <p>Bạn có chắc chắn muốn tạo mới công ty này?</p>
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
    </div>
  );
};
export default CreateCompany;
