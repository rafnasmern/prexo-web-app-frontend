import React from "react";
import Header from "../../components/header/Header";
import TrayCloseRequest from "../../components/warehouse-components/tray-close-request/tray-close";
import Footer from "../../components/footer/footer";
import "../../App.css";
const TrayCloseRequestPage = () => {
  return (
    <div className="App">
      <Header />
      <TrayCloseRequest />
      <Footer />
    </div>
  );
};

export default TrayCloseRequestPage;
