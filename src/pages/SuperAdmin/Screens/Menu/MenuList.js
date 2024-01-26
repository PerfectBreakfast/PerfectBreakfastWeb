import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import menuAPI from "../../../../services/menuAPI";
import "../Table/Table.css";
import {
  StyledTableCell,
  StyledTableRow,
} from "../Table/StyledTableComponents";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const result = await menuAPI.getMenuByPagination(pageIndex);
        setMenus(result.items);
        setTotalPages(result.totalPagesCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchMenu();
  }, [pageIndex]);

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  return (
    <div className="table-content-container container">
      <h2 className="table-title">Danh sách menu</h2>
      <div className="create-btn">
        <Link to="create">
          <Button id="create-btn" variant="contained">
            Thêm Menu
          </Button>
        </Link>
      </div>
      <div className="table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Tên menu</StyledTableCell>
                <StyledTableCell>Ngày tạo</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menus.map((menu) => (
                <StyledTableRow key={menu.id}>
                  <StyledTableCell>{menu.id}</StyledTableCell>
                  <StyledTableCell>{menu.name}</StyledTableCell>
                  <StyledTableCell>
                    {formatDate(menu.creationDate)}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="pagination-container">
          <Pagination
            componentName="div"
            count={totalPages}
            page={pageIndex + 1}
            onChange={handlePageChange}
          />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Menu;
