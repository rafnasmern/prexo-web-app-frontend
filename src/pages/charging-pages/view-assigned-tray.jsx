import React from "react";
import Header from "../../components/header/Header";
import ViewAssignedTray from "../../components/charging-components/assigned-tray/view-assigned-tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewAssignedTrayPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewAssignedTray />
      <Footer />
    </div>
  );
};

export default ViewAssignedTrayPage;
