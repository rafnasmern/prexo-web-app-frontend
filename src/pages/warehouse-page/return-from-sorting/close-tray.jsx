import React from "react";
import Header from "../../../components/header/Header";
import CloseTray from "../../../components/warehouse-components/return-from-sorting/close-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const CloseTrayPage = () => {
  return (
    <div className="App">
      <Header />
      <CloseTray />
      <Footer />
    </div>
  );
};

export default CloseTrayPage;
