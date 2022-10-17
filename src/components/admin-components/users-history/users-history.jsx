import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
} from "@mui/material";
import { axiosSuperAdminPrexo } from "../../../axios";
import Swal from "sweetalert2";
//Datatable Modules
import $ from 'jquery';
import 'datatables.net'
import { useParams } from 'react-router-dom'


export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [employeeData, setEmployeeData] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    try {
      const fetchData = async () => {
        let response = await axiosSuperAdminPrexo.post("/getUsersHistoy/" + username);
        if (response.status === 200) {
          setEmployeeData(response.data.data);
          dataTableFun()
        }
      }
      fetchData();
    } catch (error) {
      alert(error);
    }
  }
    , []);

  function dataTableFun() {
    $('#example').DataTable({
      destroy: true,
      scrollX: true
    });
  }


  return (
    <>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 17,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "auto" }}>
            <TableContainer >
              <Table id="example" style={{ width: "100%" }} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Record.NO</TableCell>
                    <TableCell>Profile</TableCell>
                    <TableCell>Created Time</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact No</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>User Name </TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Device Name</TableCell>
                    <TableCell>Device Id</TableCell>
                    <TableCell>Edited Date</TableCell>
                    <TableCell>Status</TableCell>
                 
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData.map((data, index) => (

                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {" "}
                        <img height="80px" width="80px" src={data.profile} />
                      </TableCell>
                      <TableCell>{new Date(data.creation_date).toLocaleString('en-GB', { hour12: true })}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.contact}</TableCell>
                      <TableCell>{data?.email}</TableCell>
                      <TableCell>{data.user_name}</TableCell>
                      <TableCell>{data.cpc}</TableCell>
                      <TableCell>{data.user_type}</TableCell>
                      {/* <TableCell>{data.warehouse}</TableCell>
                      <TableCell>{data.department}</TableCell>
                      <TableCell>{data.store}</TableCell>
                      <TableCell>{data.designation}</TableCell>
                      <TableCell>{data.reporting_manager}</TableCell> */}
                      <TableCell>{data.device_name}</TableCell>
                      <TableCell>{data.device_id}</TableCell>
                      <TableCell>{new Date(data.last_update_date).toLocaleString('en-GB', { hour12: true })}</TableCell>
                      <TableCell>{data.status}</TableCell>

                   

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
