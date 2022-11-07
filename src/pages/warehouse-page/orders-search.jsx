import React from "react";
import Header from "../../components/header/Header";
import OrdersSearch from "../../components/warehouse-search/ordersSearch";
import Footer from "../../components/footer/footer";
import "../../App.css";
const Users = () => {
  return (
    <div className="App">
      <Header />
      <OrdersSearch />
      <Footer />
    </div>
  );
};

export default Users;
