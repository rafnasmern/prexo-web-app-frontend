import React from "react";
import Header from "../../components/header/Header";
import MastersHistory from "../../components/admin-components/masters-edit-history/history";
import Footer from "../../components/footer/footer";
import "../../App.css";
const MastersHistoryPage = () => {
  return (
    <div className="App">
      <Header />
      <MastersHistory />
      <Footer />
    </div>
  );
};

export default MastersHistoryPage;
