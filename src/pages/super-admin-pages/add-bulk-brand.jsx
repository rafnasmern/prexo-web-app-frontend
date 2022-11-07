import React from "react"
import Header from "../../components/header/Header"
import AddBulk from "../../components/admin-components/add-bulk-brand/add-bulk"
import Footer from "../../components/footer/footer"
import "../../App.css"
const AddBulkPage=()=>{
    return (
        <div  className="App">
        <Header />
        <AddBulk />
        <Footer />
        </div>
    )
}

export default AddBulkPage;