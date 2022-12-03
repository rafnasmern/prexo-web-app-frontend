import React from "react";
import Header from "../../../components/header/Header";
import ViewMmtMerge from "../../../components/sorting-agent-components/view-mmt-merge/mmt-tray";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const ViewMmtMergePage = () => {
  return (
    <div className="App">
      <Header />
      <ViewMmtMerge />
      <Footer />
    </div>
  );
};

export default ViewMmtMergePage;
