import React from "react";
import Header from "../../components/header/Header";
import SortingRequests from "../../components/sorting-agent-components/view-sorting-requests/sorting-requests";
import Footer from "../../components/footer/footer";
import "../../App.css";
const SortingRequestsPage = () => {
  return (
    <div className="App">
      <Header />
      <SortingRequests />
      <Footer />
    </div>
  );
};

export default SortingRequestsPage;
