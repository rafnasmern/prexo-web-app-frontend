import React from "react"
import Header from "../../components/header/Header"
import Location from "../../components/admin-components/location/add-location"
import Footer from "../../components/footer/footer"
import "../../App.css"
const InfraPage=()=>{
    return (
        <div className="App">
        <Header />
        <Location />
        <Footer />
        </div>
    )
}

export default InfraPage;