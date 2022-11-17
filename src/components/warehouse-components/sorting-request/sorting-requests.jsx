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
import { axiosMisUser } from "../../../axios";
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
          let { location } = jwt_decode(admin);
          let response = await axiosMisUser.post(
            "/view-sorting-item/" + location + "/" + "warehouse"
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

  const handelViewItem = (code) => {
    let isCheck = [];
    isCheck.push(code);
    navigate("/assign-for-sorting", {
      state: { isCheck: isCheck, type: "From Request" },
    });
  };
  const handelViewTrayForSorting = (e, code) => {
    e.preventDefault();
    navigate("/view-tray-for-sorting/" + code);
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  console.log(botTray);
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
                    <TableCell>BOT Tray Id</TableCell>
                    <TableCell>Sorting Agent</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    {/* <TableCell>Quantity</TableCell> */}
                    <TableCell>Status</TableCell>
                    <TableCell>WHT Tray</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {botTray?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {data.tray?.[0]?.botTray?.join(", ")}
                      </TableCell>
                      <TableCell>{data._id}</TableCell>
                      {/* <TableCell>
                        {" "}
                        {new Date(
                          data?.tray[0].closed_time_wharehouse_from_bot
                        ).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell> */}
                      <TableCell>
                        {" "}
                        {new Date(
                          data?.tray[0]?.status_change_time
                        ).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>

                      <TableCell>{data?.tray?.[0].sort_id}</TableCell>
                      <TableCell>
                        {data.tray?.[0]?.WhtTray?.join(", ")}
                      </TableCell>
                      <TableCell>
                        {/* <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          onClick={() => handelViewItem(data.code)}
                          style={{ backgroundColor: "#008CBA" }}
                          component="span"
                        >
                          View Details
                        </Button> */}
                        {data.sort_id == "Assigned to sorting agent" ? (
                          <Button
                            sx={{
                              m: 1,
                            }}
                            variant="contained"
                            onClick={(e) =>
                              handelViewTrayForSorting(e, data.code)
                            }
                            style={{ backgroundColor: "green" }}
                            component="span"
                          >
                            Handover to Agent
                          </Button>
                        ) : (
                          <Button
                            sx={{
                              m: 1,
                            }}
                            variant="contained"
                            onClick={(e) =>
                              handelViewTrayForSorting(e, data._id)
                            }
                            style={{ backgroundColor: "green" }}
                            component="span"
                          >
                            Issue Trays
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
