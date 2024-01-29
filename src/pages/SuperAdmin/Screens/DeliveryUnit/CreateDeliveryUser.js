import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import roleAPI from "../../../../services/roleAPI";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import userAPI from "../../../../services/userAPI";
const CreateDeliveryUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deliveryUnitId } = location.state || {};
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    roleName: "",
  });
  const imageRef = useRef();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const result = await roleAPI.getRole(deliveryUnitId);
        setRoles(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRole();
  }, [deliveryUnitId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageRef.current.files[0]) {
      data.append("image", imageRef.current.files[0]);
    }
    data.append("deliveryUnitId", deliveryUnitId);

    try {
      await userAPI.createUnitUser(data);
      navigate("/success"); // Or wherever you want to redirect after success
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h6">Create Management User</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.roleName}
            label="Role"
            name="roleName"
            onChange={handleInputChange}
          >
            {roles.map((role, index) => (
              <MenuItem key={index} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <input
          type="file"
          ref={imageRef}
          accept="image/*"
          style={{ margin: "10px 0" }}
        />
        <Button type="submit" variant="contained" color="primary">
          Create User
        </Button>
      </form>
    </Container>
  );
};

export default CreateDeliveryUser;
