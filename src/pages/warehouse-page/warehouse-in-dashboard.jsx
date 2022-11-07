import React from "react";
import Header from "../../components/header/Header";
import WarehouseInDashboard from "../../components/warehouse-components/warehouse-dashboard/dashboard";
import Footer from "../../components/footer/footer";
import "../../App.css";
const WarehouseInDashboardPage = () => {
  return (
    <div className="App">
      <Header />
      <WarehouseInDashboard />
      <Footer />
    </div>
  );
};

export default WarehouseInDashboardPage;
