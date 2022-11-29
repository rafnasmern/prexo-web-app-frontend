import React from "react";
import Header from "../../../components/header/Header";
import BotrayReport from "../../../components/warehouse-components/bot-tray-report/bot-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const BotrayReportPage = () => {
  return (
    <div className="App">
      <Header />
      <BotrayReport />
      <Footer />
    </div>
  );
};

export default BotrayReportPage;
