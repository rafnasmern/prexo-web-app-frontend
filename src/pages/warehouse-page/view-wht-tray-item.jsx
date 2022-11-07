import React from "react";
import Header from "../../components/header/Header";
import ViewWhtTrayItem from "../../components/warehouse-components/all-wht-tray/view-item";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewWhtTrayItemPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewWhtTrayItem />
      <Footer />
    </div>
  );
};

export default ViewWhtTrayItemPage;
