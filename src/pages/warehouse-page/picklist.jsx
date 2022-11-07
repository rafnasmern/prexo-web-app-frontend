import React from "react";
import Header from "../../components/header/Header";
import PickListRequest from "../../components/warehouse-components/picklist/picklist";
import Footer from "../../components/footer/footer";
import "../../App.css";
const PickListRequestPage = () => {
  return (
    <div className="App">
      <Header />
      <PickListRequest />
      <Footer />
    </div>
  );
};

export default PickListRequestPage;
