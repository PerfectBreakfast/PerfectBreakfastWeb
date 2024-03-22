import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
const TermOfUse = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600"
        >
          <ArrowBackIosIcon />
        </button>
        <h6 className="text-lg font-bold ml-4">Điều khoản sử dụng</h6>
      </div>
      <div className="px-8 py-6 bg-white shadow rounded-lg text-gray-700">
        <p>
          Chào mừng quý khách hàng đến với P&B, nền tảng chuyên cung cấp suất ăn
          cho công nhân viên. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân
          thủ các điều khoản và điều kiện được nêu dưới đây. Xin vui lòng đọc kỹ
          trước khi tiếp tục sử dụng dịch vụ.
        </p>

        <h2 className="font-bold text-lg">1. Giới thiệu</h2>
        <p>
          P&B cung cấp một nền tảng trực tuyến cho phép người dùng đặt suất ăn
          dành cho công nhân viên. Các dịch vụ bao gồm, nhưng không giới hạn ở,
          việc lựa chọn menu, đặt hàng trực tuyến và dịch vụ giao hàng tận nơi.
        </p>

        <h2 className="font-bold text-lg">2. Tài khoản</h2>
        <ul>
          <li>
            <strong>Đăng ký</strong>: Để sử dụng một số dịch vụ, bạn cần tạo một
            tài khoản với thông tin chính xác và cập nhật.
          </li>
          <li>
            <strong>Bảo mật</strong>: Bạn phải giữ bí mật thông tin đăng nhập và
            chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của mình.
          </li>
          <li>
            <strong>Hạn chế</strong>: Không được sử dụng tài khoản của người
            khác mà không có sự cho phép của họ.
          </li>
        </ul>

        <h2 className="font-bold text-lg">3. Quyền sở hữu trí tuệ</h2>
        <p>
          Tất cả nội dung trên website, bao gồm văn bản, hình ảnh, logo, thiết
          kế, biểu tượng thương hiệu, là tài sản của P&B hoặc được cấp phép sử
          dụng và bảo vệ theo luật sở hữu trí tuệ.
        </p>

        <h2 className="font-bold text-lg">4. Sử dụng dịch vụ</h2>
        <ul>
          <li>
            <strong>Chấp nhận</strong>: Bạn chấp nhận và đồng ý không sử dụng
            dịch vụ cho mục đích bất hợp pháp hoặc không được phép.
          </li>
          <li>
            <strong>Hạn chế</strong>: Không được sao chép, phát hành lại, tải
            lên, đăng, truyền hoặc phân phối nội dung từ dịch vụ mà không có sự
            đồng ý của P&B.
          </li>
        </ul>

        <h2 className="font-bold text-lg">5. Giao dịch</h2>
        <ul>
          <li>
            <strong>Thanh toán</strong>: Quy trình thanh toán được thực hiện
            thông qua các phương thức thanh toán an toàn và bảo mật.
          </li>
          <li>
            <strong>Hoàn trả</strong>: Chính sách hoàn trả sẽ được áp dụng theo
            quy định cụ thể của P&B.
          </li>
        </ul>
        <h2 className="font-bold text-lg">6. Giới hạn trách nhiệm</h2>
        <p>
          P&B không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc
          sử dụng hoặc không thể sử dụng dịch vụ, bao gồm nhưng không giới hạn
          ở, thiệt hại gián tiếp hoặc hậu quả.
        </p>
        <h2 className="font-bold text-lg">7. Thay đổi dịch vụ và điều khoản</h2>
        <p>
          P&B có quyền thay đổi hoặc ngừng cung cấp bất kỳ phần nào của dịch vụ
          và có thể sửa đổi điều khoản sử dụng này tại bất kỳ thời điểm nào mà
          không cần thông báo trước. Việc bạn tiếp tục sử dụng dịch vụ sau khi
          các thay đổi được công bố có nghĩa là bạn chấp nhận và đồng ý.
        </p>
      </div>
    </div>
  );
};

export default TermOfUse;
