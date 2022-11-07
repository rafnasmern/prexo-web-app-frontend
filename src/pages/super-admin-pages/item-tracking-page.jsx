import React from "react"
import Header from "../../components/header/Header"
import ItemTracking from "../../components/admin-components/item-tracking/tracking"
import Footer from "../../components/footer/footer"
import "../../App.css"
const ItemTrackingPage=()=>{
    return (
        <div className="App">
        <Header />
        <ItemTracking />
        <Footer />
        </div>
    )
}

export default ItemTrackingPage;