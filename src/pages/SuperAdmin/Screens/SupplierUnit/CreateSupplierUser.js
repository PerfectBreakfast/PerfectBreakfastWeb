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
import { toast } from "react-toastify";

const CreateSupplierUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { supplierUnitId } = location.state || {};
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    roleName: "",
  });
  const imageRef = useRef();
  console.log("test", supplierUnitId);
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const result = await roleAPI.getRole(supplierUnitId);
        setRoles(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRole();
  }, [supplierUnitId]);

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
    data.append("supplierId", supplierUnitId);

    try {
      await userAPI.createUnitUser(data);
      toast.success("Thêm quản trị viên thành công!");
      navigate(-1); // Or wherever you want to redirect after success
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h6 className="text-xl font-bold mb-4">Tạo quản trị viên đối tác</h6>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <input
            className="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm w-full px-3 py-2"
            placeholder="Tên người dùng"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <input
            className="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm w-full px-3 py-2"
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <input
            className="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm w-full px-3 py-2"
            placeholder="Số điện thoại"
            name="phoneNumber"
            type="text"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4 w-full">
          <select
            className="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm w-full px-3 py-2"
            name="roleName"
            value={formData.roleName}
            onChange={handleInputChange}
          >
            {roles.map((role, index) => (
              <>
                <option value="">Chọn chức năng</option>
                <option key={index} value={role.name}>
                  {role.name}
                </option>
              </>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <input
            type="file"
            ref={imageRef}
            accept="image/*"
            className="w-full"
          />
        </div>
        {/* <div className="mb-4">
<label className="block">
  {selectedImage 
    ? <img src={selectedImage} alt="Preview" className="w-full h-auto" />
    : <span className="text-gray-700">Chưa có hình ảnh</span>
  }
</label>
<input
  type="file"
  accept="image/*"
  className="w-full"
  onChange={handleImageChange}
/>
</div> */}

        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Tạo mới
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSupplierUser;
