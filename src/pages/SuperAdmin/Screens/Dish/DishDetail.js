import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    <Container className="mt-3">
      <Typography gutterBottom variant="h5" component="div">
        Chi tiết món ăn
      </Typography>
      <Card>
        <Container style={{ position: "relative", padding: "20px" }}>
          <IconButton
            style={{
              color: " red",
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1,
            }}
          >
            <ClearIcon />
          </IconButton>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                style={{
                  width: "80%",
                  aspectRatio: "1/1",
                  margin: "auto",
                  borderRadius: "20px",
                }}
                image={dishData.image}
                alt={dishData.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  {dishData.categoryResponse.name}
                </Typography>
                <Typography gutterBottom variant="h4" component="div">
                  {dishData.name}
                </Typography>
                <Typography variant="subtitle1" component="div"></Typography>
                <Typography gutterBottom variant="h6" color="text.secondary">
                  {dishData.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Tenetur ex, dolor fugit accusantium tempore quidem dolorem
                  dolore, a ea necessitatibus nostrum officia voluptatibus unde
                  minima, laboriosam eveniet ut nisi commodi.
                </Typography>
                <Button id="btn-update-detail" variant="contained" size="large">
                  Chỉnh sửa món ăn
                </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Container>
      </Card>
    </Container>
  );
};

export default DishDetail;
