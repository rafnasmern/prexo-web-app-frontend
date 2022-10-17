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
  const [mastersData,setMastersData]=useState([])
 

  useEffect(() => {
   
   
     try {
        const fetchData= async()=>{
         let res=await axiosSuperAdminPrexo.get("/masters")
         if(res.status==200){
         
             setMastersData(res.data.data)
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
                    <TableCell>Type Taxanomy</TableCell>
                    <TableCell>Parent Id</TableCell>
                    <TableCell>Sort Id</TableCell>
                    <TableCell>From Time</TableCell>
                    <TableCell>To Time</TableCell>
                    <TableCell>Prefix</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {mastersData.map((data,index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>{data.parent_id}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>{data.from_time}</TableCell>
                      <TableCell>{data.to_time}</TableCell>
                      <TableCell>{data.prefix}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[2, 25, 100]}
              component="div"
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
}
