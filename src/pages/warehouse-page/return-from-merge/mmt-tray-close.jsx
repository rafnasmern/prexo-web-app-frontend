import React from "react";
import Header from "../../../components/header/Header";
import CloseMmtTray from "../../../components/warehouse-components/return-from-mmt-merge/close-mmt";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const CloseMmtTrayPage = () => {
  return (
    <div className="App">
      <Header />
      <CloseMmtTray />
      <Footer />
    </div>
  );
};

export default CloseMmtTrayPage;
