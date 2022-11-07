import React from "react";
import Header from "../../components/header/Header";
import ReturningFromCharging from "../../components/warehouse-components/returning-from-charging/tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ReturningFromChargingPage = () => {
  return (
    <div className="App">
      <Header />
      <ReturningFromCharging />
      <Footer />
    </div>
  );
};
export default ReturningFromChargingPage;
