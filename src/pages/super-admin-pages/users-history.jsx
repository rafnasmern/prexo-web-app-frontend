import React from "react"
import Header from "../../components/header/Header"
import UsersHistory from "../../components/admin-components/users-history/users-history"
import Footer from "../../components/footer/footer"
import "../../App.css"
const UsersHistoryPage=()=>{
    return (
        <div className="App">
        <Header />
        <UsersHistory />
        <Footer />
        </div>
    )
}

export default UsersHistoryPage;