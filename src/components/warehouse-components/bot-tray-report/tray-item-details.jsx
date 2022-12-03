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
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import $ from "jquery";
import "datatables.net";
import { useNavigate, useParams } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [botTray, setBotTray] = useState([]);
  const { trayId, muic } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let user = localStorage.getItem("prexo-authentication");
        if (user) {
          let { location } = jwt_decode(user);
          let res = await axiosWarehouseIn.post(
            "/bot-tray-report-item-details/" +
              location +
              "/" +
              trayId +
              "/" +
              muic
          );
          if (res.status === 200) {
            setBotTray(res.data.data.temp_array);
            dataTableFun();
          }
        }
      } catch (error) {
        if (error.response.status === 403) {
          alert(error.response.data.message);
          navigate("/bot-tray-report");
        } else {
          alert(error);
        }
      }
    };
    fetchData();
  }, []);

  //   const handelAudit = (id) => {
  //     navigate("/audit-tray/" + id);
  //   };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /****************************************************************** */

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
                    <TableCell>UIC</TableCell>
                    <TableCell>MUIC</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Tracking Id</TableCell>
                    <TableCell>Order Id</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>BOT ID</TableCell>
                    {/* <TableCell>Closed On</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {botTray[0]?.item?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.uic}</TableCell>
                      <TableCell>{botTray[0].muic}</TableCell>
                      <TableCell>{botTray[0].brand}</TableCell>
                      <TableCell>{botTray[0].model}</TableCell>
                      <TableCell>{data.awbn_number}</TableCell>
                      <TableCell>{data.order_id}</TableCell>

                      <TableCell>
                        {new Date(data.order_date).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell>{data.bag_id}</TableCell>
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
