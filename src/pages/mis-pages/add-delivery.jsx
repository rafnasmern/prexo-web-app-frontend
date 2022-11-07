import React from "react"
import Header from "../../components/header/Header"
import DeliveryImport from "../../components/add-delivery/delivery"
import Footer from "../../components/footer/footer"
import "../../App.css"
const deliveryImport=()=>{
    return (
        <div className="App">
        <Header />
        <DeliveryImport />
        <Footer />
        </div>
    )
}

export default deliveryImport;