// UserHeader.jsx
import React from "react";
import logo from "../../assets/images/logo.png";
import "../Header/Header.css";

export default function UserHeader() {
  return (
    <div className="userHeader">
      <img src={logo} alt="" className="userHeaderLogo" />
      <h5 className="brandName">Perfect </h5>
      <h5> Breakfast</h5>
    </div>
  );
}
