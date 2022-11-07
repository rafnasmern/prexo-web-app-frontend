import React from "react"
import Header from "../../components/header/Header"
import BagMaster from "../../components/admin-components/bag-master/add-bag"
import Footer from "../../components/footer/footer"
import "../../App.css"
const BagMasterPage=()=>{
    return (
        <div className="App">
        <Header />
        <BagMaster />
        <Footer />
        </div>
    )
}

export default BagMasterPage;