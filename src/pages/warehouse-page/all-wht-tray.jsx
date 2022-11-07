import React from "react"
import Header from "../../components/header/Header"
import AllWhtTray from "../../components/warehouse-components/all-wht-tray/wht-tray"
import Footer from "../../components/footer/footer"
import "../../App.css"
const AllWhtTrayPage=()=>{
    return (
        <div  className="App">
        <Header />
        <AllWhtTray />
        <Footer />
        </div>
    )
}

export default AllWhtTrayPage;