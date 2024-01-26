// UserHeader.jsx
import React from "react";
import logo from "../../assets/images/logo-color.svg";
import "../Header/Header.css";

export default function UserHeader() {
  return (
    <div className="userHeader">
      <div className="container">
        <img src={logo} alt="" className="userHeaderLogoSvg" />
      </div>
    </div>
  );
}
