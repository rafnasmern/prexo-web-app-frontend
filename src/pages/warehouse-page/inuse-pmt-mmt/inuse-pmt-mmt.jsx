import React from "react";
import Header from "../../../components/header/Header";
import InusePmtMmt from "../../../components/warehouse-components/inuse-pmt-mmt/inuse-pmt-mmt";
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
