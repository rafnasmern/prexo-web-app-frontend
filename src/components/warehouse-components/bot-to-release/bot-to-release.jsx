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
import { axiosWarehouseIn } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [whtTray, setWhtTray] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let response = await axiosWarehouseIn.post(
            "/release-bot-tray/" + location + "/" + "Closed By Sorting Agent"
          );
          if (response.status === 200) {
            setWhtTray(response.data.data);
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
  }, [refresh]);

  const handelRelease = async (e, trayId) => {
    try {
      setLoading(true);
      let res = await axiosWarehouseIn.post(
        "/approve-release-bot-tray/" + trayId
      );
      if (res.status === 200) {
        setLoading(false);
        alert(res.data.message);
        $("#example").DataTable().destroy();
        setRefresh((refresh) => !refresh);
      }
    } catch (error) {
      alert(error);
    }
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelViewTray = (e, id) => {
    e.preventDefault();
    navigate("/bot-release-view-item/" + id);
  };

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
                    <TableCell>Sorting Agent</TableCell>
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Tray Category</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {whtTray.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.issued_user_name}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>

                      <TableCell>
                        {" "}
                        {data.items.length}/{data.limit}
                      </TableCell>
                      <TableCell>{data.sort_id}</TableCell>

                      <TableCell>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "#206CE2" }}
                          onClick={(e) => {
                            handelViewTray(e, data.code);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          disabled={loading}
                          onClick={(e) => {
                            if (window.confirm("You Want to Release?")) {
                              handelRelease(e, data.code);
                            }
                          }}
                          style={{ backgroundColor: "green" }}
                          component="span"
                        >
                          Release Tray
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
