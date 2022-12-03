import React from "react";
import Header from "../../../components/header/Header";
import MmtTrayApprove from "../../../components/warehouse-components/mmt-merge-approve/approve-view";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const MmtTrayApprovePage = () => {
  return (
    <div className="App">
      <Header />
      <MmtTrayApprove />
      <Footer />
    </div>
  );
};

export default MmtTrayApprovePage;
