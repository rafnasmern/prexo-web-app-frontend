import React from "react";
import Header from "../../components/header/Header";
import AssignToBqc from "../../components/mis-user-components/assign-to-bqc/assign-to-bqc";
import Footer from "../../components/footer/footer";
import "../../App.css";
const AssignToBqcPage = () => {
  return (
    <div className="App">
      <Header />
      <AssignToBqc />
      <Footer />
    </div>
  );
};

export default AssignToBqcPage;
