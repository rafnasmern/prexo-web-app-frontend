import React from "react";
import Header from "../../../components/header/Header";
import ViewTrayForSorting from "../../../components/warehouse-components/view--tray-to-sorting/wht-and-bot";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const ViewTrayForSortingPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewTrayForSorting />
      <Footer />
    </div>
  );
};

export default ViewTrayForSortingPage;
