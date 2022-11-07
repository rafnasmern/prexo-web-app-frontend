import React from "react";
import Header from "../../components/header/Header";
import AssignedTray from "../../components/bqc-components/assigned-tray/assigned-tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const AssignedTrayPage = () => {
  return (
    <div className="App">
      <Header />
      <AssignedTray />
      <Footer />
    </div>
  );
};

export default AssignedTrayPage;
