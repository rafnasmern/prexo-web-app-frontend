import React from "react";
import Header from "../../components/header/Header";
import AssignForSorting from "../../components/mis-user-components/assign-for-sorting/club-model";
import Footer from "../../components/footer/footer";
import "../../App.css";
const AssignForSortingPage = () => {
  return (
    <div className="App">
      <Header />
      <AssignForSorting />
      <Footer />
    </div>
  );
};

export default AssignForSortingPage;
