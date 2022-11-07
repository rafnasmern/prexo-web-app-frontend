import React from "react"
import Header from "../../components/header/Header"
import Uicdownload from "../../components/mis-user-components/uic-download/uis-download"
import Footer from "../../components/footer/footer"
import "../../App.css"
const uicDownloadPage=()=>{
    return (
        <div className="App">
        <Header />
        <Uicdownload />
        <Footer />
        </div>
    )
}

export default uicDownloadPage;