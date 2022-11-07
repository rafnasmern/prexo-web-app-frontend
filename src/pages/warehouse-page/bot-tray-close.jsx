import React from "react";
import Header from "../../components/header/Header";
import BotTrayClose from "../../components/warehouse-components/bot-tray-close-request/bot-tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BotTrayClosePage = () => {
  return (
    <div className="App">
      <Header />
      <BotTrayClose />
      <Footer />
    </div>
  );
};

export default BotTrayClosePage;
