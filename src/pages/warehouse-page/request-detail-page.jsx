import React from "react";
import Header from "../../components/header/Header";
import RequestDetail from "../../components/request-detail/request-detail";
import Footer from "../../components/footer/footer";
import "../../App.css";
const RequestDetailPage = () => {
  return (
    <div className="App">
      <Header />
      <RequestDetail />
      <Footer />
    </div>
  );
};

export default RequestDetailPage;
