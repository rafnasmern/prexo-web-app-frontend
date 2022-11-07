import React from "react"
import Header from "../../components/header/Header"
import BulkTray from "../../components/bulk-tray/bulk-tray"
import Footer from "../../components/footer/footer"
import "../../App.css"
const BulkTrayPage=()=>{
    return (
        <div className="App">
        <Header />
        <BulkTray />
        <Footer />
        </div>
    )
}

export default BulkTrayPage;