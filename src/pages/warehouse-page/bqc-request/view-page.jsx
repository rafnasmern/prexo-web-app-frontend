import React from "react";
import Header from "../../../components/header/Header";
import ViewRequest from "../../../components/warehouse-components/bqc-request/view-request";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const ViewRequestPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewRequest />
      <Footer />
    </div>
  );
};

export default ViewRequestPage;
