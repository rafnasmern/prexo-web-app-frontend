import React from "react";
import Header from "../../components/header/Header";
import AddOrders from "../../components/add-orders/add-orders";
import Footer from "../../components/footer/footer";
import "../../App.css";
const InfraPage = () => {
  return (
    <div className="App">
      <Header />
      <AddOrders />
      <Footer />
    </div>
  );
};

export default InfraPage;
