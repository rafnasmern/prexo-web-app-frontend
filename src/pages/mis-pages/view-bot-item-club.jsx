import React from "react";
import Header from "../../components/header/Header";
import ViewBotItemClub from "../../components/mis-user-components/view-bot-club-data/bot-tray-item-club";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewBotItemClubPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewBotItemClub />
      <Footer />
    </div>
  );
};

export default ViewBotItemClubPage;
