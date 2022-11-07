import React from "react";
import Header from "../../components/header/Header";
import BqcOut from "../../components/bqc-components/bqc-out/bqc-out";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BqcOutPage = () => {
  return (
    <div className="App">
      <Header />
      <BqcOut />
      <Footer />
    </div>
  );
};

export default BqcOutPage;
