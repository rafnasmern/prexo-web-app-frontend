import React from "react"
import Header from "../../components/header/Header"
import AuditTray from "../../components/admin-components/audit-tray/audit-tray"
import Footer from "../../components/footer/footer"
import "../../App.css"

const AuditTrayPage=()=>{
    return (
        <div className="App">
        <Header />
        <AuditTray />
        <Footer />
        </div>
    )
}

export default AuditTrayPage;