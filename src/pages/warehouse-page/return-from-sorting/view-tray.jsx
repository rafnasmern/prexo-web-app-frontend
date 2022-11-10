import React from "react";
import Header from "../../../components/header/Header";
import ViewTray from "../../../components/warehouse-components/return-from-sorting/view-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const ViewTrayPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewTray />
      <Footer />
    </div>
  );
};

export default ViewTrayPage;
