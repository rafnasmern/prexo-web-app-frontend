import React from "react";
import Header from "../../components/header/Header";
import PicklistClose from "../../components/warehouse-components/pick_list_close/pick_list_close";
import Footer from "../../components/footer/footer";
import "../../App.css";
const PicklistClosePage = () => {
  return (
    <div className="App">
      <Header />
      <PicklistClose />
      <Footer />
    </div>
  );
};

export default PicklistClosePage;
