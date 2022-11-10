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
import {
  axiosMisUser,
  axiosSortingAgent,
  axiosWarehouseIn,
} from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
export default function StickyHeadTable({ props }) {
  const [botTray, setBotTray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { user_name } = jwt_decode(admin);
          let response = await axiosSortingAgent.post(
            "/get-assigned-sorting-tray/" + user_name
          );
          if (response.status === 200) {
            setBotTray(response.data.data);
            dataTableFun();
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);
  const handelViewItem = (e, code) => {
    e.preventDefault();
    navigate("/view-tray-for-sorting/" + code);
  };
  const handelStartSorting = (e, code) => {
    e.preventDefault();
    navigate("/start-sorting/" + code);
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
            mt: 13,
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
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Record.NO</TableCell>
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Sorting Agent</TableCell>
                    <TableCell>Closure Date</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {botTray.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.issued_user_name}</TableCell>
                      <TableCell>
                        {" "}
                        {new Date(
                          data.closed_time_wharehouse_from_bot
                        ).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {new Date(data.status_change_time).toLocaleString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        {data.items.length}/{data.limit}
                      </TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          onClick={(e) => handelViewItem(e, data.code)}
                          style={{ backgroundColor: "#008CBA" }}
                          component="span"
                        >
                          View Details
                        </Button>

                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          onClick={(e) => handelStartSorting(e, data.code)}
                          style={{ backgroundColor: "green" }}
                          component="span"
                        >
                          Start Sorting
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
