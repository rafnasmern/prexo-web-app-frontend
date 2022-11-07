import React from "react";
import Header from "../../components/header/Header";
import AssigntoAudit from "../../components/mis-user-components/assign-to-audit/assign-to-audit";
import Footer from "../../components/footer/footer"
import "../../App.css"
const AssigntoAuditPage = () => {
  return (
    <div className="App">
      <Header />
      <AssigntoAudit />
      <Footer />
    </div>
  );
};

export default AssigntoAuditPage;
