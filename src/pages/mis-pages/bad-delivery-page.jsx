import React from "react"
import Header from "../../components/header/Header"
import BadDelivery from "../../components/mis-user-components/bad-delivery/bad-delivery"
import Footer from "../../components/footer/footer"
import "../../App.css"
const BadDeliveryPage=()=>{
    return (
        <div className="App">
        <Header />
        <BadDelivery />
        <Footer />
        </div>
    )
}

export default BadDeliveryPage;