import React from "react";
import Header from "../../components/header/Header";
import StockInWareHosue from "../../components/stock-in-warehouse/stock-in-warehouse";
import Footer from "../../components/footer/footer";
import "../../App.css";
const StockinPageWarehouse = () => {
  return (
    <div className="App">
      <Header />
      <StockInWareHosue />
      <Footer />
    </div>
  );
};

export default StockinPageWarehouse;
