import React from "react";
import Header from "../../../components/header/Header";
import ActualVsExpected from "../../../components/warehouse-components/sorting-requests-ex-vs-at/ex-vs-at";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const ActualVsExpectedPage = () => {
  return (
    <div className="App">
      <Header />
      <ActualVsExpected />
      <Footer />
    </div>
  );
};

export default ActualVsExpectedPage;
