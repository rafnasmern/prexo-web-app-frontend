import React from "react";
import Header from "../../../components/header/Header";
import MmtMerge from "../../../components/mis-user-components/mmt-merge/mmt-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const MmtMergePage = () => {
  return (
    <div className="App">
      <Header />
      <MmtMerge />
      <Footer />
    </div>
  );
};

export default MmtMergePage;
