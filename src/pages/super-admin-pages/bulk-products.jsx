import React from "react";
import Header from "../../components/header/Header";
import BulkProducts from "../../components/admin-components/bulk-products/bulk-products";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BulkProductsPage = () => {
  return (
    <div className="App">
      <Header />
      <BulkProducts />
      <Footer />
    </div>
  );
};

export default BulkProductsPage;
