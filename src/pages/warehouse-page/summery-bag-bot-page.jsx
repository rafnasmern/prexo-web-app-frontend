import React from "react";
import Header from "../../components/header/Header";
import SummeryBagBotPage from "../../components/warehouse-components/summery-bag-bot/summery";
import Footer from "../../components/footer/footer";
import "../../App.css";
const SummeryBagBotPagePage = () => {
  return (
    <div className="App">
      <Header />
      <SummeryBagBotPage />
      <Footer />
    </div>
  );
};

export default SummeryBagBotPagePage;
