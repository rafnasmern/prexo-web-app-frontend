import React from "react";
import Header from "../../components/header/Header";
import Brands from "../../components/admin-components/brands/create-brands";
import Footer from "../../components/footer/footer";
import "../../App.css";
const BrandPage = () => {
  return (
    <div className="App">
      <Header />
      <Brands />
      <Footer />
    </div>
  );
};

export default BrandPage;
