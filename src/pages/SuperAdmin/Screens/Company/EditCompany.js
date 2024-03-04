import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";
import managementUnitAPI from "../../../../services/managementUnitAPI";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";
import MealAPI from "../../../../services/MealAPI";
import companyAPI from "../../../../services/companyAPI";

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [managementData, setManagementData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [fixedMealIds, setFixedMealIds] = useState(new Set());

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [managementRes, deliveryRes, mealRes, companyRes] =
          await Promise.all([
            managementUnitAPI.getAllManagementUnit(),
            deliveryUnitAPI.getManagementUnit(),
            MealAPI.getMealByAdmin(),
            companyAPI.getCompanyById(id),
          ]);
        setManagementData(managementRes);
        setDeliveryData(deliveryRes);
        setMealData(mealRes);
        formik.setValues({
          name: companyRes.name,
          phoneNumber: companyRes.phoneNumber,
          email: companyRes.email,
          address: companyRes.address,
          partnerId: companyRes.partner.id,
          deliveryId: companyRes.delivery.id,
          selectedMeals: companyRes.meals.reduce(
            (acc, meal) => ({
              ...acc,
              [meal.id]: { startTime: meal.startTime, endTime: meal.endTime },
            }),
            {}
          ),
        });

        // Cập nhật state fixedMealIds với ID của các bữa ăn cố định
        const fixedMeals = new Set(companyRes.meals.map((meal) => meal.id));
        setFixedMealIds(fixedMeals);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching company data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const selectedMealsSchema = Yup.object().test(
    "selectedMeals-test",
    "Vui lòng nhập thời gian bắt đầu và kết thúc cho tất cả bữa ăn được chọn",
    (selectedMeals) => {
      // Kiểm tra tất cả các bữa ăn được chọn có thời gian bắt đầu và kết thúc hợp lệ
      return Object.values(selectedMeals).every((meal) => {
        const { startTime, endTime } = meal;
        return (
          startTime && endTime && startTime.length > 0 && endTime.length > 0
        );
      });
    }
  );

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
      // selectedMeals: Yup.object().test(
      //   "at-least-one-meal",
      //   "Vui lòng chọn ít nhất một bữa",
      //   (selectedMeals) => Object.keys(selectedMeals).length > 0
      // ),

      selectedMeals: selectedMealsSchema,
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const mealsForSubmission = Object.entries(values.selectedMeals).map(
          ([mealId, times]) => ({
            mealId,
            startTime: times.startTime,
            endTime: times.endTime,
          })
        );

        await companyAPI.editCompanyById(id, {
          ...values,
          meals: mealsForSubmission,
        });
        toast.success("Company updated successfully!");
        navigate(-1);
      } catch (error) {
        toast.error("Error updating company");
        console.error("Error updating company:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Use similar helper functions for meal selection and time change as in CreateCompany
  // Note: Ensure that meal removal is not possible, only addition or time modification

  const handleEditClick = async () => {
    // Mark all fields as touched to show validation errors, if any
    formik.setTouched({
      name: true,
      phoneNumber: true,
      email: true,
      address: true,
      partnerId: true,
      deliveryId: true,
      selectedMeals: true,
    });

    // Validate form manually to check for errors
    const errors = await formik.validateForm();
    formik.setErrors(errors);

    // If no errors, proceed to show confirmation modal
    if (Object.keys(errors).length === 0) {
      openModal();
    }
  };

  // Add these functions inside your component
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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

  // Since deletion is not allowed, this function is not needed for EditCompany
  // Existing meals can only have their times modified

  const handleMealSelectionChange = (mealId) => {
    // Kiểm tra nếu là bữa ăn cố định thì không cho phép bỏ chọn
    if (
      fixedMealIds.has(mealId) &&
      formik.values.selectedMeals.hasOwnProperty(mealId)
    ) {
      // Ngăn không cho phép bỏ chọn bằng cách không làm gì cả nếu bữa ăn là cố định
      return;
    }

    const updatedSelection = { ...formik.values.selectedMeals };
    if (updatedSelection[mealId]) {
      // Cho phép bỏ chọn nếu không phải bữa ăn cố định
      delete updatedSelection[mealId];
    } else {
      // Thêm bữa ăn mới
      updatedSelection[mealId] = { startTime: "", endTime: "" };
    }
    formik.setFieldValue("selectedMeals", updatedSelection);
  };

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
                    // Cập nhật sự kiện onChange
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
            onClick={handleEditClick}
          >
            Edit Company
          </button>
        </div>
      </form>

      {/* Similar form structure as CreateCompany, adjusted for editing */}
      {isLoading && <Loading />}
      {/* Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
          <h2 className="text-lg font-semibold mb-4">Confirm Edit</h2>
          <p>Are you sure you want to apply these changes?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button className="btn-cancel" onClick={closeModal}>
              Cancel
            </button>
            <button
              className="btn-confirm"
              onClick={() => {
                closeModal();
                formik.handleSubmit();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditCompany;
