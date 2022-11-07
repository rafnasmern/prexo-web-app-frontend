import React from "react"
import Header from "../../components/header/Header"
import AssignToBot from "../../components/mis-user-components/assign-to-bot/assing-to-bot"
import Footer from "../../components/footer/footer"
import "../../App.css"
const AssignToBotPage=()=>{
    return (
        <div className="App">
        <Header />
        <AssignToBot />
        <Footer />
        </div>
    )
}

export default AssignToBotPage;