import React from "react";
import Header from "../../../components/header/Header";
import ReturnFromBQC from "../../../components/warehouse-components/return-from-bqc/view-all-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const ReturnFromBQCPage = () => {
  return (
    <div className="App">
      <Header />
      <ReturnFromBQC />
      <Footer />
    </div>
  );
};

export default ReturnFromBQCPage;
