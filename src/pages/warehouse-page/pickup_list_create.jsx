import React from "react";
import Header from "../../components/header/Header";
import PickupListCreate from "../../components/mis-user-components/pickup_list_create/pickup_list_create";
import Footer from "../../components/footer/footer";
import "../../App.css";
const PickupListCreatePage = () => {
  return (
    <div className="App">
      <Header />
      <PickupListCreate />
      <Footer />
    </div>
  );
};

export default PickupListCreatePage;
