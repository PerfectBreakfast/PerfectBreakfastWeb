import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Button,
  Modal,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../Table/StyledTableComponents";

const DeliveryUnitList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deliveryUnits, setDeliveryUnits] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [newDeliveryData, setNewDeliveryData] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    fetchDeliveryUnits();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchDeliveryUnits = async () => {
    try {
      const response = await deliveryUnitAPI.getDeliveryUnitByPagination(
        // searchTerm,
        pageIndex
      );
      setDeliveryUnits(response.items);
      setTotalPages(response.totalPagesCount);
    } catch (error) {
      console.error("Error fetching delivery units:", error);
      toast.error("Lỗi khi thêm dvvc");
    }
  };

  const handleSearch = async () => {
    setSearchTerm(searchInput); // Update searchTerm with searchInput
    setPageIndex(0); // Reset pageIndex to 0]
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
    const { name, value } = e.target;
    setNewDeliveryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateData = async () => {
    try {
      // Validate the input data before making the API call
      if (!newDeliveryData.name || !newDeliveryData.address) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const createdDelivery = await deliveryUnitAPI.createDeliveryUnit(
        newDeliveryData
      );

      // Display a success message
      toast.success("Thêm nhà cung cấp thành công!");

      handleCloseModal();
      fetchDeliveryUnits();
    } catch (error) {
      console.error("Error creating delivery unit:", error);
      toast.error("Error creating delivery unit");
    }
  };
  return (
    <>
      <div className="table-content-container container">
        <h2 className="table-title">Danh sách đơn vị vận chuyển</h2>
        <div className="create-btn">
          <Button id="create-btn" variant="contained" onClick={handleOpenModal}>
            Thêm đơn vị vận chuyển
          </Button>
        </div>

        <div className="search-container">
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>

        <div className="table-container">
          <Paper className="table">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Tên công ty</StyledTableCell>
                  <StyledTableCell>Địa chỉ</StyledTableCell>
                  <StyledTableCell>Nhân viên</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveryUnits.map((deliveryUnit) => (
                  <StyledTableRow key={deliveryUnit.id}>
                    <StyledTableCell>{deliveryUnit.name}</StyledTableCell>
                    <StyledTableCell>{deliveryUnit.address}</StyledTableCell>
                    <StyledTableCell>
                      {deliveryUnit.memberCount}
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
          <h2>Tạo mới nhà cung cấp</h2>
          <TextField
            label="Tên công ty"
            name="name"
            value={newDeliveryData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={newDeliveryData.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <div className="create-btn-modal">
            <Button
              id="create-btn"
              variant="contained"
              onClick={handleCreateData}
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

export default DeliveryUnitList;
