import React from "react";
import Header from "../../../components/header/Header";
import SkuSummery from "../../../components/warehouse-components/bot-tray-report/sku-summery";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const SkuSummeryPage = () => {
  return (
    <div className="App">
      <Header />
      <SkuSummery />
      <Footer />
    </div>
  );
};

export default SkuSummeryPage;
