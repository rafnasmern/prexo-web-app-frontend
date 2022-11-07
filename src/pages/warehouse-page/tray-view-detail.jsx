import React from "react";
import Header from "../../components/header/Header";
import TrayDetails from "../../components/warehouse-components/tray-view-details/tray";
import Footer from "../../components/footer/footer";
import "../../App.css";

const TrayDetailsPage = () => {
  return (
    <div className="App">
      <Header />
      <TrayDetails />
      <Footer />
    </div>
  );
};

export default TrayDetailsPage;
