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
import { useNavigate } from "react-router-dom";
/***************************************************************** */
export default function StickyHeadTable({ props }) {
  const navigate = useNavigate();

  useEffect(() => {
    props.setRefresh(false);
    try {
      const fetchData = async () => {
        let response = await axiosSuperAdminPrexo.get("/getUsers");
        if (response.status === 200) {
          props.setUsersData(response.data.data.user);
          dataTableFun();
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  //api for delete a employee
  const handelDeactive = (empId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be Deactive this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Deactivate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = await axiosSuperAdminPrexo.put(
            "/userDeactivate/" + empId
          );
          if (response.status == 200) {
            Swal.fire(
              "Deactivated!",
              "Your user has been Deactivated.",
              "success"
            );
            props.setRefresh(true);
            const timer = setTimeout(() => {
              window.location.reload(false);
            }, 2000);
          }
        } catch (error) {}
      }
    });
  };
  const handelActive = (empId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be Active this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Activate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response = await axiosSuperAdminPrexo.put(
            "/userActivate/" + empId
          );
          if (response.status == 200) {
            Swal.fire("Activated!", "Your user has been Activated.", "success");
            const timer = setTimeout(() => {
              window.location.reload(false);
            }, 2000);
          }
        } catch (error) {}
      }
    });
  };
  const handleUsersHistory = (e, username) => {
    e.preventDefault();
    navigate("/users-history/" + username);
  };
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
          <Paper sx={{ width: "100%", overflow: "auto" }}>
            <TableContainer>
              <Table
                id="example"
                style={{ width: "100%" }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead >
                  <TableRow style={{backgroundColor:"#228C23"}}>
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
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.usersData.map((data, index) => (
                    <TableRow
                      key={data._id}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {" "}
                        <img height="80px" width="100%" src={data.profile} />
                      </TableCell>
                      <TableCell>
                        {new Date(data.creation_date).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                      </TableCell>
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
                      {/* <TableCell>{data.is_super_admin}</TableCell> */}
                      <TableCell>{data.status}</TableCell>

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
                            mt: 1,
                          }}
                          type="submit"
                          variant="contained"
                          style={{ backgroundColor: "green" }}
                          onClick={(e) => {
                            handleUsersHistory(e, data.user_name);
                          }}
                        >
                          History
                        </Button>
                        {data.status == "Active" ? (
                          <Button
                            sx={{
                              mt: 1,
                            }}
                            variant="contained"
                            style={{ backgroundColor: "red" }}
                            component="span"
                            onClick={() => handelDeactive(data._id)}
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            sx={{
                              mt: 1,
                            }}
                            variant="contained"
                            style={{ backgroundColor: "red" }}
                            component="span"
                            onClick={() => handelActive(data._id)}
                          >
                            Activate
                          </Button>
                        )}
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
