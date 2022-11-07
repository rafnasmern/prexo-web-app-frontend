import React from "react";
import Header from "../../../components/header/Header";
import TrayClose from "../../../components/warehouse-components/returning-from-charging/close-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const TrayClosePage = () => {
  return (
    <div className="App">
      <Header />
      <TrayClose />
      <Footer />
    </div>
  );
};

export default TrayClosePage;
