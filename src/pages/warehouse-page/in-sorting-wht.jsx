import React from "react";
import Header from "../../components/header/Header";
import InuseSorting from "../../components/warehouse-components/in-sorting-wht/wht-tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const InuseSortingPage = () => {
  return (
    <div className="App">
      <Header />
      <InuseSorting />
      <Footer />
    </div>
  );
};

export default InuseSortingPage;
