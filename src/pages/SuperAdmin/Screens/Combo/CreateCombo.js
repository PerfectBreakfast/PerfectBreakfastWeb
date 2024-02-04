import React, { useState, useEffect } from "react";
import dishAPI from "../../../../services/dishAPI";
import comboAPI from "../../../../services/comboAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import categoryAPI from "../../../../services/categoryAPI";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "../Combo/Combo.css";

const CreateCombo = () => {
  const navigate = useNavigate();
  const [mainFoodId, setMainFoodId] = useState([]);
  const [sideFoodId, setSideFoodId] = useState([]);

  const [comboData, setComboData] = useState({
    name: "",
    content: "",
    FoodId: [], // This will hold the IDs of main and side dishes
    selectedImage: null,
  });

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const [categoryResponses, setCategoryResponses] = useState([]);

  const [mainCategory, setMainCategory] = useState(null);
  const [sideCategory, setSideCategory] = useState(null);

  const [mainDishes, setMainDishes] = useState([]);
  const [sideDishes, setSideDishes] = useState([]);

  const [categoryId, setCategoryId] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategory();
        setCategoryResponses(response);
      } catch (error) {
        console.error("Error fetching food responses:", error);
      }
    };
    fetchCategories();
  }, [categoryId]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      // If the input is for image, update 'selectedImage' property
      setComboData((prevData) => ({
        ...prevData,
        selectedImage: files[0],
      }));
    } else {
      // For other inputs, update as usual
      setComboData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const openCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };
  const closeCancelDialog = () => {
    setIsCancelDialogOpen(false);
  };

  const handleCategoryChange = (category, setType) => {
    setType(category);
    // Fetch dishes based on the selected category
    fetchDishes(
      category,
      setType === setMainCategory ? setMainDishes : setSideDishes
    );
  };

  const fetchDishes = async (categoryId, setDishes) => {
    try {
      const response = await categoryAPI.getFoodByCategory(categoryId);
      setDishes(response[0]?.foodResponse || []); // Updated this line
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const handleDishChange = (dishId, setType) => {
    setComboData((prevData) => ({
      ...prevData,
      FoodId:
        setType === setMainFoodId
          ? [dishId, prevData.FoodId[1]]
          : [prevData.FoodId[0], dishId],
    }));
    setType(dishId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("name", comboData.name);
      formData.append("content", comboData.content);
      formData.append("image", comboData.selectedImage);

      // Append FoodId array to the formData
      comboData.FoodId.forEach((id, index) => {
        formData.append(`FoodId[${index}]`, id);
      });

      // Use formData for the API call
      const newCombo = await comboAPI.createCombo(formData);
      console.log("New Combo:", newCombo);
      toast.success("Thêm combo thành công!");
      navigate(-1);
    } catch (error) {
      console.error("Error creating combo:", error);
      toast.error("Thêm combo thất bại!");
    }
  };

  console.log("chính", comboData);
  return (
    <div className="container mx-auto p-6">
      <h5 className="text-xl font-bold mb-4">Tạo mới combo</h5>
      <div className="bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="form-create-combo">
            <p className="text-md mb-2">Tên combo</p>
            <input
              className="placeholder-gray-500 border-2 rounded-md p-4 w-full mb-4"
              placeholder="Thêm tên của combo"
              type="text"
              id="text-field-form"
              name="name"
              value={comboData.name}
              onChange={handleInputChange}
              required
            />

            <p className="text-md mb-2">Nội dung</p>
            <input
              className="placeholder-gray-500 border-2 rounded-md p-4 w-full mb-4"
              placeholder="Mô tả combo"
              type="text"
              id="text-field-form"
              name="content"
              value={comboData.content}
              onChange={handleInputChange}
              required
            />

            <p className="text-md mb-2">Hình ảnh</p>
            <input
              className="border-2 rounded-md p-2 w-full mb-4"
              type="file"
              accept="image/*"
              id="image-upload"
              name="image"
              onChange={handleInputChange}
              required
            />

            <div>
              <p className="text-md mb-2">Món chính</p>
              <div className="mb-4">
                {categoryResponses.map((category) => (
                  <label
                    key={category.id}
                    className="inline-flex items-center mr-2"
                  >
                    <input
                      type="radio"
                      name="mainCategory"
                      value={category.id.toString()}
                      onChange={(e) =>
                        handleCategoryChange(e.target.value, setMainCategory)
                      }
                      checked={mainCategory === category.id.toString()}
                      className="form-radio"
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
              {mainCategory && (
                <select
                  className="border-2 rounded-md p-2 w-full mb-4"
                  value={mainFoodId}
                  onChange={(e) =>
                    handleDishChange(e.target.value, setMainFoodId)
                  }
                >
                  {mainDishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <p className="text-md mb-2">Món phụ</p>
              <div className="mb-4">
                {categoryResponses.map((category) => (
                  <label
                    key={category.id}
                    className="inline-flex items-center  mr-2"
                  >
                    <input
                      type="radio"
                      name="sideCategory"
                      value={category.id.toString()}
                      onChange={(e) =>
                        handleCategoryChange(e.target.value, setSideCategory)
                      }
                      checked={sideCategory === category.id.toString()}
                      className="form-radio"
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
              {sideCategory && (
                <select
                  className="border-2 rounded-md p-2 w-full mb-4"
                  value={sideFoodId}
                  onChange={(e) =>
                    handleDishChange(e.target.value, setSideFoodId)
                  }
                >
                  {sideDishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                id="create-combo-btn"
              >
                Tạo mới
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                id="cancel-combo-btn"
                onClick={openCancelDialog}
              >
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Dialog */}
      {isCancelDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <p className="text-md leading-relaxed">
                Bạn có chắc chắn muốn hủy thêm combo không?
              </p>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-auto"
                  onClick={closeCancelDialog}
                >
                  Không
                </button>
                <button
                  className="px-4 py-2 ml-3 bg-red-500 text-white text-base font-medium rounded-md w-auto"
                  onClick={() => navigate(-1)}
                >
                  Có
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCombo;
