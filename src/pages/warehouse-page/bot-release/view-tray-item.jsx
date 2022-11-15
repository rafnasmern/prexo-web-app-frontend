import React from "react";
import Header from "../../../components/header/Header";
import ViewTrayItem from "../../../components/warehouse-components/bot-to-release/view-tray-item";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const ViewTrayItemPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewTrayItem />
      <Footer />
    </div>
  );
};

export default ViewTrayItemPage;
