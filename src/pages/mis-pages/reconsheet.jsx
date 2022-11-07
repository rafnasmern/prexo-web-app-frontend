import React from "react";
import Header from "../../components/header/Header";
import Reconsheet from "../../components/mis-user-components/reconsheet/reconsheet";
import Footer from "../../components/footer/footer";
import "../../App.css";

const ReconsheetPage = () => {
  return (
    <div className="App">
      <Header />
      <Reconsheet />
      <Footer />
    </div>
  );
};

export default ReconsheetPage;
