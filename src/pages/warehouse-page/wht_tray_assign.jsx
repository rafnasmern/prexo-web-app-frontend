import React from "react";
import Header from "../../components/header/Header";
import WhtTrayAssign from "../../components/warehouse-components/wht_tray_assign/tray_assign";
import Footer from "../../components/footer/footer";
import "../../App.css";
const WhtTrayAssignPage = () => {
  return (
    <div className="App">
      <Header />
      <WhtTrayAssign />
      <Footer />
    </div>
  );
};

export default WhtTrayAssignPage;
