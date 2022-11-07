import React from "react"
import Header from "../../components/header/Header"
import DashboardAdmin from "../../components/admin-components/admin-dashboard/dashboard"
import Footer from "../../components/footer/footer"
import "../../App.css"
const DashboardPage=()=>{
    return (
        <div className="App">
        <Header  />
        <DashboardAdmin />
        <Footer />
        </div>
    )
}

export default DashboardPage;