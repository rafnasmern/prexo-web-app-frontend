import React from "react";
import Header from "../../components/header/Header";
import TrackDeliveredItem from "../../components/mis-user-components/track-delivered-item/track-delivered-item";
import Footer from "../../components/footer/footer";
import "../../App.css";
const TrackDeliveredItemPage = () => {
  return (
    <div className="App">
      <Header />
      <TrackDeliveredItem />
      <Footer />
    </div>
  );
};

export default TrackDeliveredItemPage;
