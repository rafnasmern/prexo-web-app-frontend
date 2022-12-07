import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Container,
  TableRow,
  Box,
  Button,
} from "@mui/material";
import { axiosSuperAdminPrexo } from "../../../axios";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
/************************************************************************************** */

export default function StickyHeadTable({ props }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false);
        let response = await axiosSuperAdminPrexo.post("/getAllProducts");
        if (response.status === 200) {
          setLoading(true);
          props.setProductsData(response.data.data);
          dataTableFun();
        }
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);
  //api for delete a employee
  const handelDelete = (prdodutId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to Delete Product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let res = await axiosSuperAdminPrexo.get(
            "/getEditProduct/" + prdodutId
          );
          if (res.status === 200) {
            let response = await axiosSuperAdminPrexo.delete(
              "/deleteProduct/" + prdodutId
            );
            if (response.status === 200) {
              Swal.fire(
                "Deleted!",
                "Your Product has been Deleted.",
                "success"
              );
              const timer = setTimeout(() => {
                window.location.reload(false);
              }, 2000);
            }
          }
        } catch (error) {
          if (error.response.status === 400) {
            alert("You Can't Delete This Product");
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
      paging: true,
      deferRender: true,
      responsive: true,
    });
  }

  return (
    <>
      <Box style={{ overflow: "hidden" }}>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 5,
            display: "flex",
            flexDirection: "cloumn",
          }}
        >
          {loading == false ? (
            <Container>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CircularProgress />
                <p style={{ paddingTop: "10px" }}>Loading...</p>
              </Box>
            </Container>
          ) : (
            <Paper sx={{ width: "100%" }}>
              <TableContainer>
                <Table style={{ width: "100%" }} id="example">
                  <TableHead>
                    <TableRow>
                      <TableCell>Record.NO</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Vendor SKU ID</TableCell>
                      <TableCell>Brand Name</TableCell>
                      <TableCell>Model Name</TableCell>
                      <TableCell>Vendor Name</TableCell>
                      <TableCell>MUIC</TableCell>
                      <TableCell>Creation Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.productsData.map((data, index) => (
                      <TableRow key={data._id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <img
                            height="80px"
                            width="80px"
                            src={
                              data.image == undefined
                                ? "http://prexo-v3-adminapi.dealsdray.com/product/image/" +
                                  data.vendor_sku_id +
                                  ".jpg"
                                : data.image
                            }
                          />
                        </TableCell>
                        <TableCell>{data.vendor_sku_id}</TableCell>
                        <TableCell>{data.brand_name}</TableCell>
                        <TableCell>{data.model_name}</TableCell>
                        <TableCell>{data.vendor_name}</TableCell>
                        <TableCell>{data.muic}</TableCell>
                        <TableCell>
                          {new Date(data.created_at).toLocaleString("en-GB", {
                            hour12: true,
                          })}
                        </TableCell>
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
                            onClick={() => props.editImage(data._id)}
                            style={{ backgroundColor: "green" }}
                            component="span"
                          >
                            Edit Image
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
          )}
        </Box>
      </Box>
    </>
  );
}
