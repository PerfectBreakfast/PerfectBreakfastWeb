import React from "react";
import { Disclosure } from "@headlessui/react";
import { ReactComponent as DownIcon } from "../../../assets/icons/down.svg";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "Làm thế nào để đặt món ăn cho ngày hôm sau?",
    answer:
      "Quý khách có thể đặt món ăn cho ngày hôm sau bằng cách vào mục “Đặt Hàng” trên website. Xin lưu ý, mọi đơn đặt hàng cho ngày hôm sau cần được hoàn tất trước 16:00 giờ ngày hôm trước.",
  },
  {
    question: "Tôi có thể thanh toán qua đâu?",
    answer:
      "Chúng tôi hỗ trợ thanh toán qua VietQR. Quý khách có thể chọn phương thức thanh toán này tại trang thanh toán và quét mã QR qua ứng dụng ngân hàng của mình để hoàn tất giao dịch.",
  },
  {
    question: "Có thể hoàn trả sau khi đã đặt hàng không?",
    answer:
      "Chúng tôi xin lỗi nhưng mọi đơn hàng sau khi đã được xác nhận không thể hoàn trả. Chúng tôi khuyến khích quý khách cân nhắc kỹ trước khi đặt hàng. Tuy nhiên, nếu có bất kỳ vấn đề gì về chất lượng của món ăn, xin vui lòng liên hệ với chúng tôi để được hỗ trợ.",
  },
  {
    question: "Tôi có thể hủy đơn hàng không?",
    answer:
      "Đơn hàng có thể được hủy bỏ nếu nó chưa được thanh toán. Để thay đổi hoặc hủy đơn hàng, xin vui lòng liên hệ trực tiếp với bộ phận chăm sóc khách hàng của chúng tôi thông qua hotline hoặc email càng sớm càng tốt.",
  },
  {
    question: "P&B cung cấp dịch vụ giao hàng đến đâu?",
    answer:
      "Chúng tôi cung cấp dịch vụ giao hàng tận nơi tới công ty đã đăng ký với chúng tôi.",
  },
  {
    question:
      "Làm thế nào để liên hệ với P&B nếu tôi có thắc mắc hoặc cần hỗ trợ?",
    answer:
      "Quý khách có thể liên hệ với chúng tôi qua hotline, email, hoặc gửi thắc mắc qua form liên hệ trực tuyến trên website. Đội ngũ hỗ trợ khách hàng của chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
  },
];

const FaqPage = () => {
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
        <h6 className="text-lg font-bold ml-4">Câu hỏi thường gặp</h6>
      </div>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          FAQ - Câu Hỏi Thường Gặp
        </h1>
        {faqs.map((faq, index) => (
          <Disclosure key={index} as="div" className="mt-2">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-green-900 bg-green-100 rounded-lg hover:bg-green-200 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
                  {faq.question}
                  <DownIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-green-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pt-2.5 pb-2 text-sm text-gray-500">
                  {faq.answer}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
