import React from "react";
import Header from "../../components/header/Header";
import ViewPickListItem from "../../components/warehouse-components/view-picklist-item/picklist-view";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ViewPickListItemPage = () => {
  return (
    <div className="App">
      <Header />
      <ViewPickListItem />
      <Footer />
    </div>
  );
};

export default ViewPickListItemPage;
