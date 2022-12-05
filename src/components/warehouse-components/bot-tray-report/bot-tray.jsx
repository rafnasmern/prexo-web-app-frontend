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
  Container,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export default function StickyHeadTable({ props }) {
  const [botTray, setBotTray] = useState([]);
  const [trayId, setTrayId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchData = async () => {
        setLoading(true);
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let res = await axiosWarehouseIn.post(
            "/getBotTrayReportScreen/" + location
          );
          if (res.status === 200) {
            setBotTray(res.data.data);
            setLoading(true);
            dataTableFun();
          }
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);

  const handelSearch = async (e) => {
    try {
      setLoading(true);
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        let obj = {
          location: location,
          botTray: trayId,
        };
        $("#example").DataTable().destroy();
        let res = await axiosWarehouseIn.post("/bot-tray-report", obj);
        if (res.status === 200) {
          setLoading(false);
          setBotTray(res.data.data.temp_array);
          dataTableFun();
        }
      }
    } catch (error) {
      if (error.response.status === 403) {
        alert(error.response.data.message);
        window.location.reload(false);
      } else {
        alert(error);
      }
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
    navigate("/tray-details/" + id);
  };
  const handelSkuSummery = (e, id) => {
    e.preventDefault();
    navigate("/bot-sku-summery/" + id);
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
        {loading == false ? (
          <Container>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                pt: 30,
              }}
            >
              <CircularProgress />
              <p style={{ paddingTop: "10px" }}>Loading...</p>
            </Box>
          </Container>
        ) : (
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
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>SKU Count</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {botTray.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>
                        {data.items.length}/ {data.limit}
                      </TableCell>
                      <TableCell>{data.issued_user_name}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>{data.temp_array.length}</TableCell>
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
                          View Item
                        </Button>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "green" }}
                          onClick={(e) => {
                            handelSkuSummery(e, data.code);
                          }}
                        >
                          Sku Summery
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
    </>
  );
}
