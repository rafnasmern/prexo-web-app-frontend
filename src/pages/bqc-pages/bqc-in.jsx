import React from "react";
import Header from "../../components/header/Header";
import BqcIn from "../../components/bqc-components/bqc-in/bqc-in";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BqcInPage = () => {
  return (
    <div className="App">
      <Header />
      <BqcIn />
      <Footer />
    </div>
  );
};

export default BqcInPage;
