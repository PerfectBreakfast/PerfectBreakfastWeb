import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryAPI from "../../../../services/categoryAPI";
import comboAPI from "../../../../services/comboAPI";
import { toast } from "react-toastify";

const EditCombo = () => {
  const navigate = useNavigate();
  const [mainFoodId, setMainFoodId] = useState([]);
  const [sideFoodId, setSideFoodId] = useState([]);
  const { id } = useParams();
  const [comboData, setComboData] = useState({
    name: "",
    content: "",
    FoodId: [], // This will hold the IDs of main and side dishes
    image: null,
  });

  const [file, setFile] = useState(null);
  const [originalImage, setOriginalImage] = useState("");
  const fileInputRef = useRef(null);

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const [categoryResponses, setCategoryResponses] = useState([]);

  const [mainCategory, setMainCategory] = useState(null);
  const [sideCategory, setSideCategory] = useState(null);

  const [mainDishes, setMainDishes] = useState([]);
  const [sideDishes, setSideDishes] = useState([]);

  const [categoryId, setCategoryId] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategory();
        setCategoryResponses(response);
      } catch (error) {
        console.error("Error fetching food responses:", error);
      }
    };
    // const fetchComboData = async () => {
    //   try {
    //     const data = await comboAPI.getComboById(id);
    //     setComboData(data);
    //     // Giả sử món chính là phần tử đầu tiên và món phụ là phần tử thứ hai
    //     // trong mảng foodResponses
    //     if (data.foodResponses.length > 0) {
    //       setMainCategory(data.foodResponses[0].categoryResponse.id);
    //       setMainFoodId(data.foodResponses[0].id);
    //     }
    //     if (data.foodResponses.length > 1) {
    //       setSideCategory(data.foodResponses[1].categoryResponse.id);
    //       setSideFoodId(data.foodResponses[1].id);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching dish data:", error);
    //   }
    // };

    const fetchComboData = async () => {
      try {
        const data = await comboAPI.getComboById(id);
        setComboData((prev) => ({
          ...prev,
          name: data.name,
          content: data.content,
          FoodId: [data.foodResponses[0]?.id, data.foodResponses[1]?.id],
          image: data.image, // Bạn cần cân nhắc làm thế nào để xử lý hình ảnh đã được chọn
        }));
        setOriginalImage(data.image);
        // Đảm bảo rằng món chính và phụ đều được khởi tạo đúng giá trị
        if (data.foodResponses.length > 0) {
          setMainCategory(data.foodResponses[0].categoryResponse.id);
          setMainFoodId(data.foodResponses[0].id);
          // Fetch và set món chính tại đây
          fetchDishes(data.foodResponses[0].categoryResponse.id, setMainDishes);
        }
        if (data.foodResponses.length > 1) {
          setSideCategory(data.foodResponses[1].categoryResponse.id);
          setSideFoodId(data.foodResponses[1].id);
          // Fetch và set món phụ tại đây
          fetchDishes(data.foodResponses[1].categoryResponse.id, setSideDishes);
        }
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchComboData();
    fetchCategories();
    fetchDishes();
  }, [id, categoryId]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFile(file);
      if (file) {
        const newImageURL = URL.createObjectURL(file);
        setComboData({ ...comboData, image: newImageURL });
      }
    } else {
      // For other inputs, update as usual
      setComboData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setComboData({ ...comboData, image: originalImage });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };
  const closeCancelDialog = () => {
    setIsCancelDialogOpen(false);
  };

  // const handleCategoryChange = (category, setType) => {
  //   setType(category);
  //   // Fetch dishes based on the selected category
  //   fetchDishes(
  //     category,
  //     setType === setMainCategory ? setMainDishes : setSideDishes
  //   );
  // };

  const handleCategoryChange = (categoryId, setType, setDishesFunc) => {
    setType(categoryId);
    fetchDishes(categoryId, setDishesFunc);
  };

  // const fetchDishes = async (categoryId, setDishes) => {
  //   try {
  //     const response = await categoryAPI.getFoodByCategory(categoryId);
  //     setDishes(response[0]?.foodResponse || []); // Updated this line
  //   } catch (error) {
  //     console.error("Error fetching dishes:", error);
  //   }
  // };

  // Cập nhật fetchDishes để không cần truyền categoryId, setDishes vì nó sẽ được gọi từ context phù hợp
  const fetchDishes = async (categoryId, setDishesFunc) => {
    if (!categoryId) return; // Đảm bảo categoryId hợp lệ
    try {
      const response = await categoryAPI.getFoodByCategory(categoryId);
      setDishesFunc(response[0]?.foodResponse || []);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const handleDishChange = (dishId, setType) => {
    setComboData((prevData) => ({
      ...prevData,
      FoodId:
        setType === setMainFoodId
          ? [dishId, prevData.FoodId[1]]
          : [prevData.FoodId[0], dishId],
    }));
    setType(dishId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("name", comboData.name);
      formData.append("content", comboData.content);

      if (file) {
        formData.append("image", file);
      } else {
        // Xử lý nếu không chọn ảnh mới (ví dụ: gửi thông tin không thay đổi ảnh)
        // formData.append("image", comboData.image);
      }

      // Append FoodId array to the formData
      comboData.FoodId.forEach((id, index) => {
        formData.append(`FoodId[${index}]`, id);
      });

      // Use formData for the API call
      const newCombo = await comboAPI.editCombo(id, formData);
      console.log("New Combo:", newCombo);
      toast.success("Thêm combo thành công!");
      navigate(-1);
    } catch (error) {
      console.error("Error creating combo:", error);
      toast.error("Thêm combo thất bại!");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h5 className="text-xl font-bold mb-4">Sửa combo</h5>
      <div className="bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="form-create-combo">
            <p className="text-md mb-2">Tên combo</p>
            <input
              className="placeholder-gray-500 border-2 rounded-md p-4 w-full mb-4"
              placeholder="Thêm tên của combo"
              type="text"
              id="text-field-form"
              name="name"
              value={comboData.name}
              onChange={handleInputChange}
              required
            />

            <p className="text-md mb-2">Nội dung</p>
            <input
              className="placeholder-gray-500 border-2 rounded-md p-4 w-full mb-4"
              placeholder="Mô tả combo"
              type="text"
              id="text-field-form"
              name="content"
              value={comboData.content}
              onChange={handleInputChange}
              required
            />

            <p className="text-md mb-2">Hình ảnh</p>
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleInputChange}
                name="image"
              />
              {comboData.image && (
                <div>
                  <img
                    src={comboData.image}
                    alt="Combo Preview"
                    style={{ width: "100px" }}
                  />
                  {file && (
                    <button onClick={handleRemoveImage}>Xóa Hình Ảnh</button>
                  )}
                </div>
              )}
            </div>

            <div>
              <p className="text-md mb-2">Món chính</p>
              <div className="mb-4">
                {categoryResponses.map((category) => (
                  <label
                    key={category.id}
                    className="inline-flex items-center mr-2"
                  >
                    <input
                      type="radio"
                      name="mainCategory"
                      value={category.id}
                      onChange={(e) =>
                        handleCategoryChange(
                          e.target.value,
                          setMainCategory,
                          setMainDishes
                        )
                      }
                      checked={mainCategory === category.id}
                      className="form-radio"
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
              {mainCategory && (
                <select
                  className="border-2 rounded-md p-2 w-full mb-4"
                  value={mainFoodId}
                  onChange={(e) =>
                    handleDishChange(e.target.value, setMainFoodId)
                  }
                >
                  {mainDishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <p className="text-md mb-2">Món phụ</p>
              <div className="mb-4">
                {categoryResponses.map((category) => (
                  <label
                    key={category.id}
                    className="inline-flex items-center mr-2"
                  >
                    <input
                      type="radio"
                      name="sideCategory"
                      value={category.id}
                      onChange={(e) =>
                        handleCategoryChange(
                          e.target.value,
                          setSideCategory,
                          setSideDishes
                        )
                      }
                      checked={sideCategory === category.id}
                      className="form-radio"
                    />
                    <span className="ml-2">{category.name}</span>
                  </label>
                ))}
              </div>
              {sideCategory && (
                <select
                  className="border-2 rounded-md p-2 w-full mb-4"
                  value={sideFoodId}
                  onChange={(e) =>
                    handleDishChange(e.target.value, setSideFoodId)
                  }
                >
                  {sideDishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                id="create-combo-btn"
              >
                Tạo mới
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                id="cancel-combo-btn"
                onClick={openCancelDialog}
              >
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Dialog */}
      {isCancelDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <p className="text-md leading-relaxed">
                Bạn có chắc chắn muốn hủy sửa combo không?
              </p>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-auto"
                  onClick={closeCancelDialog}
                >
                  Không
                </button>
                <button
                  className="px-4 py-2 ml-3 bg-red-500 text-white text-base font-medium rounded-md w-auto"
                  onClick={() => navigate(-1)}
                >
                  Có
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCombo;
