import React from "react";
import Header from "../../../components/header/Header";
import BagTransfer from "../../../components/mis-user-components/bag-transcation/bag-transfer";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const BagTransferPage = () => {
  return (
    <div className="App">
      <Header />
      <BagTransfer />
      <Footer />
    </div>
  );
};

export default BagTransferPage;
