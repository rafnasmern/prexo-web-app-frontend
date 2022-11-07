import React from "react";
import Header from "../../components/header/Header";
import ChargingDashboard from "../../components/charging-components/dashboard/dashboard";
import Footer from "../../components/footer/footer"
import "../../App.css"
const ChargingDashboardPage = () => {
  return (
    <div className="App">
      <Header />
      <ChargingDashboard />
      <Footer />
        </div>
  );
};

export default ChargingDashboardPage;
