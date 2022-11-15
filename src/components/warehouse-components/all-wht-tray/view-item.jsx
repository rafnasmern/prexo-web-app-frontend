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
import { axiosSuperAdminPrexo, axiosWarehouseIn } from "../../../axios";
//Datatable Modules
import Checkbox from "@mui/material/Checkbox";
import $ from "jquery";
import "datatables.net";
import { useNavigate, useParams } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [whtTray, setWhtTray] = useState([]);
  const { trayId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post("/getWhtTrayItem/" + trayId);
        if (response.status === 200) {
          if (response.data.data?.items?.length == 0) {
            setWhtTray(response.data.data.actual_items);
          } else {
            setWhtTray(response.data.data.items);
          }
          dataTableFun();
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  const handelAudit = (id) => {
    navigate("/audit-tray/" + id);
  };
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
                    <TableCell>BOT Tray</TableCell>
                    <TableCell>BOT Agent</TableCell>
                    {/* <TableCell>Closed On</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {whtTray?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.uic}</TableCell>
                      <TableCell>{data.muic}</TableCell>
                      <TableCell>{data.brand_name}</TableCell>
                      <TableCell>{data.model_name}</TableCell>
                      <TableCell>{data.tracking_id}</TableCell>
                      <TableCell>{data.tray_id}</TableCell>
                      <TableCell>{data.bot_agent}</TableCell>

                      {/* <TableCell>
                        {new Date(data.closed_time).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
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
