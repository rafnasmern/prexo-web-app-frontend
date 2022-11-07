import React from "react"
import Header from "../../components/header/Header"
import BotBags from "../../components/bot-bags/bot-bags"
import Footer from "../../components/footer/footer"
import "../../App.css"
const deliveryImport=()=>{
    return (
        <div className="App">
        <Header />
        <BotBags />
        <Footer />
        </div>
    )
}

export default deliveryImport;