import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Grid,
  Link,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import userAPI from "../../../services/userAPI";
import logo from "../../../assets/images/logo.png";
import "./Signup.css"; // Import CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    companyId: "",
  });

  const [companies, setCompanies] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Fetch the list of companies when the component mounts
    const fetchCompanies = async () => {
      try {
        const companyList = await userAPI.getCompanies();
        setCompanies(companyList);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleCompanySelect = (e) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      companyId: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await userAPI.register(userData);
      console.log("Registration successful", data);
      // toast.error("Email hoặc mật khẩu không chính xác");
    } catch (error) {
      // setErrorMessage(error.errors);
      toast.error("Đăng ký thất bại");
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="containerRegister">
      <CssBaseline />
      <div>
        <img src={logo} alt="Logo" className="logo" />

        <Typography component="h2" variant="h6">
          Đăng ký
        </Typography>

        <form onSubmit={handleRegister} className="formRegister">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={userData.email}
                onChange={handleInputChange}
                size="small"
                className="inputField"
                InputProps={{ fullWidth: true, style: { borderRadius: 20 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Mật khẩu"
                type="password"
                name="password"
                autoComplete="current-password"
                value={userData.password}
                onChange={handleInputChange}
                size="small"
                className="inputField"
                InputProps={{ fullWidth: true, style: { borderRadius: 20 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="SDT"
                type="number"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                size="small"
                className="inputField"
                InputProps={{ fullWidth: true, style: { borderRadius: 20 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="companyId-label">Tên công ty</InputLabel>
                <Select
                  labelId="companyId-label"
                  id="companyId"
                  required
                  fullWidth
                  value={userData.companyId}
                  onChange={handleCompanySelect}
                  label="Tên công ty"
                  className="inputField"
                  size="small"
                  style={{ borderRadius: 20 }}
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            id="registerButton"
          >
            Đăng ký
          </Button>
        </form>
      </div>
      <div className="registerLink">
        Đã có tài khoản? <Link href="/login">Đăng nhập ngay</Link>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default Signup;
