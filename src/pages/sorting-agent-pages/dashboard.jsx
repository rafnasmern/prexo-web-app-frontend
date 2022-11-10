import React from "react"
import Header from "../../components/header/Header"
import Dashboard from "../../components/sorting-agent-components/sorting-agent-dashboard/dashboard"
import Footer from "../../components/footer/footer"
import "../../App.css"
const DashboardPage=()=>{
    return (
        <div className="App">
        <Header />
        <Dashboard />
        <Footer />
        </div>
    )
}

export default DashboardPage;