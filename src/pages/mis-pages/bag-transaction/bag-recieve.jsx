import React from "react";
import Header from "../../../components/header/Header";
import BagRecieve from "../../../components/mis-user-components/bag-transcation/bag-receive";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const BagRecievePage = () => {
  return (
    <div className="App">
      <Header />
      <BagRecieve />
      <Footer />
    </div>
  );
};

export default BagRecievePage;
