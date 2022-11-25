import React from "react";
import Header from "../../components/header/Header";
import WhtTrayMerge from "../../components/mis-user-components/wht-tray-merge/tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const WhtTrayMergePage = () => {
  return (
    <div className="App">
      <Header />
      <WhtTrayMerge />
      <Footer />
    </div>
  );
};

export default WhtTrayMergePage;
