import React from "react";
import Header from "../../components/header/Header";
import ChargingRequestDetail from "../../components/warehouse-components/charging-request-approve/charging-approve";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ChargingRequestDetailPage = () => {
  return (
    <div className="App">
      <Header />
      <ChargingRequestDetail />
      <Footer />
    </div>
  );
};

export default ChargingRequestDetailPage;
