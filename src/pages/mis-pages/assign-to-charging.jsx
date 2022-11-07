import React from "react";
import Header from "../../components/header/Header";
import AssignToCharging from "../../components/mis-user-components/assign-to-charging/assign-to-charging";
import Footer from "../../components/footer/footer";
import "../../App.css";

const AssignToChargingPage = () => {
  return (
    <div className="App">
      <Header />
      <AssignToCharging />
      <Footer />
    </div>
  );
};

export default AssignToChargingPage;
