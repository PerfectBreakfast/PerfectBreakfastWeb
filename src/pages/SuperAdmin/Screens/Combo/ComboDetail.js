import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import comboAPI from "../../../../services/comboAPI";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const ComboDetail = () => {
  const { id } = useParams();
  const [comboData, setComboData] = useState(null);

  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const data = await comboAPI.getComboById(id);
        setComboData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchComboData();
  }, [id]);
  if (!comboData) {
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
        Chi tiết combo
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
                image={comboData.image}
                alt={comboData.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent>
                <Typography gutterBottom variant="h4" component="div">
                  {comboData.name}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  {comboData.foods}
                </Typography>
                <Typography variant="subtitle1" component="div"></Typography>
                <Typography gutterBottom variant="h6" color="text.secondary">
                  {comboData.comboPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  {comboData.content}
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Tenetur ex, dolor fugit accusantium tempore quidem dolorem
                  dolore, a ea necessitatibus nostrum officia voluptatibus unde
                  minima, laboriosam eveniet ut nisi commodi.
                </Typography>
                <Button id="btn-update-detail" variant="contained" size="large">
                  Chỉnh sửa combo
                </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Container>
      </Card>
    </Container>
  );
};

export default ComboDetail;
