import React from "react";
import Header from "../../components/header/Header";
import StartSorting from "../../components/sorting-agent-components/start-sorting/start-sorting";
import Footer from "../../components/footer/footer";
import "../../App.css";
const StartSortingPage = () => {
  return (
    <div className="App">
      <Header />
      <StartSorting />
      <Footer />
    </div>
  );
};

export default StartSortingPage;
