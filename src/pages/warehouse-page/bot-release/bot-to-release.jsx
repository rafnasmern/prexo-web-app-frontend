import React from "react";
import Header from "../../../components/header/Header";
import BotToRelease from "../../../components/warehouse-components/bot-to-release/bot-to-release";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const BotToReleasePage = () => {
  return (
    <div className="App">
      <Header />
      <BotToRelease />
      <Footer />
    </div>
  );
};

export default BotToReleasePage;
