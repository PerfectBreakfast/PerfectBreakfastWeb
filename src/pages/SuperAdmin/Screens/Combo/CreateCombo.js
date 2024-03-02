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
      name: Yup.string().required("Tên combo là bắt buộc"),
      content: Yup.string().required("Nội dung là bắt buộc"),
      image: Yup.mixed().required("Hình ảnh là bắt buộc"),
      mainFoodId: Yup.string().required("Chọn món chính là bắt buộc"),
      sideFoodId: Yup.string().required("Chọn món phụ là bắt buộc"),
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
        toast.error("Thêm combo thất bại!");
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  // const handleFileChange = (event) => {
  //   const { files } = event.target;
  //   formik.setFieldValue("image", files[0]);
  // };

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
      const response = await categoryAPI.getFoodByCategory(categoryId);
      if (type === "main") {
        setMainDishes(response[0]?.foodResponse || []);
      } else {
        setSideDishes(response[0]?.foodResponse || []);
      }
    } catch (error) {
      console.error(`Error fetching ${type} dishes:`, error);
    }
  };

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
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl w-5/6">
      <ToastContainer />
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
          <p>Bạn có chắc chắn muốn tạo mới combo này?</p>
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

      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4">Tạo mới món ăn</h2>

        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
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
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.name}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nội dung:
            </label>
            <input
              id="content"
              name="content"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.content}
              className=" shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Nhập mô tả combo"
            />
            {formik.touched.content && formik.errors.content ? (
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.content}
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="image"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
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
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.image}
              </div>
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
                  className="bg-red-500 hover:bg-red-600 mt-2 text-white p-1 rounded"
                  onClick={handleImageRemove}
                >
                  Xóa hình ảnh
                </button>
              </div>
            )}
          </div>

          {/* Category and Dishes selection */}
          {/* Example for Main Category selection: */}
          <div>
            <label
              htmlFor="mainCategory"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Món chính:
            </label>
            <select
              id="mainCategory"
              name="mainCategory"
              onChange={(e) => handleCategoryChange(e, "main")}
              onBlur={formik.handleBlur}
              value={formik.values.mainCategory}
              className=" shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            >
              <option value="">Chọn loại món chính</option>
              {categoryResponses.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formik.touched.mainCategory && formik.errors.mainCategory ? (
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.mainCategory}
              </div>
            ) : null}
          </div>

          {/* Dishes selection based on category */}
          {/* Example for Main Dishes selection: */}

          {mainDishes.length > 0 && (
            <div>
              <select
                id="mainFoodId"
                name="mainFoodId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mainFoodId}
                className=" shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              >
                <option value="">Chọn món chính</option>
                {mainDishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {dish.name}
                  </option>
                ))}
              </select>
              {formik.touched.mainFoodId && formik.errors.mainFoodId ? (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.mainFoodId}
                </div>
              ) : null}
            </div>
          )}

          {/* Similarly add fields for Side Category and Side Dishes with respective change handlers */}

          {/* Side Category Selection */}
          <div>
            <label
              htmlFor="sideCategory"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Món phụ:
            </label>
            <select
              id="sideCategory"
              name="sideCategory"
              onChange={(e) => handleCategoryChange(e, "side")}
              onBlur={formik.handleBlur}
              value={formik.values.sideCategory}
              className=" shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            >
              <option value="">Chọn loại món phụ</option>
              {categoryResponses.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formik.touched.sideCategory && formik.errors.sideCategory ? (
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.sideCategory}
              </div>
            ) : null}
          </div>

          {/* Side Dishes Selection based on the Side Category */}
          {sideDishes.length > 0 && (
            <div>
              <select
                id="sideFoodId"
                name="sideFoodId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sideFoodId}
                className=" shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              >
                <option value=""> Chọn món phụ</option>
                {sideDishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {dish.name}
                  </option>
                ))}
              </select>
              {formik.touched.sideFoodId && formik.errors.sideFoodId ? (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.sideFoodId}
                </div>
              ) : null}
            </div>
          )}
          {/* <div className="flex justify-end mt-4">
              <button type="submit" className="btn btn-primary">
                Tạo mới
              </button>
            </div> */}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200"
              onClick={handleCreateClick}
            >
              Tạo mới
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCombo;
