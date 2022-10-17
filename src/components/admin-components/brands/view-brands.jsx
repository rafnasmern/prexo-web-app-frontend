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
import $ from "jquery";
import "datatables.net";

export default function StickyHeadTable({ props }) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        $("#example").DataTable().destroy();
        let response = await axiosSuperAdminPrexo.post("/getBrands");
        if (response.status === 200) {
          props.setBrandData(response.data.data);
          props.setRefresh(false);
          dataTableFun();
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [props.refresh]);
  //api for delete a employee
  const handelDelete = (brandId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You Want to Delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await axiosSuperAdminPrexo.get("/getBrandOne/" + brandId);
          if (res.status == 200) {
            let response = await axiosSuperAdminPrexo.delete(
              "/deleteBrand/" + brandId
            );
            if (response.status == 200) {
              $("#example").DataTable().destroy();
              Swal.fire("Deleted!", "Your Brand has been Deleted.", "success");
              const timer = setTimeout(() => {
                window.location.reload(false);
              }, 2000);
              props.setRefresh(true);
            }
          }
        } catch (error) {
          if (error.response.status == 400) {
            alert("This Brand You Can't Delete");
          } else {
            alert(error);
          }
        }
      }
    });
  };

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
      fixedHeader: true,
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
            mt: 7,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table style={{ width: "100%" }} id="example">
                <TableHead>
                  <TableRow>
                    <TableCell>Record.NO</TableCell>
                    <TableCell>Brand Id</TableCell>
                    <TableCell>Brand Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.brandData.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.brand_id}</TableCell>
                      <TableCell>{data.brand_name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => props.editBrand(data._id)}
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
