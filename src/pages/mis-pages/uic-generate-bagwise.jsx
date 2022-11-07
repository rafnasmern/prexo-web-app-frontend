import React from "react";
import Header from "../../components/header/Header";
import UicGenerateBagWise from "../../components/mis-user-components/assign-to-bot/genrate-uic-bag-wise";
import Footer from "../../components/footer/footer";
import "../../App.css";
const UicGenerateBagWisePage = () => {
  return (
    <div className="App">
      <Header />
      <UicGenerateBagWise />
      <Footer />
    </div>
  );
};

export default UicGenerateBagWisePage;
