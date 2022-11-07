import React from "react";
import Header from "../../components/header/Header";
import ChargingRequestRecieved from "../../components/warehouse-components/charging-request-recieved/charging-request";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ChargingRequestRecievedPage = () => {
  return (
    <div className="App">
      <Header />
      <ChargingRequestRecieved />
      <Footer />
    </div>
  );
};

export default ChargingRequestRecievedPage;
