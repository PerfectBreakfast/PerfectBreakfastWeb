import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Button,
  Paper,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Modal,
  Box,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Dish/Dish.css";
import {
  StyledTableCell,
  StyledTableRow,
} from "../Table/StyledTableComponents";
import "../Table/Table.css";
import { useNavigate } from "react-router-dom";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";
import managementUnitAPI from "../../../../services/managementUnitAPI";

const SupplierUnitList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [supplierUnits, setSupplierUnits] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [managementUnits, setManagementUnits] = useState([]);
  const [newSupplierData, setNewSupplierData] = useState({
    name: "",
    address: "",
  });
  const [isAssignManagerModalOpen, setAssignManagerModalOpen] = useState(false);
  const [
    selectedSupplierUnitForAssignment,
    setSelectedSupplierUnitForAssignment,
  ] = useState(null);
  const [selectedManagementUnit, setSelectedManagementUnit] = useState("");

  useEffect(() => {
    fetchSupplierUnits();
    fetchManagementUnits();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchSupplierUnits = async () => {
    try {
      const response = await supplierUnitAPI.getSupplierUnitByPagination(
        searchTerm,
        pageIndex
      );
      setSupplierUnits(response.items);
      setTotalPages(response.totalPagesCount);
    } catch (error) {
      console.error("Error fetching supplier units:", error);
      toast.error("Error fetching supplier units");
    }
  };

  const fetchManagementUnits = async () => {
    try {
      const response = await managementUnitAPI.getAllManagementUnit();
      setManagementUnits(response);
    } catch (error) {
      console.error("Error fetching units:", error);
      toast.error("Error fetching units");
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
    setAssignManagerModalOpen(false);
    setModalOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle the creation of a new supplier unit
  const handleCreateData = async () => {
    try {
      // Validate the input data before making the API call
      if (!newSupplierData.name || !newSupplierData.address) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Make the API call to create a new supplier unit
      const createdSupplier = await supplierUnitAPI.createSupplierUnit(
        newSupplierData
      );

      // Display a success message
      toast.success("Thêm nhà cung cấp thành công!");

      // Close the modal and refresh the list of supplier units
      handleCloseModal();
      fetchSupplierUnits();
    } catch (error) {
      console.error("Error creating supplier unit:", error);
      toast.error("Error creating supplier unit");
    }
  };

  const handleOpenAssignManagerModal = (supplierUnit) => {
    setAssignManagerModalOpen(true);
    setSelectedSupplierUnitForAssignment(supplierUnit);
    console.log("test", selectedSupplierUnitForAssignment);
  };

  const handleAssignManager = async () => {
    try {
      // Validate selected management unit
      if (!selectedManagementUnit) {
        toast.error("Vui lòng chọn một quản lý.");
        return;
      }

      // Make the API call to assign a manager to the supplier unit
      await supplierUnitAPI.supplyAssigment({
        supplierId: selectedSupplierUnitForAssignment.id,
        managementUnitId: selectedManagementUnit,
      });
      // setAssignManagerModalOpen(false);
      // Display a success message
      toast.success("Gán quản lý thành công!");

      // Close the modal and refresh the list of supplier units
      handleCloseModal();
      fetchSupplierUnits();
    } catch (error) {
      console.error("Error assigning manager:", error);
      toast.error("Error assigning manager");
    }
  };
  const handleAddEmployeeClick = (id) => {
    navigate("create-supplier-user", { state: { supplierUnitId: id } });
    console.log(id);
  };
  return (
    <>
      <div className="table-content-container container">
        <h2 className="table-title">Danh sách nhà cung cấp</h2>
        <div className="create-btn">
          <Button id="create-btn" variant="contained" onClick={handleOpenModal}>
            Thêm nhà cung cấp
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
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supplierUnits.map((supplierUnit) => (
                  <StyledTableRow key={supplierUnit.id}>
                    <StyledTableCell>{supplierUnit.name}</StyledTableCell>
                    <StyledTableCell>{supplierUnit.address}</StyledTableCell>
                    <StyledTableCell>
                      {supplierUnit.memberCount}
                    </StyledTableCell>
                    <StyledTableCell>
                      {supplierUnit.owners.length === 0 ? (
                        <Button
                          onClick={() =>
                            handleAddEmployeeClick(supplierUnit.id)
                          }
                        >
                          Thêm nhân viên
                        </Button>
                      ) : (
                        // Hiển thị một thông báo hoặc không hiển thị gì cả nếu owners không rỗng
                        <span>{supplierUnit.owners}</span>
                      )}
                      {supplierUnit.managementUnitName.length === 0 ? (
                        <Button
                          onClick={() =>
                            handleOpenAssignManagerModal(supplierUnit)
                          }
                        >
                          Gán quản lý
                        </Button>
                      ) : (
                        // Hiển thị một thông báo hoặc không hiển thị gì cả nếu owners không rỗng
                        <span>Chỉ hiển thị khi có quản lý quản lý</span>
                      )}
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
            value={newSupplierData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={newSupplierData.address}
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
      <Modal
        open={isAssignManagerModalOpen}
        onClose={() => setAssignManagerModalOpen(false)}
      >
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
          <h2>Gán quản lý cho {selectedSupplierUnitForAssignment?.name}</h2>
          {/* Similar to the previous Modal, include a Select for choosing the management unit */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="managementUnitSelectLabel">Chọn quản lý</InputLabel>
            <Select
              labelId="managementUnitSelectLabel"
              id="managementUnitSelect"
              value={selectedManagementUnit}
              onChange={(e) => setSelectedManagementUnit(e.target.value)}
            >
              {managementUnits.map((managementUnit) => (
                <MenuItem key={managementUnit.id} value={managementUnit.id}>
                  {managementUnit.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="create-btn-modal">
            <Button
              id="create-btn"
              variant="contained"
              onClick={handleAssignManager}
            >
              Gán quản lý
            </Button>
          </div>
        </Box>
      </Modal>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default SupplierUnitList;
