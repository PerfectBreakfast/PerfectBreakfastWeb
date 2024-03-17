import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { ReactComponent as MenuIconHero } from "../../../assets/icons/menu.svg";
import { ReactComponent as MenuIcon } from "../../../assets/icons/menu-food.svg";
import { ReactComponent as FoodIcon } from "../../../assets/icons/burger-svgrepo-com.svg";
import { ReactComponent as Staff } from "../../../assets/icons/staff.svg";
import { ReactComponent as PartnerIcon } from "../../../assets/icons/partner.svg";
import { ReactComponent as SupplierIcon } from "../../../assets/icons/supplier.svg";
import { ReactComponent as DeliveryIcon } from "../../../assets/icons/delivery.svg";
import { ReactComponent as CompanyIcon } from "../../../assets/icons/company.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/logout.svg";

import logo from "../../../assets/images/logo.png";

const navigation = [
  { name: "Danh sách đơn hàng", href: "/delivery/order", icon: FoodIcon },
  { name: "Danh sách nhân viên", href: "/delivery/staff", icon: Staff },
  {
    name: "Lịch sử đơn hàng",
    href: "/delivery/order-history",
    icon: MenuIcon,
  },
  {
    name: "Danh sách công ty",
    href: "/delivery/company",
    icon: CompanyIcon,
  },
];

const DeliverySidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/management/login");
  };
  const isActive = (href) => {
    // So sánh đường dẫn hiện tại với href một cách chính xác
    if (location.pathname === href) {
      return true;
    }
    // Đối với các trường hợp đường dẫn con, kiểm tra thêm điều kiện kết thúc bằng "/"
    // và đảm bảo rằng phần còn lại sau href là một đường dẫn con
    return (
      location.pathname.startsWith(href) &&
      location.pathname[href.length] === "/"
    );
  };

  return (
    <div className="flex h-full">
      {/* Mobile sidebar */}
      <Disclosure as="nav" className="md:hidden">
        {({ open }) => (
          <>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <MenuIconHero className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIconHero className="block h-6 w-6" aria-hidden="true" />
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
                onClick={handleLogout}
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
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="fixed flex flex-col h-screen w-64">
            <div className="flex justify-center items-center h-16 flex-shrink-0 px-4 bg-customSidebarBg">
              <img className="mt-3 h-16 w-auto" src={logo} alt="Logo" />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-customSidebarBg space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:text-white hover:bg-customHoverSidebar 
                    ${
                      isActive(item.href)
                        ? "bg-customHoverSidebar text-white"
                        : "text-black"
                    }`} // Apply active styles based on current path
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isActive(item.href)
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-300"
                      }`} // Change icon color for active link
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="mx-auto group flex items-center px-2 py-2 w-full text-left text-sm font-medium rounded-md text-red-600 hover:text-white hover:bg-red-800"
                >
                  <LogoutIcon className="mr-3 h-6 w-6" aria-hidden="true" />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySidebar;
