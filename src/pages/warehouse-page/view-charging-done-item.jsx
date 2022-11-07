import React from "react";
import Header from "../../components/header/Header";
import ViewChargingDoneItem from "../../components/warehouse-components/view-charging-done-item/tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewChargingDoneItemPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewChargingDoneItem />
      <Footer />
    </div>
  );
};

export default ViewChargingDoneItemPage;
