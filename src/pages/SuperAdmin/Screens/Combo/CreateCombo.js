import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dishAPI from "../../../../services/dishAPI";
import comboAPI from "../../../../services/comboAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import categoryAPI from "../../../../services/categoryAPI";
import "../Combo/Combo.css";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

const CreateCombo = () => {
  const navigate = useNavigate();
  const [categoryResponses, setCategoryResponses] = useState([]);
  const [mainDishes, setMainDishes] = useState([]);
  const [sideDishes, setSideDishes] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageInputKey, setImageInputKey] = useState(Date.now());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategory();
        setCategoryResponses(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      content: "",
      image: null,
      mainFoodId: "",
      sideFoodId: "",
      mainCategory: "",
      sideCategory: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên combo không được để trống"),
      content: Yup.string().required("Nội dung không được để trống"),
      image: Yup.mixed().required("Hình ảnh không được để trống"),
      mainFoodId: Yup.string().required("Món chính không được để trống"),
      sideFoodId: Yup.string().required("Món phụ không được để trống"),
    }),
    onSubmit: async (values) => {
      setIsOpen(false);
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("content", values.content);
        formData.append("image", values.image);
        formData.append("foodId", values.mainFoodId);
        formData.append("foodId", values.sideFoodId);

        const newCombo = await comboAPI.createCombo(formData);
        toast.success("Thêm combo thành công!");
        navigate(-1);
      } catch (error) {
        console.error("Error creating combo:", error);
        toast.error(error.errors);
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("image", file);
    // Cập nhật hình ảnh xem trước
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageRemove = () => {
    setImageInputKey(Date.now());
    formik.setFieldValue("image", null);
    setImagePreview(null);
  };

  const handleCategoryChange = async (e, type) => {
    const categoryId = e.target.value;
    formik.setFieldValue(
      type === "main" ? "mainCategory" : "sideCategory",
      categoryId
    );

    try {
      const response = await categoryAPI.getFoodByCategoryForCreate(categoryId);
      if (type === "main") {
        setMainDishes(response.foodResponse || []);
      } else {
        setSideDishes(response.foodResponse || []);
      }
    } catch (error) {
      console.error(`Error fetching ${type} dishes:`, error);
    }
  };

  console.log("mon chinh", mainDishes);

  const handleCreateClick = async () => {
    // Đánh dấu tất cả các trường là đã chạm vào, bao gồm cả selectedImage
    formik.setTouched({
      name: true,
      content: true,
      image: true,
      mainFoodId: true,
      sideFoodId: true, // Thêm dòng này
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
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl my-4 h-fit w-5/6">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4">Tạo mới combo</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="name" className="label-input">
              Tên combo:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="input-form dark:shadow-sm-light"
              placeholder="Nhập tên combo"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="formik-error-message">{formik.errors.name}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="content" className="label-input">
              Nội dung:
            </label>
            <input
              id="content"
              name="content"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.content}
              className=" input-form dark:shadow-sm-light"
              placeholder="Nhập mô tả combo"
            />
            {formik.touched.content && formik.errors.content ? (
              <div className="formik-error-message">
                {formik.errors.content}
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="image" className="label-input">
              Hình ảnh:
            </label>
            <input
              key={imageInputKey}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              onBlur={formik.handleBlur}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {formik.touched.image && formik.errors.image ? (
              <div className="formik-error-message">{formik.errors.image}</div>
            ) : null}
          </div>

          <div>
            {imagePreview && (
              <div className="mt-4 items-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 rounded"
                />
                <button
                  type="button"
                  className="btn-delete-image "
                  onClick={handleImageRemove}
                >
                  Xóa hình ảnh
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="mainCategory" className="label-input">
              Món chính:
            </label>
            <select
              id="mainCategory"
              name="mainCategory"
              onChange={(e) => handleCategoryChange(e, "main")}
              onBlur={formik.handleBlur}
              value={formik.values.mainCategory}
              className=" input-form dark:shadow-sm-light"
            >
              <option value="">Chọn loại món chính</option>
              {categoryResponses.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formik.touched.mainCategory && formik.errors.mainCategory ? (
              <div className="formik-error-message">
                {formik.errors.mainCategory}
              </div>
            ) : null}
          </div>

          {/* {mainDishes.length > 0 && (
            <div>
              <select
                id="mainFoodId"
                name="mainFoodId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mainFoodId}
                className=" input-form dark:shadow-sm-light"
              >
                <option value="">Chọn món chính</option>
                {mainDishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {dish.name}
                  </option>
                ))}
              </select>
              {formik.touched.mainFoodId && formik.errors.mainFoodId ? (
                <div className="formik-error-message">
                  {formik.errors.mainFoodId}
                </div>
              ) : null}
            </div>
          )} */}

          {mainDishes.length > 0 && (
            <div>
              <select
                id="mainFoodId"
                name="mainFoodId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mainFoodId}
                className="input-form dark:shadow-sm-light"
              >
                <option value="">Chọn món chính</option>
                {mainDishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {`${dish.name} - ${dish.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}`}
                  </option>
                ))}
              </select>
              {formik.touched.mainFoodId && formik.errors.mainFoodId ? (
                <div className="formik-error-message">
                  {formik.errors.mainFoodId}
                </div>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="sideCategory" className="label-input">
              Món phụ:
            </label>
            <select
              id="sideCategory"
              name="sideCategory"
              onChange={(e) => handleCategoryChange(e, "side")}
              onBlur={formik.handleBlur}
              value={formik.values.sideCategory}
              className=" input-form dark:shadow-sm-light"
            >
              <option value="">Chọn loại món phụ</option>
              {categoryResponses.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formik.touched.sideCategory && formik.errors.sideCategory ? (
              <div className="formik-error-message">
                {formik.errors.sideCategory}
              </div>
            ) : null}
          </div>

          {/* {sideDishes.length > 0 && (
            <div>
              <select
                id="sideFoodId"
                name="sideFoodId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sideFoodId}
                className=" input-form dark:shadow-sm-light"
              >
                <option value=""> Chọn món phụ</option>
                {sideDishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {dish.name}
                  </option>
                ))}
              </select>
              {formik.touched.sideFoodId && formik.errors.sideFoodId ? (
                <div className="formik-error-message">
                  {formik.errors.sideFoodId}
                </div>
              ) : null}
            </div>
          )} */}

          {sideDishes.length > 0 && (
            <div>
              <select
                id="sideFoodId"
                name="sideFoodId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sideFoodId}
                className="input-form dark:shadow-sm-light"
              >
                <option value="">Chọn món phụ</option>
                {sideDishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {`${dish.name} - ${dish.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}`}
                  </option>
                ))}
              </select>
              {formik.touched.sideFoodId && formik.errors.sideFoodId ? (
                <div className="formik-error-message">
                  {formik.errors.sideFoodId}
                </div>
              ) : null}
            </div>
          )}

          <button
            type="button"
            className="btn-submit-form"
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
        <div className="bg-white rounded-xl p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn tạo mới combo này?</p>
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
    </div>
  );
};

export default CreateCombo;
