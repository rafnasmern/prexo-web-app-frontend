import React from "react"
import Header from "../../components/header/Header"
import RevalidateBadDelivery from "../../components/mis-user-components/revalidate-delivery/revalidate-bad-delivery"
import Footer from "../../components/footer/footer"
import "../../App.css"
const RevalidateBadDeliveryPage=()=>{
    return (
        <div className="App">
        <Header />
        <RevalidateBadDelivery />
        <Footer />
        </div>
    )
}

export default RevalidateBadDeliveryPage;