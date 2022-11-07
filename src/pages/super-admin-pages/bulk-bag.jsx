import React from "react";
import Header from "../../components/header/Header";
import BulkBag from "../../components/admin-components/bulk-bag/bulk-bag";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BulkBagPage = () => {
  return (
    <div className="App">
      <Header />
      <BulkBag />
      <Footer />
    </div>
  );
};

export default BulkBagPage;
