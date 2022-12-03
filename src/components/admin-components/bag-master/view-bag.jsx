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
import Swal from "sweetalert2";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
export default function StickyHeadTable({ props }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      props.setRefresh(false);
      try {
        let obj = {
          master_type: "bag-master",
        };
        let response = await axiosSuperAdminPrexo.post("/getMasters", obj);
        if (response.status === 200) {
          setLoading(true);
          props.setBagData(response.data.data);
          dataTableFun();
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [props.refresh]);
  //api for delete a employee
  const handelDelete = (masterId) => {
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
          let res = await axiosSuperAdminPrexo.get("/getOneMaster/" + masterId);
          if (res.status == 200) {
            let response = await axiosSuperAdminPrexo.delete(
              "/deleteMaster/" + masterId
            );
            if (response.status == 200) {
              $("#example").DataTable().destroy();
              Swal.fire("Deleted!", "Your Bag has been Deleted.", "success");
              const timer = setTimeout(() => {
                window.location.reload(false);
              }, 2000);
            }
          }
        } catch (error) {
          if (error.response.status == 400) {
            alert("You Can't Delete This Bag");
          } else {
            alert(error);
          }
        }
      }
    });
  };
  const handelAudit = (id) => {
    navigate("/audit-tab/" + id);
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
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer>
                <Table
                  id="example"
                  style={{ width: "100%" }}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Record.NO</TableCell>
                      <TableCell>Bag Id</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Warehouse</TableCell>
                      <TableCell>Bag Category</TableCell>
                      <TableCell>Bag Display Name</TableCell>
                      <TableCell>Bag Limit</TableCell>
                      <TableCell>Bag Display</TableCell>
                      <TableCell>status</TableCell>
                      <TableCell>Created Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.bagData.map((data, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{data.code}</TableCell>
                        <TableCell>{data.cpc}</TableCell>
                        <TableCell>{data.warehouse}</TableCell>
                        <TableCell>{data.type_taxanomy}</TableCell>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.limit}</TableCell>
                        <TableCell>{data.display}</TableCell>
                        <TableCell>{data.sort_id}</TableCell>
                        <TableCell>
                          {new Date(data.created_at).toLocaleString("en-GB", {
                            hour12: true,
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            sx={{
                              m: 1,
                            }}
                            variant="contained"
                            onClick={() => props.editbag(data._id)}
                            style={{ backgroundColor: "#206CE2" }}
                            component="span"
                          >
                            Edit
                          </Button>
                          <Button
                            sx={{
                              m: 1,
                            }}
                            variant="contained"
                            onClick={() => handelAudit(data.code)}
                            style={{ backgroundColor: "green" }}
                            component="span"
                          >
                            Audit
                          </Button>
                          <Button
                            sx={{
                              m: 1,
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
