import React from "react";
import Header from "../../components/header/Header";
import BotToWht from "../../components/mis-user-components/bot-to-wht/bot-to-wht";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BotToWhtPage = () => {
  return (
    <div className="App">
      <Header />
      <BotToWht />
      <Footer />
    </div>
  );
};

export default BotToWhtPage;
