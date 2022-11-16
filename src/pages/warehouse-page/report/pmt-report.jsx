import React from "react";
import Header from "../../../components/header/Header";
import PmtReport from "../../../components/warehouse-components/report/pmt-report-daily-wise";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const PmtReportPage = () => {
  return (
    <div className="App">
      <Header />
      <PmtReport />
      <Footer />
    </div>
  );
};

export default PmtReportPage;
