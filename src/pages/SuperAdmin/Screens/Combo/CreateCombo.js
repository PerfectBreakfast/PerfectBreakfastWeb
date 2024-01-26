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
  // const [comboData, setComboData] = useState({
  //   name: "",
  //   content: "",
  //   comboFoodRequests: [
  //     {
  //       foodId: null,
  //     },
  //     {
  //       foodId: null,
  //     },
  //   ],
  //   selectedImage: null,
  // });

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Create a FormData object to handle file upload
  //     const formData = new FormData();
  //     formData.append("name", comboData.name);
  //     formData.append("content", comboData.content);
  //     formData.append("image", comboData.selectedImage);

  //     // Append other form data properties
  //     comboData.comboFoodRequests.forEach((request, index) => {
  //       formData.append(`comboFoodRequests[${index}].foodId`, request.foodId);
  //     });
  //     // Use formData instead of comboData for the API call
  //     const newCombo = await comboAPI.createCombo(formData);
  //     console.log("New Combo:", newCombo);
  //     toast.success("Thêm combo thành công!");
  //     navigate(-1);
  //   } catch (error) {
  //     console.error("Error creating combo:", error);
  //     toast.error("Thêm combo thất bại!");
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Create a FormData object to handle file upload
  //     const formData = new FormData();
  //     formData.append("name", comboData.name);
  //     formData.append("content", comboData.content);
  //     formData.append("image", comboData.selectedImage);

  //     // Create an array of foodIds
  //     const foodIds = comboData.comboFoodRequests.map(
  //       (request) => request.foodId
  //     );
  //     formData.append("foodIds", JSON.stringify(foodIds));

  //     // Use formData instead of comboData for the API call
  //     const newCombo = await comboAPI.createCombo(formData);
  //     console.log("New Combo:", newCombo);
  //     toast.success("Thêm combo thành công!");
  //     navigate(-1);
  //   } catch (error) {
  //     console.error("Error creating combo:", error);
  //     toast.error("Thêm combo thất bại!");
  //   }
  // };

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

  // const handleDishChange = (dishId, setType) => {
  //   setComboData((prevData) => {
  //     const updatedComboFoodRequests = [...prevData.comboFoodRequests];
  //     updatedComboFoodRequests[setType === setMainFoodId ? 0 : 1].foodId =
  //       dishId;

  //     return {
  //       ...prevData,
  //       comboFoodRequests: updatedComboFoodRequests,
  //     };
  //   });
  //   setType(dishId);
  // };

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
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Tạo mới combo
      </Typography>
      <Paper className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-create-combo">
            <Typography className="label-form-create" gutterBottom>
              Tên combo
            </Typography>
            <TextField
              placeholder="Thêm tên của combo"
              variant="outlined"
              id="text-field-form"
              name="name"
              value={comboData.name}
              onChange={handleInputChange}
              required
            />
            <Typography className="label-form-create" gutterBottom>
              Nội dung
            </Typography>
            <TextField
              placeholder="Mô tả combo"
              id="text-field-form"
              name="content"
              value={comboData.content}
              onChange={handleInputChange}
              required
            />
            <Typography className="label-form-create" gutterBottom>
              Hình ảnh
            </Typography>
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              name="image"
              onChange={handleInputChange}
              required
            />

            <div>
              <Typography className="label-form-create" gutterBottom>
                Món chính
              </Typography>
              <RadioGroup
                value={mainCategory}
                onChange={(e) =>
                  handleCategoryChange(e.target.value, setMainCategory)
                }
              >
                {categoryResponses.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    value={category.id.toString()}
                    control={<Radio />}
                    label={category.name}
                  />
                ))}
              </RadioGroup>
              {mainCategory && (
                <Select
                  value={mainFoodId}
                  onChange={(e) =>
                    handleDishChange(e.target.value, setMainFoodId)
                  }
                  label="Chọn món ăn"
                >
                  {mainDishes.map((dish) => (
                    <MenuItem key={dish.id} value={dish.id}>
                      {dish.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>

            <div>
              <Typography className="label-form-create" gutterBottom>
                Món phụ
              </Typography>
              <RadioGroup
                value={sideCategory}
                onChange={(e) =>
                  handleCategoryChange(e.target.value, setSideCategory)
                }
              >
                {categoryResponses.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    value={category.id.toString()}
                    control={<Radio />}
                    label={category.name}
                  />
                ))}
              </RadioGroup>
              {sideCategory && (
                <Select
                  value={sideFoodId}
                  onChange={(e) =>
                    handleDishChange(e.target.value, setSideFoodId)
                  }
                  label="Chọn món ăn"
                >
                  {sideDishes.map((dish) => (
                    <MenuItem key={dish.id} value={dish.id}>
                      {dish.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              id="create-combo-btn"
            >
              Tạo mới
            </Button>
            <Button
              variant="outlined"
              color="error"
              id="cancel-combo-btn"
              onClick={openCancelDialog}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Paper>
      <Dialog
        open={isCancelDialogOpen}
        onClose={closeCancelDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn hủy thêm combo không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCancelDialog} color="primary">
            Không
          </Button>
          <Button onClick={() => navigate(-1)} color="error" autoFocus>
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateCombo;
