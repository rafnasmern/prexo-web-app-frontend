import React from "react";
import Header from "../../components/header/Header";
import ViewAssignedWht from "../../components/sorting-agent-components/view-assigned-wht-tray/wht-tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewAssignedWhtPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewAssignedWht />
      <Footer />
    </div>
  );
};

export default ViewAssignedWhtPage;
