import React from "react";
import Header from "../../components/header/Header";
import ReadyForCharging from "../../components/admin-components/ready-for-charging/wht-tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ReadyForChargingPage = () => {
  return (
    <div className="App">
      <Header />
      <ReadyForCharging />
      <Footer />
    </div>
  );
};

export default ReadyForChargingPage;
