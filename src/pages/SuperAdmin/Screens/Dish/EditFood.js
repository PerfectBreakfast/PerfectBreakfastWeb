import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dishAPI from "../../../../services/dishAPI";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";

Modal.setAppElement("#root");

const EditFood = () => {
  const { id } = useParams();
  const [originalImage, setOriginalImage] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodData = async () => {
      setIsLoading(true);
      try {
        const data = await dishAPI.getDishById(id);
        if (data) {
          formik.setValues({
            name: data.name,
            price: data.price,
            description: data.description,
            foodStatus: data.foodStatus,
            image: null, // Khởi tạo không có file hình ảnh mới
          });
          setOriginalImage(data.image); // Lưu URL hình ảnh ban đầu
          setPreviewImage(data.image); // Sử dụng URL hình ảnh ban đầu cho xem trước
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
        toast.error(error.errors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      foodStatus: "",
      description: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên món ăn không được để trống"),
      price: Yup.number()
        .required("Giá không được để trống")
        .positive("Giá phải là số dương"),
      description: Yup.string().required("Mô tả món ăn không được để trống"),
      foodStatus: Yup.string().required("Bạn cần chọn loại món"),
    }),

    onSubmit: async (values) => {
      setIsOpen(false); // Close modal after confirmation
      setIsLoading(true); // Hiển thị loading
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("foodStatus", values.foodStatus);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      try {
        await dishAPI.editFood(id, formData);
        toast.success("Cập nhật món ăn thành công!");
        navigate(-1);
      } catch (error) {
        toast.error(error.errors);
        console.error("Error updating food:", error);
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file); // Cập nhật file hình ảnh mới vào Formik
      const newImageURL = URL.createObjectURL(file);
      setPreviewImage(newImageURL); // Cập nhật URL xem trước với file mới
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", null); // Xóa file hình ảnh mới khỏi Formik
    setPreviewImage(originalImage); // Quay lại hiển thị hình ảnh ban đầu
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input file
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleCreateClick = async () => {
    // Đánh dấu tất cả các trường là đã chạm vào, bao gồm cả selectedImage
    formik.setTouched({
      name: true,
      price: true,
      description: true,
      foodStatus: true,
    });

    const errors = await formik.validateForm();
    formik.setErrors(errors);

    // Kiểm tra xem form có lỗi không
    if (Object.keys(errors).length === 0) {
      // Nếu không có lỗi, mở modal xác nhận
      openModal();
    }
  };

  return (
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl my-4 h-fit w-5/6">
      {isLoading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa món ăn</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="name" className="label-input">
              Tên món ăn
            </label>
            <input
              id="name"
              className="input-form"
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="Nhập tên món ăn"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="formik-error-message">{formik.errors.name}</div>
            )}
          </div>
          <div>
            <label htmlFor="price" className="label-input">
              Đơn giá
            </label>
            <input
              id="price"
              className="input-form"
              placeholder="Nhập đơn giá"
              type="number"
              name="price"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="formik-error-message">{formik.errors.price}</div>
            )}
          </div>
          <div>
            <label htmlFor="description" className="label-input">
              Mô tả
            </label>
            <input
              id="description"
              className="input-form"
              type="text"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              placeholder="Nhập mô tả món ăn"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="formik-error-message">
                {formik.errors.description}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="foodStatus" className="label-input">
              Loại món ăn
            </label>
            <select
              disabled
              id="foodStatus"
              className="input-form"
              name="foodStatus"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.foodStatus}
            >
              {" "}
              <option disabled value="">
                Chọn loại món
              </option>
              <option value="0">Combo</option>
              <option value="1">Bán lẻ</option>
            </select>
            {formik.touched.foodStatus && formik.errors.foodStatus && (
              <div className="formik-error-message">
                {formik.errors.foodStatus}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="selectedImage" className="label-input">
              Hình ảnh
            </label>
            <input
              id="selectedImage"
              className="input-file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {previewImage && (
              <div className="mt-4 items-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-40 rounded"
                />
                {previewImage && previewImage !== originalImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-delete-image "
                  >
                    Xóa Hình Ảnh
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleCreateClick}
            className="btn-submit-form mt-2"
          >
            Cập Nhật
          </button>
        </div>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận cập nhật"
      >
        <div className="bg-white rounded-xl p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn cập nhật món ăn này?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-cancel" onClick={closeModal}>
              Hủy bỏ
            </button>
            <button className="btn-confirm " onClick={formik.submitForm}>
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditFood;
