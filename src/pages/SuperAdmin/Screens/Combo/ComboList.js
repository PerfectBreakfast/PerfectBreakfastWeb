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
import comboAPI from "../../../../services/comboAPI";
import { Link, useNavigate } from "react-router-dom";
import "../Combo/Combo.css";
import {
  StyledTableCell,
  StyledTableRow,
} from "../Table/StyledTableComponents";

const Combos = () => {
  const [combos, setCombos] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const result = await comboAPI.getComboByPagination(pageIndex);
        setCombos(result.items);
        setTotalPages(result.totalPagesCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCombo();
  }, [pageIndex]);

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  const handleDetailClick = (comboId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/combo/${comboId}`);
  };

  return (
    <>
      <div className="table-content-container container">
        <h2 className="table-title">Danh sách combo</h2>
        <div className="create-btn">
          <Link to="create">
            <Button id="create-btn" variant="contained">
              Thêm Combo
            </Button>
          </Link>
        </div>

        <div className="table-container">
          <Paper className="table">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Hình ảnh</StyledTableCell>
                  <StyledTableCell>Tên Combo</StyledTableCell>
                  <StyledTableCell>Món ăn</StyledTableCell>
                  <StyledTableCell>Giá</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combos.map((combo) => (
                  <StyledTableRow key={combo.id}>
                    <StyledTableCell>
                      <img
                        src={combo.image}
                        alt={combo.name}
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
                        onClick={() => handleDetailClick(combo.id)}
                      >
                        {combo.name}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell>{combo.foods}</StyledTableCell>
                    <StyledTableCell>
                      {combo.comboPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
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
    </>
  );
};

export default Combos;
