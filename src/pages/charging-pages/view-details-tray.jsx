import React from "react";
import Header from "../../components/header/Header";
import ViewTrayDetails from "../../components/charging-components/charging-in/tray-item";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewTrayDetailsPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewTrayDetails />
      <Footer />
    </div>
  );
};

export default ViewTrayDetailsPage;
