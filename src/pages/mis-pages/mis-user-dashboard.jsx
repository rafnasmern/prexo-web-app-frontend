import React from "react"
import Header from "../../components/header/Header"
import MisUserDashboard from "../../components/mis-user-components/mis-user-dashboard/dashboard"
import Footer from "../../components/footer/footer"
import "../../App.css"
const deliveryImport=()=>{
    return (
        <div className="App">
        <Header />
        <MisUserDashboard />
        <Footer />
        </div>
    )
}

export default deliveryImport;