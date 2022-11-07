import React from "react"
import Header from "../../components/header/Header"
import BadOrders from "../../components/mis-user-components/bad-orders/bad-orders"
import Footer from "../../components/footer/footer"
import "../../App.css"
const BadOrdersPage=()=>{
    return (
        <div className="App">
        <Header />
        <BadOrders />
        <Footer />
        </div>
    )
}

export default BadOrdersPage;