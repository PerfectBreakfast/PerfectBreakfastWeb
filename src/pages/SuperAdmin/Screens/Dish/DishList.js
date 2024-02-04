import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Box,
  Modal,
  InputAdornment,
  Typography,
} from "@mui/material";
import dishAPI from "../../../../services/dishAPI";
import categoryAPI from "../../../../services/categoryAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Dish/Dish.css";
import {
  StyledTableCell,
  StyledTableRow,
} from "../Table/StyledTableComponents";
import "../Table/Table.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import { ReactComponent as Search } from "../../../../assets/icons/search.svg";

const Dishes = () => {
  const [dishes, setDishes] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [newDishData, setNewDishData] = useState({
    name: "",
    price: 0,
    image: "",
    categoryId: "",
    selectedImage: null,
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDish();
    const fetchCategories = async () => {
      try {
        const result = await categoryAPI.getCategory();
        setCategories(result);
        console.log("categories", result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [pageIndex, searchTerm]);
  const fetchDish = async () => {
    try {
      const result = await dishAPI.getDishByPagination(searchTerm, pageIndex);
      setDishes(result.items);
      setTotalPages(result.totalPagesCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      // If the input is for image, update 'selectedImage' property
      setNewDishData((prevData) => ({
        ...prevData,
        selectedImage: files[0],
      }));
    } else {
      // For other inputs, update as usual
      setNewDishData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCreateDish = async () => {
    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("name", newDishData.name);
      formData.append("price", newDishData.price);
      formData.append("categoryId", newDishData.categoryId);

      // Append the selected image file
      formData.append("image", newDishData.selectedImage);

      // Use formData instead of newDishData for the API call
      await dishAPI.createDish(formData);

      toast.success("Thêm món ăn thành công!");
      setModalOpen(false);
      setPageIndex(0);
      fetchDish();
    } catch (error) {
      console.error("Error creating new dish:", error);
    }
  };
  const handleDishClick = (dishId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/food/${dishId}`);
  };

  const handleSearch = async () => {
    setSearchTerm(searchInput); // Update searchTerm with searchInput
    setPageIndex(0); // Reset pageIndex to 0]
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h4 className="text-2xl font-semibold mb-4">Danh sách món ăn</h4>

        <div className="flex justify-between items-center mb-4">
          <button
            id="create-btn"
            className="rounded-2xl bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={handleOpenModal}
          >
            Thêm món ăn
          </button>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="px-4 py-2 border rounded-2xl text-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Tìm kiếm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
              onClick={handleSearch}
            >
              <Search />
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md my-6">
          <table className=" min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 rounded-l">Hình ảnh</th>
                <th className="py-3 px-6">Tên món ăn</th>
                <th className="py-3 px-6 rounded-r">Đơn giá</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {dishes.map((dish) => (
                <tr
                  key={dish.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-16 h-16 rounded-full"
                    />
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className="font-medium cursor-pointer hover:text-blue-500"
                      onClick={() => handleDishClick(dish.id)}
                    >
                      {dish.name}
                    </span>
                  </td>
                  <td className="py-3 px-6 ">
                    {dish.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container" style={{ marginTop: "20px" }}>
          <Pagination
            componentName="div"
            count={totalPages}
            page={pageIndex + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          className="rounded-3xl"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Tạo mới món ăn</h2>
          <TextField
            label="Tên món ăn"
            name="name"
            value={newDishData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Giá"
            name="price"
            value={newDishData.price}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          {/* Thêm Select box cho danh mục */}
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="category-select">Danh mục</InputLabel>
            <Select
              labelId="category-select"
              id="category-select"
              name="categoryId"
              value={newDishData.categoryId}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="image"
            type="file"
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <div className="create-btn-modal">
            <Button
              id="create-btn"
              variant="contained"
              onClick={handleCreateDish}
            >
              Tạo mới
            </Button>
          </div>
        </Box>
      </Modal>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default Dishes;
