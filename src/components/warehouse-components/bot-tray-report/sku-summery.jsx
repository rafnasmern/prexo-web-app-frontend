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
  TextField,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate, useParams } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [botTray, setBotTray] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { trayId } = useParams();

  useEffect(() => {
    try {
      const fetchData = async () => {
        setLoading(true);
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let obj = {
            location: location,
            botTray: trayId,
          };
          let res = await axiosWarehouseIn.post("/bot-tray-report", obj);
          if (res.status === 200) {
            setLoading(false);
            setBotTray(res.data.data.temp_array);
            dataTableFun();
          }
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);

  //   const handelSearch = async (e) => {
  //     try {
  //       setLoading(true);
  //       let admin = localStorage.getItem("prexo-authentication");
  //       if (admin) {
  //         let { location } = jwt_decode(admin);
  //         let obj = {
  //           location: location,
  //           botTray: trayId,
  //         };
  //         $("#example").DataTable().destroy();
  //         let res = await axiosWarehouseIn.post("/bot-tray-report", obj);
  //         if (res.status === 200) {
  //           setLoading(false);
  //           setBotTray(res.data.data.temp_array);
  //           dataTableFun();
  //         }
  //       }
  //     } catch (error) {
  //       if (error.response.status === 403) {
  //         alert(error.response.data.message);
  //         window.location.reload(false);
  //       } else {
  //         alert(error);
  //       }
  //     }
  //   };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelViewTray = (e, muic) => {
    e.preventDefault();
    navigate("/bot-tray-report-details/" + trayId + "/" + muic);
  };
  return (
    <>
      {/* <Box
        sx={{
          float: "left",
          mt: 10,
          ml: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "start",
          }}
        >
          <TextField
            onChange={(e) => {
              setTrayId(e.target.value);
            }}
            label="Enter BOT Tray ID"
            variant="outlined"
            sx={{ m: 2 }}
          />
          <Button
            sx={{
              ml: 1,

              height: "44px",
            }}
            disabled={trayId == ""}
            variant="contained"
            style={{ backgroundColor: "green", marginTop: "19px" }}
            width="20px"
            onClick={(e) => {
              handelSearch(e);
            }}
          >
            Search
          </Button>
        </Box>
      </Box> */}
      <Box
        sx={{
          top: { sm: 60, xs: 20 },
          left: { sm: 250 },
          m: 3,
          mt: 12,
          display: "flex",
          flexDirection: "cloumn",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ width: "100%", overflow: "auto", mb: 2 }}>
          <TableContainer>
            <Table
              id="example"
              style={{ width: "100%" }}
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Record.NO</TableCell>
                  <TableCell>MUIC</TableCell>
                  <TableCell>Brand Name</TableCell>
                  <TableCell>Model Name</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>Open WHT</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {botTray.map((data, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{data.muic}</TableCell>
                    <TableCell>{data.brand}</TableCell>
                    <TableCell>{data.model}</TableCell>
                    <TableCell>{data.item.length}</TableCell>
                    <TableCell>{data.wht_tray?.join(", ")}</TableCell>

                    <TableCell>
                      <Button
                        sx={{
                          m: 1,
                        }}
                        variant="contained"
                        style={{ backgroundColor: "green" }}
                        onClick={(e) => {
                          handelViewTray(e, data.muic);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
}
