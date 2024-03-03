import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import dishAPI from "../../../../services/dishAPI";
import categoryAPI from "../../../../services/categoryAPI";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

Modal.setAppElement("#root");

const CreateFood = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageInputKey, setImageInputKey] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryAPI.getCategory();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      categoryId: "",
      selectedImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên món ăn không được để trống"),
      price: Yup.number()
        .positive("Đơn giá phải là số dương")
        .required("Đơn giá không được để trống"),
      categoryId: Yup.string().required("Danh mục không được để trống"),
      selectedImage: Yup.mixed().required("Bạn cần chọn hình ảnh cho món ăn"),
    }),

    onSubmit: async (values) => {
      setIsOpen(false);
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("categoryId", values.categoryId);
        if (values.selectedImage) {
          formData.append("image", values.selectedImage);
        }

        await dishAPI.createDish(formData);
        toast.success("Thêm món ăn thành công!");
        navigate(-1);
      } catch (error) {
        console.error("Error creating new dish:", error);
        toast.error("Có lỗi xảy ra khi tạo mới món ăn!");
      } finally {
        setIsLoading(false);
      }
    },
  });

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (formik.values.selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(formik.values.selectedImage);
    } else {
      setImagePreview(null);
    }
  }, [formik.values.selectedImage]);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("selectedImage", file);
    formik.setFieldTouched("selectedImage", true, false);
  };

  const handleCreateClick = async () => {
    formik.setTouched({
      name: true,
      price: true,
      categoryId: true,
      selectedImage: true,
    });

    const errors = await formik.validateForm();
    formik.setErrors(errors);

    // Kiểm tra xem form có lỗi không
    if (Object.keys(errors).length === 0) {
      openModal();
    }
  };

  const handleImageRemove = () => {
    formik.setFieldValue("selectedImage", null); // Set giá trị của selectedImage thành null
    setImageInputKey(Date.now()); // Reset input file bằng cách thay đổi key
  };
  return (
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl w-5/6">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4">Tạo mới món ăn</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="name" className="label-input">
              Tên món ăn
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="input-form"
              placeholder="Tên món ăn"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="formik-error-message">{formik.errors.name}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="price" className="label-input">
              Đơn giá
            </label>
            <input
              id="price"
              name="price"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
              className="input-form"
              placeholder="Giá"
            />
            {formik.touched.price && formik.errors.price ? (
              <div className="formik-error-message">{formik.errors.price}</div>
            ) : null}
          </div>

          <div>
            <label htmlFor="categoryId" className="label-input">
              Danh mục
            </label>
            <select
              id="categoryId"
              name="categoryId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.categoryId}
              className="input-form"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formik.touched.categoryId && formik.errors.categoryId ? (
              <div className="formik-error-message">
                {formik.errors.categoryId}
              </div>
            ) : null}
          </div>

          <div>
            <label htmlFor="selectedImage" className="label-input">
              Hình ảnh
            </label>
            <input
              key={imageInputKey} // Sử dụng key để reset input
              id="selectedImage"
              name="selectedImage"
              type="file"
              onChange={handleImageChange}
              className="input-file"
            />
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
            {formik.touched.selectedImage && formik.errors.selectedImage ? (
              <div className="formik-error-message">
                {formik.errors.selectedImage}
              </div>
            ) : null}
          </div>

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
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn tạo mới món ăn này?</p>
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

export default CreateFood;
