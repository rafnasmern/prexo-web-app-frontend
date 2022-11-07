import React from "react";
import Header from "../../components/header/Header";
import InuseWhtTray from "../../components/warehouse-components/in-use-wht-tray/wht-tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const InuseWhtTrayPage = () => {
  return (
    <div className="App">
      <Header />
      <InuseWhtTray />
      <Footer />
    </div>
  );
};

export default InuseWhtTrayPage;
