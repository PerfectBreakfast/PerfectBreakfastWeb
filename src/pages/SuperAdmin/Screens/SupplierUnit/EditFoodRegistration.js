import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import SupplierCommissionRateAPI from "../../../../services/SupplierCommissionRateAPI";
import { toast } from "react-toastify";

// Đảm bảo đã gọi Modal.setAppElement("#root") ở nơi nào đó trong ứng dụng của bạn,
// nếu "#root" là ID của phần tử root của ứng dụng React của bạn.

const EditFoodRegistration = ({ onClose, commissionRateId }) => {
  const [foodRegistrationData, setFoodRegistrationData] = useState(null);
  const [commissionRate, setCommissionRate] = useState("");

  useEffect(() => {
    const fetchFoodRegistrationData = async () => {
      try {
        const response = await SupplierCommissionRateAPI.getFoodRegistration(
          commissionRateId
        );
        setFoodRegistrationData(response);
        setCommissionRate(response.commissionRate); // Set giá trị ban đầu cho commissionRate
      } catch (error) {
        console.error("Failed to fetch food registration data", error);
        toast.error("Lỗi khi tải dữ liệu đăng ký món ăn");
      }
    };

    if (commissionRateId) {
      fetchFoodRegistrationData();
    }
  }, [commissionRateId]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await SupplierCommissionRateAPI.editFoodRegistration(commissionRateId, {
        commissionRate: Number(commissionRate),
      });
      toast.success("Cập nhật hoa hồng thành công!");
      onClose(); // Gọi onClose sau khi cập nhật thành công
    } catch (error) {
      console.error("Failed to update commission rate", error);
      toast.error("Lỗi khi cập nhật hoa hồng");
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Chỉnh Sửa Đăng Ký Món Ăn"
      style={{
        overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "2rem",
          borderRadius: "0.5rem",
          maxWidth: "500px",
          width: "90%",
        },
      }}
    >
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-3">Chỉnh sửa</h2>
        <form onSubmit={handleEditSubmit}>
          <div className="mb-1">
            <label htmlFor="commissionRate" className="label-input">
              Tỷ lệ hoa hồng
            </label>
            <input
              className="input-form"
              id="commissionRate"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button className="btn-confirm" type="submit">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditFoodRegistration;
