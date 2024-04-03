// Sidebar.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { ReactComponent as MenuIconHero } from "../../../assets/icons/menu.svg";
import { ReactComponent as OrderHistoryIcon } from "../../../assets/icons/clipboard-check.svg";
import { ReactComponent as FoodIcon } from "../../../assets/icons/burger-svgrepo-com.svg";
import { ReactComponent as OrderTotalIcon } from "../../../assets/icons/order.svg";
import { ReactComponent as OrderIcon } from "../../../assets/icons/total-commander.svg";
import { ReactComponent as SupplierIcon } from "../../../assets/icons/service-desk.svg";
import { ReactComponent as DeliveryIcon } from "../../../assets/icons/delivery.svg";
import { ReactComponent as CompanyIcon } from "../../../assets/icons/phonebook.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/logout.svg";

import logo from "../../../assets/images/logo.png";

import "../../SuperAdmin/Layout/Sidebar.css";
import { useUser } from "../../../components/Context/UserContext";

const navigation = [
  {
    name: "Danh sách đơn hàng",
    href: "#",
    icon: OrderIcon,
    children: [
      { name: "- Chờ phân phối", href: "/partner/order" },
      { name: "- Đã phân phối", href: "/partner/food" },
    ],
  },

  // { name: "Đơn hàng cần xử lý", href: "/partner/order", icon: FoodIcon },
  // { name: "Danh sách phân phối", href: "/partner/food", icon: ComboIcon },
  {
    name: "Danh sách gói hàng",
    href: "/partner/package",
    icon: OrderTotalIcon,
  },
  {
    name: "Lịch sử đơn hàng",
    href: "/partner/order-history",
    icon: OrderHistoryIcon,
  },
  // { name: "Danh sách đối tác", href: "/admin/partners", icon: PartnerIcon },
  {
    name: "Danh sách nhà cung cấp",
    href: "/partner/supplier",
    icon: SupplierIcon,
  },
  // { name: "Danh sách ĐVVC", href: "/admin/deliveries", icon: DeliveryIcon },
  {
    name: "Danh sách công ty",
    href: "/partner/company",
    icon: CompanyIcon,
  },
];
const PartnerSidebar = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/management/login");
  };
  // const isActive = (href) => {
  //   // So sánh đường dẫn hiện tại với href một cách chính xác
  //   if (location.pathname === href) {
  //     return true;
  //   }
  //   // Đối với các trường hợp đường dẫn con, kiểm tra thêm điều kiện kết thúc bằng "/"
  //   // và đảm bảo rằng phần còn lại sau href là một đường dẫn con
  //   return (
  //     location.pathname.startsWith(href) &&
  //     location.pathname[href.length] === "/"
  //   );
  // };

  const isActive = (href) => {
    // Kiểm tra đường dẫn tuyệt đối
    if (location.pathname === href) {
      return true;
    }
    // Kiểm tra đường dẫn con
    return location.pathname.startsWith(href);
  };

  const handleLogoutConfirm = () => {
    setShowConfirmation(true);
  };
  const cancelLogout = () => {
    setShowConfirmation(false);
  };
  return (
    <>
      <div className="flex h-full">
        {/* Mobile sidebar */}
        <Disclosure as="nav" className="md:hidden">
          {({ open }) => (
            <>
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <MenuIconHero
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <MenuIconHero
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <Disclosure.Panel className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className="flex items-center p-2 text-base font-medium rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                    {item.name}
                  </Disclosure.Button>
                ))}
                <button
                  // onClick={handleLogout}
                  onClick={handleLogoutConfirm}
                  className="flex items-center p-2 w-full text-left text-base font-medium rounded-md text-red-600 hover:text-white hover:bg-red-800"
                >
                  <LogoutIcon className="mr-3 h-6 w-6" aria-hidden="true" />
                  Đăng xuất
                </button>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Static sidebar for desktop */}
        <div className=" h-screen hidden md:flex md:flex-shrink-0">
          <div className="relative flex flex-col w-64">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="fixed flex flex-col h-screen w-64">
              <div className="flex justify-center items-center h-16 flex-shrink-0 px-4 ">
                <img className="mt-3 h-16 w-auto" src={logo} alt="Logo" />
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4  space-y-1">
                  {navigation.map((item) =>
                    item.children ? (
                      <Disclosure
                        as="div"
                        key={item.name}
                        className="space-y-1"
                      >
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:text-white hover:bg-customHoverSidebar">
                              <item.icon
                                className="mr-3 h-6 w-6 group-hover:text-mainTextColorButton"
                                aria-hidden="true"
                              />
                              {item.name}
                              <svg
                                className={`ml-2.5 h-5 w-5 transform transition-transform duration-150 ${
                                  open ? "rotate-180" : "rotate-0"
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Disclosure.Button>
                            <Disclosure.Panel className="space-y-1 ml-9">
                              {item.children.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className={`font-semibold group flex items-center px-2 py-2 text-sm rounded-md hover:text-mainColor pl-11 ${
                                    isActive(subItem.href)
                                      ? "text-customHoverSidebar"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:text-white hover:bg-customHoverSidebar 
      ${
        isActive(item.href)
          ? "bg-customHoverSidebar text-mainTextColorButton"
          : ""
      }`}
                      >
                        <item.icon
                          className={`mr-3 h-6 w-6 ${
                            isActive(item.href)
                              ? "text-mainTextColorButton"
                              : "group-hover:text-mainTextColorButton"
                          }`}
                          aria-hidden="true"
                        />

                        {item.name}
                      </Link>
                    )
                  )}
                </nav>
                {userData && (
                  <div className="sticky bottom-0 w-full flex items-center py-2.5 justify-between bg-white px-2">
                    {" "}
                    {/* Added bg-white for visibility */}
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => navigate("profile")}
                    >
                      <img
                        src={userData.image}
                        alt="Avatar"
                        className="h-11 w-11 rounded-full"
                      />
                      <div className="ml-2 ">
                        <p className="text-base font-semibold text-gray-800">
                          {userData.name}
                        </p>
                        <p className="text-xs font-medium text-gray-700">
                          {userData.roles}
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <button
                        onClick={handleLogoutConfirm}
                        className="h-full w-full flex justify-end items-center text-sm font-medium rounded-md text-gray-600 hover:text-red-500 "
                      >
                        <LogoutIcon
                          className="mt-2 h-6 w-6"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-10">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h5 className="text-lg font-bold mb-6">
              Bạn có chắc chắn muốn đăng xuất không?
            </h5>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded text-gray-600 border border-gray-300 hover:bg-gray-100 transition duration-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition duration-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PartnerSidebar;
