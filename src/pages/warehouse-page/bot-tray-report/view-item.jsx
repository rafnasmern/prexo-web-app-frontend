import React from "react";
import Header from "../../../components/header/Header";
import TrayItemDetails from "../../../components/warehouse-components/bot-tray-report/tray-item-details";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const TrayItemDetailsPage = () => {
  return (
    <div className="App">
      <Header />
      <TrayItemDetails />
      <Footer />
    </div>
  );
};

export default TrayItemDetailsPage;
