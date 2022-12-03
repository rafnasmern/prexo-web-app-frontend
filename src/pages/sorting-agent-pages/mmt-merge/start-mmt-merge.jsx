import React from "react";
import Header from "../../../components/header/Header";
import StartMmtmerge from "../../../components/sorting-agent-components/start-mmt-merge/mmt-merge";
import Footer from "../../../components/footer/footer";
import "../../../App.css";
const StartMmtmergePage = () => {
  return (
    <div className="App">
      <Header />
      <StartMmtmerge />
      <Footer />
    </div>
  );
};

export default StartMmtmergePage;
