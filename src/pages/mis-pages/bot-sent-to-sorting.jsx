import React from "react";
import Header from "../../components/header/Header";
import BotTraySentToSorting from "../../components/mis-user-components/bot-tray-sent-to-sorting/bot-tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BotTraySentToSortingPage = () => {
  return (
    <div className="App">
      <Header />
      <BotTraySentToSorting />
      <Footer />
    </div>
  );
};

export default BotTraySentToSortingPage;
