import React from "react";
import Header from "../../components/header/Header";
import Warehouse from "../../components/admin-components/warehouse/add-warehouse";
import Footer from "../../components/footer/footer";
import "../../App.css";

const InfraPage = () => {
  return (
    <div className="App">
      <Header />
      <Warehouse />
      <Footer />
    </div>
  );
};

export default InfraPage;
