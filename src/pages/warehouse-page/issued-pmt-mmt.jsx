import React from "react";
import Header from "../../components/header/Header";
import IssuedMmtPmt from "../../components/warehouse-components/issued-pmt-mmt/pmt-mmt";
import Footer from "../../components/footer/footer";
import "../../App.css";
const IssuedMmtPmtPage = () => {
  return (
    <div className="App">
      <Header />
      <IssuedMmtPmt />
      <Footer />
    </div>
  );
};
export default IssuedMmtPmtPage;
