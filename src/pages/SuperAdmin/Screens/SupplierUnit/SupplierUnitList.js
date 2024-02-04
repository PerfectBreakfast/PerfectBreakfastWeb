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
import { ReactComponent as Search } from "../../../../assets/icons/search.svg";

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
    phoneNumber: "",
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
        partnerId: selectedManagementUnit,
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
    console.log("id", id);
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Danh sách nhà cung cấp</h2>

        <div className="flex justify-between items-center mb-4">
          <button
            id="create-btn"
            className="rounded-2xl bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={handleOpenModal}
          >
            Thêm nhà cung cấp
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
          <table className=" w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 w-1/6 break-words">Tên công ty</th>
                <th className="py-3 px-6 w-1/6 break-words">Địa chỉ</th>
                <th className="py-3 px-6 w-1/6 break-words">Số điện thoại</th>
                <th className="py-3 px-6 w-1/6 break-words">Quản trị viên</th>
                <th className="py-3 px-6 w-1/6 break-words">Đối tác</th>
                <th className="py-3 px-6 w-1/6 break-words"></th>
              </tr>
            </thead>

            <tbody className="text-gray-600 text-sm font-light">
              {supplierUnits.map((supplierUnit) => (
                <tr
                  key={supplierUnit.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{supplierUnit.name}</td>
                  <td className="py-3 px-6 text-left whitespace-normal break-words">
                    {supplierUnit.address}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {supplierUnit.phoneNumber}
                  </td>

                  <td className="py-3 px-6 text-left">
                    <ul>
                      {supplierUnit.owners.map((owner, index) => (
                        <li key={index}>{owner}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <ul>
                      {supplierUnit.managementUnitName.map((unit, index) => (
                        <li key={index}>{unit}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-6 text-left flex flex-col gap-y-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
                      onClick={() => handleAddEmployeeClick(supplierUnit.id)}
                    >
                      Thêm QTV
                    </button>

                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
                      onClick={() => handleOpenAssignManagerModal(supplierUnit)}
                    >
                      Gán quản lý
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-container mt-4">
            <Pagination
              componentName="div"
              count={totalPages}
              page={pageIndex + 1}
              onChange={handlePageChange}
            />
          </div>
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
          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={newSupplierData.phoneNumber}
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
