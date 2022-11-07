import React from "react";
import Header from "../../components/header/Header";
import PickList from "../../components/warehouse-components/created-picklist/pick-list";
import Footer from "../../components/footer/footer";
import "../../App.css";
const PickListPage = () => {
  return (
    <div className="App">
      <Header />
      <PickList />
      <Footer />
    </div>
  );
};

export default PickListPage;
