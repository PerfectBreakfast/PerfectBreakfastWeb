import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryAPI from "../../../../services/categoryAPI";
import comboAPI from "../../../../services/comboAPI";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

const EditCombo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);

  const [mainDishes, setMainDishes] = useState([]);
  const [sideDishes, setSideDishes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategoriesAndComboData = async () => {
      try {
        const categoriesResponse = await categoryAPI.getCategory();
        setCategories(categoriesResponse);
        const comboData = await comboAPI.getComboById(id);
        formik.setValues({
          name: comboData.name,
          content: comboData.content,
          mainCategory: comboData.foodResponses[0]?.categoryResponse.id,
          sideCategory: comboData.foodResponses[1]?.categoryResponse.id,
          mainFoodId: comboData.foodResponses[0]?.id,
          sideFoodId: comboData.foodResponses[1]?.id,
          image: comboData.image,
        });
        setOriginalImage(comboData.image);
        setPreviewImage(comboData.image);
        fetchDishes(
          comboData.foodResponses[0]?.categoryResponse.id,
          setMainDishes
        );
        fetchDishes(
          comboData.foodResponses[1]?.categoryResponse.id,
          setSideDishes
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCategoriesAndComboData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      content: "",
      mainFoodId: "",
      sideFoodId: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên combo là bắt buộc"),
      content: Yup.string().required("Nội dung là bắt buộc"),
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
        // if (fileInputRef.current.files[0]) {
        //   formData.append("image", fileInputRef.current.files[0]);
        // }
        // Bổ sung thêm các field cần thiết
        if (values.image instanceof File) {
          formData.append("image", values.image);
        }

        formData.append("foodId", values.mainFoodId);
        formData.append("foodId", values.sideFoodId);

        await comboAPI.editCombo(id, formData);
        toast.success("Cập nhật combo thành công!");
        navigate(-1); // Hoặc địa chỉ bạn muốn chuyển hướng đến
      } catch (error) {
        console.error("Error updating combo:", error);
        toast.error("Cập nhật combo thất bại!");
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  // Xử lý thay đổi danh mục và món ăn
  const fetchDishes = async (categoryId, setDishesFunc) => {
    if (!categoryId) return;
    try {
      const response = await categoryAPI.getFoodByCategory(categoryId);
      setDishesFunc(response[0]?.foodResponse || []);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.currentTarget.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       formik.setFieldValue("image", reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      const newImageURL = URL.createObjectURL(file);
      setPreviewImage(newImageURL);
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", null);
    setPreviewImage(originalImage);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditClick = async () => {
    // Đánh dấu tất cả các trường là đã chạm vào, bao gồm cả selectedImage
    formik.setTouched({
      name: true,
      content: true,
      mainFoodId: true,
      sideFoodId: true,
    });

    const errors = await formik.validateForm();
    formik.setErrors(errors);

    // Kiểm tra xem form có lỗi không
    if (Object.keys(errors).length === 0) {
      // Nếu không có lỗi, mở modal xác nhận
      openModal();
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl w-5/6">
      {isLoading && <Loading />}
      <ToastContainer />

      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa combo</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="name" className="label-input">
              Tên Combo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className=" input-form"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="formik-error-message">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <label htmlFor="content" className="label-input">
              Nội dung
            </label>
            <input
              id="content"
              name="content"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.content}
              className=" input-form"
            />
            {formik.touched.content && formik.errors.content && (
              <div className="formik-error-message">
                {formik.errors.content}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="image" className="label-input">
              Hình ảnh
            </label>
            <input
              ref={fileInputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-file"
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
                    className="bg-red-500 hover:bg-red-600 mt-2 text-white p-1 rounded"
                  >
                    Xóa Hình Ảnh
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Đoạn code cho việc chọn món chính và món phụ sẽ được thêm vào đây */}
          {/* Chọn category cho món chính */}
          <div>
            <label htmlFor="mainCategory" className="label-input">
              Category Món Chính
            </label>
            <select
              id="mainCategory"
              name="mainCategory"
              onChange={(e) => {
                const newCategoryId = e.target.value;
                formik.setFieldValue("mainCategory", newCategoryId); // Cập nhật giá trị cho mainCategory
                formik.setFieldValue("mainFoodId", ""); // Reset món chính khi thay đổi category
                fetchDishes(newCategoryId, setMainDishes); // Tải danh sách món chính theo category mới
              }}
              className=" input-form"
              value={formik.values.mainCategory}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn món chính dựa vào category đã chọn */}
          <div>
            <select
              id="mainFoodId"
              name="mainFoodId"
              onChange={formik.handleChange}
              value={formik.values.mainFoodId}
              className=" input-form"
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

          {/* Chọn category cho món phụ */}
          <div>
            <label htmlFor="sideCategory" className="label-input">
              Category Món Phụ
            </label>
            <select
              id="sideCategory"
              name="sideCategory"
              onChange={(e) => {
                const newCategoryId = e.target.value;
                formik.setFieldValue("sideCategory", newCategoryId); // Cập nhật giá trị cho sideCategory
                formik.setFieldValue("sideFoodId", ""); // Reset món phụ khi thay đổi category
                fetchDishes(newCategoryId, setSideDishes); // Tải danh sách món phụ theo category mới
              }}
              className=" input-form"
              value={formik.values.sideCategory}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn món phụ dựa vào category đã chọn */}
          <div>
            <select
              id="sideFoodId"
              name="sideFoodId"
              onChange={formik.handleChange}
              value={formik.values.sideFoodId}
              className=" input-form"
            >
              <option value="">Chọn món phụ</option>
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

          <button
            type="button"
            className="btn-submit-form"
            onClick={handleEditClick}
          >
            Cập nhật
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
          <p>Bạn có chắc chắn muốn cập nhật combo này?</p>
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

export default EditCombo;
