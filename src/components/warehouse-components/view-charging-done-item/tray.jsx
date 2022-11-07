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
import { axiosBot } from "../../../axios";
import { useNavigate, useParams } from "react-router-dom";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
export default function StickyHeadTable({ props }) {
  const [trayData, setTrayData] = useState([]);
  const { trayId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const fetchData = async () => {
          let res = await axiosBot.post("/trayItem/" + trayId);
          if (res.status === 200) {
            setTrayData(res.data.data);
            dataTableFun();
          }
        };
        fetchData();
      } else {
        navigate("/");
      }
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
                    <TableCell>S.NO</TableCell>
                    <TableCell>UIC</TableCell>
                    <TableCell>IMEI</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Battery Status</TableCell>
                    <TableCell>Charge Percentage</TableCell>
                    <TableCell>Body Condiation</TableCell>
                    <TableCell>Display Condiation</TableCell>
                    <TableCell>Lock Status</TableCell>
                    <TableCell>Charging Jack Type</TableCell>
                    <TableCell>Body Part missing</TableCell>
                    <TableCell>CIMEI-1</TableCell>
                    <TableCell>CIMEI-2</TableCell>
                    {/* <TableCell>Added Date Time</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trayData?.actual_items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.uic}</TableCell>
                      <TableCell>{data.imei}</TableCell>
                      <TableCell>{trayData.brand}</TableCell>
                      <TableCell>{trayData.model}</TableCell>
                      <TableCell>{data.charging.battery_status}</TableCell>
                      <TableCell>{data.charging.charge_percentage}</TableCell>
                      <TableCell>{data.charging.body_condition}</TableCell>
                      <TableCell>{data.charging.display_condition}</TableCell>
                      <TableCell>{data.charging.lock_status}</TableCell>
                      <TableCell>{data.charging.charging_jack_type}</TableCell>
                      <TableCell>{data.charging.part_name}</TableCell>
                      <TableCell>{data.charging.cimei_1}</TableCell>
                      <TableCell>{data.charging.cimei_2}</TableCell>
                      {/* <TableCell>
                        {new Date(data.added_time).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                      </TableCell> */}
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
