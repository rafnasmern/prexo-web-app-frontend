import React from "react";
import Header from "../../../components/header/Header";
import InusePmtMmt from "../../../components/warehouse-components/in-use-pmt-mmt/tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const InusePmtMmtPage = () => {
  return (
    <div className="App">
      <Header />
      <InusePmtMmt />
      <Footer />
    </div>
  );
};

export default InusePmtMmtPage;
