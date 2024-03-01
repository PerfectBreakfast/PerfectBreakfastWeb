import React, { useEffect, useState } from "react";
import comboAPI from "../../../../services/comboAPI";
import menuAPI from "../../../../services/menuAPI";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EditMenu = () => {
  const { id } = useParams();
  const [combos, setCombos] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [menuName, setMenuName] = useState("");
  const navigate = useNavigate();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const comboData = await comboAPI.getAllCombo();
        setCombos(comboData);
      } catch (error) {
        // Handle error fetching combo data
      }
    };
    const fetchMenuData = async () => {
      try {
        const menuData = await menuAPI.getMenuById(id);
        setMenu(menuData);
        setMenuName(menuData.name);
        // Cập nhật các combo đã chọn dựa trên dữ liệu fetchMenuData
        const selectedComboIds = menuData.comboFoodResponses.map(
          (combo) => combo.id
        );
        setSelectedCombos(selectedComboIds);
      } catch (error) {
        // Handle error fetching combo data
      }
    };
    fetchMenuData();
    fetchComboData();
  }, [id]);

  const handleCheckboxChange = (comboId) => {
    setSelectedCombos((prevSelectedCombos) => {
      const updatedCombos = prevSelectedCombos.includes(comboId)
        ? prevSelectedCombos.filter((id) => id !== comboId)
        : [...prevSelectedCombos, comboId];

      console.log("test", updatedCombos); // Sử dụng giá trị mới ở đây

      return updatedCombos;
    });
  };

  const handleEditMenu = async () => {
    try {
      const menuData = {
        name: menuName,
        menuFoodRequests: selectedCombos.map((comboId) => ({ comboId })),
      };

      await menuAPI.editMenu(id, menuData);

      console.log("New menu:", menuData);
      toast.success("Thêm menu thành công!");
      navigate(-1);
    } catch (error) {
      console.error("Error creating menu:", error);
      toast.error("Thêm menu thất bại!");
    }
  };
  const openCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };
  const closeCancelDialog = () => {
    setIsCancelDialogOpen(false);
  };

  return (
    <Container sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Chỉnh sửa menu
      </Typography>
      <Paper className="create-menu-form container">
        <Typography className="label-form-create" gutterBottom>
          Tên menu
        </Typography>
        <TextField
          placeholder="Thêm tên của menu"
          variant="outlined"
          id="text-field-form"
          name="name"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          required
          fullWidth
        />

        <div>
          <Typography className="label-form-create" gutterBottom>
            Chọn combo
          </Typography>
          <TableContainer className="table-selecting" component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell id="create-menu-title">Tên combo</TableCell>
                  <TableCell id="create-menu-title">Món ăn</TableCell>
                  <TableCell id="create-menu-title">Chú thích</TableCell>
                  <TableCell id="create-menu-title">Giá combo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combos.map((combo) => (
                  <TableRow key={combo.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCombos.includes(combo.id)}
                        onChange={() => handleCheckboxChange(combo.id)}
                      />
                    </TableCell>
                    <TableCell>{combo.name}</TableCell>
                    <TableCell>{combo.foods}</TableCell>
                    <TableCell>{combo.content}</TableCell>
                    <TableCell>
                      {combo.comboPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditMenu}
            id="create-combo-btn"
          >
            Chỉnh sửa
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
      </Paper>
      {/* <button onClick={handleCreateMenu}>Create Menu</button> */}
      <Dialog
        open={isCancelDialogOpen}
        onClose={closeCancelDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn hủy thêm menu không?
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

export default EditMenu;
