import React from "react";
import Header from "../../components/header/Header";
import ChrgingOut from "../../components/charging-components/charging-out/tray";
import Footer from "../../components/footer/footer";
import "../../App.css";
const ChrgingOutPage = () => {
  return (
    <div className="App">
      <Header />
      <ChrgingOut />
      <Footer />
    </div>
  );
};
export default ChrgingOutPage;
