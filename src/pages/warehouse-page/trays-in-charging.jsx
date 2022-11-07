import React from "react";
import Header from "../../components/header/Header";
import TraysInCharging from "../../components/warehouse-components/trays-in-charging/trays";
import Footer from "../../components/footer/footer";
import "../../App.css";
const TraysInChargingPage = () => {
  return (
    <div className="App">
      <Header />
      <TraysInCharging />
      <Footer />
    </div>
  );
};

export default TraysInChargingPage;
