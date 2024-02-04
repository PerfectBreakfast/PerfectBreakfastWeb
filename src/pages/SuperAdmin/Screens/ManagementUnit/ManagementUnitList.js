import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import managementUnitAPI from "../../../../services/managementUnitAPI";
import { ReactComponent as Search } from "../../../../assets/icons/search.svg";

const ManagementUnitList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [managementUnits, setManagementUnits] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [newManagementData, setNewManagementData] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    fetchManagementUnits();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchManagementUnits = async () => {
    try {
      const response = await managementUnitAPI.getManagementUnitByPagination(
        searchTerm,
        pageIndex
      );
      setManagementUnits(response.items);
      setTotalPages(response.totalPagesCount);
    } catch (error) {
      console.error("Error fetching management units:", error);
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
    setNewManagementData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateData = async () => {
    try {
      // Validate the input data before making the API call
      if (!newManagementData.name || !newManagementData.address) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const createdManagement = await managementUnitAPI.createManagementUnit(
        newManagementData
      );

      // Display a success message
      toast.success("Thêm đối tác thành công!");

      handleCloseModal();
      fetchManagementUnits();
    } catch (error) {
      console.error("Error creating management unit:", error);
      toast.error("Error creating management unit");
    }
  };
  const handleAddEmployeeClick = (id) => {
    navigate("create-management-user", { state: { partnerId: id } });
    console.log(id);
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Danh sách đối tác</h2>

        <div className="flex justify-between items-center mb-4">
          <button
            id="create-btn"
            className="rounded-2xl bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={handleOpenModal}
          >
            Thêm đối tác
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
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Tên công ty</th>
                <th className="py-3 px-6">Địa chỉ</th>
                <th className="py-3 px-6">Quản trị viên</th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {managementUnits.map((managementUnit) => (
                <tr
                  key={managementUnit.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{managementUnit.name}</td>
                  <td className="py-3 px-6 text-left">
                    {managementUnit.address}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <ul>
                      {managementUnit.owners.map((owner, index) => (
                        <li key={index}>{owner}</li>
                      ))}
                    </ul>
                  </td>

                  <td className="py-3 px-6 text-left">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
                      onClick={() => handleAddEmployeeClick(managementUnit.id)}
                    >
                      Thêm QTV
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
      <Modal
        className="rounded-3xl"
        open={isModalOpen}
        onClose={handleCloseModal}
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
          <h2>Tạo mới đối tác</h2>
          <TextField
            label="Tên công ty"
            name="name"
            value={newManagementData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={newManagementData.address}
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

export default ManagementUnitList;
