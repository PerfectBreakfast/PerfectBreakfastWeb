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
import companyAPI from "../../../../services/companyAPI";

const CompanyList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [companiesData, setCompaniesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchCompany();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchCompany = async () => {
    try {
      const response = await companyAPI.getCompanyUnitByPagination(
        // searchTerm,
        pageIndex
      );
      setCompaniesData(response.items);
      setTotalPages(response.totalPagesCount);
    } catch (error) {
      console.error("Error fetching company :", error);
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

  return (
    <>
      <div className="table-content-container container">
        <h2 className="table-title">Danh sách công ty</h2>
        <div className="create-btn">
          <Link to="create">
            <Button id="create-btn" variant="contained">
              Thêm công ty
            </Button>
          </Link>
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
                  <StyledTableCell>Số điện thoại</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Giờ làm việc</StyledTableCell>
                  <StyledTableCell>Nhân viên</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companiesData.map((companyUnit) => (
                  <StyledTableRow key={companyUnit.id}>
                    <StyledTableCell>{companyUnit.name}</StyledTableCell>
                    <StyledTableCell>{companyUnit.address}</StyledTableCell>
                    <StyledTableCell>{companyUnit.phoneNumber}</StyledTableCell>
                    <StyledTableCell>{companyUnit.email}</StyledTableCell>
                    <StyledTableCell>
                      {companyUnit.startWorkHour}
                    </StyledTableCell>
                    <StyledTableCell>{companyUnit.memberCount}</StyledTableCell>
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
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CompanyList;
