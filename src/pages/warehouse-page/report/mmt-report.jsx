import React from "react";
import Header from "../../../components/header/Header";
import MmtReport from "../../../components/warehouse-components/report/mmt-report-daily-wise";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const MmtReportPage = () => {
  return (
    <div className="App">
      <Header />
      <MmtReport />
      <Footer />
    </div>
  );
};

export default MmtReportPage;
