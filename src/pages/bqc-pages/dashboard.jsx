import React from "react";
import Header from "../../components/header/Header";
import BqcDashboard from "../../components/bqc-components/dashboard-component/dashboard";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BqcDashboardPage = () => {
  return (
    <div className="App">
      <Header />
      <BqcDashboard />
      <Footer />
    </div>
  );
};

export default BqcDashboardPage;
