import React from "react";
import Header from "../../components/header/Header";
import ViewDetailsBag from "../../components/bot-components/view-assigned-bag/bag";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewDetailsBagPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewDetailsBag />
      <Footer />
    </div>
  );
};

export default ViewDetailsBagPage;
