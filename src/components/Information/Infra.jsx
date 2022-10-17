import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  Button,
} from "@mui/material";
import { axiosSuperAdminPrexo } from "../../axios";
import Swal from "sweetalert2";

export default function StickyHeadTable({ props }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [infraData,setInfraData]=useState([])
 

  useEffect(() => {
     try {
        const fetchData= async()=>{
         let res=await axiosSuperAdminPrexo.get("/infra")
         if(res.status==200){
          
             setInfraData(res.data.data)
         }
        }
         fetchData()
     } catch (error) {
         alert(error)
   }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs:20 },
            left: { sm: 250 },
            m: 3,
            mt:10,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>S.NO</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Pincode</TableCell>
                    <TableCell>Type Taxanomy</TableCell>
                    <TableCell>Padrent Id</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infraData.map((data,index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.category}</TableCell>
                      <TableCell>{data.address}</TableCell>
                      <TableCell>{data.city}</TableCell>
                      <TableCell>{data.state}</TableCell>
                      <TableCell>{data.country}</TableCell>
                      <TableCell>{data.pincode}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>{data.parent_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
