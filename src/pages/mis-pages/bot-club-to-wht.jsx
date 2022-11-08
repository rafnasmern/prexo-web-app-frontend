import React from "react";
import Header from "../../components/header/Header";
import WhtTrayAssignment from "../../components/mis-user-components/bot-club-to-wht-tray/wht-tray-assignment";
import Footer from "../../components/footer/footer";
import "../../App.css";
const WhtTrayAssignmentPage = () => {
  return (
    <div className="App">
      <Header />
      <WhtTrayAssignment />
      <Footer />
    </div>
  );
};

export default WhtTrayAssignmentPage;
