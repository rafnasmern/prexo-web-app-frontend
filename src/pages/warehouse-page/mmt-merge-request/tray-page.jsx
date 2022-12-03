import React from "react";
import Header from "../../../components/header/Header";
import MmtTrayRequest from "../../../components/warehouse-components/mmt-merge-request/mmt-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const MmtTrayRequestPage = () => {
  return (
    <div className="App">
      <Header />
      <MmtTrayRequest />
      <Footer />
    </div>
  );
};

export default MmtTrayRequestPage;
