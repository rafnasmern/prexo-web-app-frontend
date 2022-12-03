import React from "react";
import Header from "../../../components/header/Header";
import ViewMmtTray from "../../../components/warehouse-components/return-from-mmt-merge/view-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const ViewMmtTrayPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewMmtTray />
      <Footer />
    </div>
  );
};

export default ViewMmtTrayPage;
