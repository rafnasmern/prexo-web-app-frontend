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
import { axiosSuperAdminPrexo } from "../../../axios";
import Swal from "sweetalert2";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
export default function StickyHeadTable({ props }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [infraData, setInfraData] = useState([]);
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosSuperAdminPrexo.post("/getLocation");
        if (res.status == 200) {
          setInfraData(res.data.data);
          dataTableFun();
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, [props.refresh]);

  //api for delete a Location
  const handelDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Delete Location!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = await axiosSuperAdminPrexo.delete(
            "/deleteInfra/" + id
          );
          if (response.status == 200) {
            Swal.fire({
              position: "top-center",
              icon: "success",
              title: "Location has been Deleted",
              showConfirmButton: false,
            });
            const timer = setTimeout(() => {
              window.location.reload(false);
            }, 2000);
          }
        } catch (error) {
          alert(error);
        }
      }
    });
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
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
            mt: 5,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table
                style={{ width: "100%" }}
                id="example"
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Record.NO</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Pincode</TableCell>
                    {/* <TableCell>Type Taxanomy</TableCell> */}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infraData.map((data, index) => (
                    <TableRow key={data._id} hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.address}</TableCell>
                      <TableCell>{data.city}</TableCell>
                      <TableCell>{data.state}</TableCell>
                      <TableCell>{data.country}</TableCell>
                      <TableCell>{data.pincode}</TableCell>
                      {/* <TableCell>{data.type_taxanomy}</TableCell> */}
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => props.editUser(data._id)}
                          style={{ backgroundColor: "#206CE2" }}
                          component="span"
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{
                            ml: 2,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          component="span"
                          onClick={() => handelDelete(data._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
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
