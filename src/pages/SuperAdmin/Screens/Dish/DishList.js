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

const Dishes = () => {
  const [dishes, setDishes] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
  }, [pageIndex]);
  const fetchDish = async () => {
    try {
      const result = await dishAPI.getDishByPagination(pageIndex);
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

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewDishData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
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

  // const handleCreateDish = async () => {
  //   try {
  //     const selectedCategory = categories.find(
  //       (cat) => cat.id === newDishData.categoryId
  //     );
  //     await dishAPI.createDish({
  //       ...newDishData,
  //       categoryId: selectedCategory ? selectedCategory.id : "",
  //     });
  //     toast.success("Thêm món ăn thành công!");
  //     setModalOpen(false);
  //     setPageIndex(0);

  //     fetchDish();
  //   } catch (error) {
  //     console.error("Error creating new dish:", error);
  //   }
  // };

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

  return (
    <>
      <div className="table-content-container container">
        <h2 className="table-title">Danh sách món ăn</h2>
        <div className="create-btn">
          <Button id="create-btn" variant="contained" onClick={handleOpenModal}>
            Thêm món ăn
          </Button>
        </div>

        <div className="table-container">
          <Paper className="table">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Hình ảnh</StyledTableCell>
                  <StyledTableCell>Tên món ăn</StyledTableCell>
                  <StyledTableCell>Giá</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dishes.map((dish) => (
                  <StyledTableRow key={dish.id}>
                    <StyledTableCell>
                      <img
                        src={dish.image}
                        alt={dish.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <span
                        style={{
                          cursor: "pointer",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleDishClick(dish.id)}
                      >
                        {dish.name}
                      </span>
                    </StyledTableCell>

                    <StyledTableCell>
                      {dish.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            <div className="pagination-container">
              <Pagination
                componentName="div"
                count={totalPages}
                page={pageIndex + 1}
                onChange={handlePageChange}
              />
            </div>
          </Paper>
        </div>

        {/* <Pagination
          count={totalPages}
          page={pageIndex + 1}
          onChange={handlePageChange}
        /> */}
      </div>
      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
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
          {/* <TextField
            label="Hình ảnh"
            name="image"
            value={newDishData.image}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          /> */}
          <TextField
            // label="Hình ảnh"
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
