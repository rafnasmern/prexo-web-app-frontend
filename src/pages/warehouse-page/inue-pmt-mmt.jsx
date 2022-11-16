import React from "react";
import Header from "../../components/header/Header";
import InuseMmtPmt from "../../components/warehouse-components/inuse-pmt-mmt/pmt-mmt";
import Footer from "../../components/footer/footer";
import "../../App.css";
const InuseMmtPmtPage = () => {
  return (
    <div className="App">
      <Header />
      <InuseMmtPmt />
      <Footer />
    </div>
  );
};

export default InuseMmtPmtPage;
