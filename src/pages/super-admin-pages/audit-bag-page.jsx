import React from "react"
import Header from "../../components/header/Header"
import AuditBag from "../../components/admin-components/audit-bag/audit-bag"
import Footer from "../../components/footer/footer"
import "../../App.css"
const auditBagPage=()=>{
    return (
        <div className="App">
        <Header />
        <AuditBag />
        <Footer />
        </div>
    )
}

export default auditBagPage;