import React from "react";
import Header from "../../components/header/Header";
import BotDashboard from "../../components/bot-components/bag-opening-dashboard/dashboard";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BotPage = () => {
  return (
    <div className="App">
      <Header />
      <BotDashboard />
      <Footer />
    </div>
  );
};

export default BotPage;
