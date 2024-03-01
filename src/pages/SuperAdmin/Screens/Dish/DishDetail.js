import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dishAPI from "../../../../services/dishAPI";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import "../Table/Table.css";
import "../Dish/Dish.css";

const DishDetail = () => {
  const { id } = useParams();
  const [dishData, setDishData] = useState(null);

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        const data = await dishAPI.getDishById(id);
        setDishData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchDishData();
  }, [id]);

  if (!dishData) {
    return (
      <Container className="mt-3">
        <Typography gutterBottom variant="h5" component="div"></Typography>
        <Card>
          <Container style={{ position: "relative", padding: "20px" }}>
            <Skeleton
              variant="rectangular"
              style={{
                width: 40,
                height: 40,
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1,
              }}
            />
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Skeleton
                  variant="rectangular"
                  style={{
                    width: "80%",
                    aspectRatio: "1/1",
                    margin: "auto",
                    borderRadius: "20px",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color="text.secondary"
                  >
                    <Skeleton variant="text" width={100} />
                  </Typography>
                  <Typography gutterBottom variant="h4" component="div">
                    <Skeleton variant="text" width={140} />
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <Skeleton variant="text" width={120} />
                  </Typography>
                  <Typography gutterBottom variant="h6" color="text.secondary">
                    <Skeleton variant="text" width={80} />
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    color="text.secondary"
                  >
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </Typography>
                  <Skeleton variant="rectangular" width={150} height={40} />
                </CardContent>
              </Grid>
            </Grid>
          </Container>
        </Card>
      </Container>
    );
  }

  return (
    <div className="mt-3 max-w-full mx-auto">
      <div className="text-2xl font-bold mb-4">Chi tiết món ăn</div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="relative p-5">
          <button
            className="text-red-500 absolute top-2.5 right-2.5 z-10"
            onClick={() => {
              /* function to clear or close */
            }}
          >
            {/* Replace ClearIcon with your own close icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <div className="flex flex-wrap -mx-2 justify-center">
            <div className="px-2 w-full md:w-1/2">
              <div className="aspect-w-1 aspect-h-1 w-4/5 mx-auto rounded-lg overflow-hidden">
                <img
                  src={dishData.image}
                  alt={dishData.name}
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
            <div className="px-2 w-full md:w-1/2">
              <div className="mb-4">
                <div className="text-sm text-gray-500">
                  {dishData.categoryResponse.name}
                </div>
                <div className="text-xl font-bold">{dishData.name}</div>
                <div className="text-md"></div>
                <div className="text-lg text-gray-500">
                  {dishData.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
                <Link to={"edit"}>
                  <button
                    id="btn-update-detail"
                    className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                  >
                    Chỉnh sửa món ăn
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetail;
