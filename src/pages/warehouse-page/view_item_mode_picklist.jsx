import React from "react";
import Header from "../../components/header/Header";
import ViewItem from "../../components/warehouse-components/view-item-model-picklist/item";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewItemPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewItem />
      <Footer />
    </div>
  );
};

export default ViewItemPage;
