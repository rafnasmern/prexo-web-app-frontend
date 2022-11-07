import React from "react";
import Header from "../../components/header/Header";
import RevalidateOrders from "../../components/mis-user-components/revalidate-orders-table/orders";
import Footer from "../../components/footer/footer";
import "../../App.css";
const RevalidateOrdersPage = () => {
  return (
    <div className="App">
      <Header />
      <RevalidateOrders />
      <Footer />
    </div>
  );
};

export default RevalidateOrdersPage;
