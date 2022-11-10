import React from "react";
import Header from "../../../components/header/Header";
import SortingRequest from "../../../components/warehouse-components/sorting-request/sorting-requests";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const SortingRequestPage = () => {
  return (
    <div className="App">
      <Header />
      <SortingRequest />
      <Footer />
    </div>
  );
};

export default SortingRequestPage;
