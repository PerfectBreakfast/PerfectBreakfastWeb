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
      try {
        const data = await dishAPI.getDishById(id);
        if (data) {
          formik.setValues({
            name: data.name,
            price: data.price,
            image: null, // Khởi tạo không có file hình ảnh mới
          });
          setOriginalImage(data.image); // Lưu URL hình ảnh ban đầu
          setPreviewImage(data.image); // Sử dụng URL hình ảnh ban đầu cho xem trước
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFoodData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên món ăn không được để trống"),
      price: Yup.number()
        .required("Giá không được để trống")
        .positive("Giá phải là số dương"),
    }),
    onSubmit: async (values) => {
      setIsOpen(false); // Close modal after confirmation
      setIsLoading(true); // Hiển thị loading
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      try {
        await dishAPI.editFood(id, values.name, values.price, formData);
        toast.success("Cập nhật món ăn thành công!");
        navigate(-1);
      } catch (error) {
        toast.error("Có lỗi xảy ra khi cập nhật món ăn.");
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
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl w-5/6">
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
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.name}
              </div>
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
              <div className="text-red-500 text-sm mt-2">
                {formik.errors.price}
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
            className="btn-submit-form"
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
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn cập nhật món ăn này?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
              onClick={formik.submitForm}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditFood;
