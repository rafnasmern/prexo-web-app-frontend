import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Container,
} from "@mui/material";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import "yup-phone";
import { useNavigate } from "react-router-dom";
// import jwt from "jsonwebtoken"
import CircularProgress from "@mui/material/CircularProgress";
import { axiosWarehouseIn } from "../../../axios";
export default function DialogBox() {
  const navigate = useNavigate();
  const [trayData, setTrayData] = useState([]);
  const { trayId } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  /**************************************************************************** */
  const [uic, setUic] = useState("");
  const [description, setDescription] = useState([]);
  const [refresh, setRefresh] = useState(false);
  /*********************************************************** */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(false);
        let response = await axiosWarehouseIn.post("/getWhtTrayItem/" + trayId);
        if (response.status === 200) {
          setTrayData(response.data.data);
          setPageLoading(true);
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [refresh]);

  const handelUic = async (e) => {
    if (e.target.value.length === 11) {
      try {
        let obj = {
          uic: e.target.value,
          trayId: trayId,
        };
        let res = await axiosWarehouseIn.post("/check-uic", obj);
        if (res?.status == 200) {
          addActualitem(res.data.data);
        }
      } catch (error) {
        if (error.response.status == 403) {
          setUic("");
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      }
    }
  };
  /************************************************************************** */
  const addActualitem = async (obj) => {
    if (trayData.items.length < trayData?.actual_items?.length) {
      alert("All Items Scanned");
    } else {
      try {
        let objData = {
          trayId: trayId,
          item: obj,
        };
        let res = await axiosWarehouseIn.post("/wht-add-actual-item", objData);
        if (res.status == 200) {
          setUic("");
          setRefresh((refresh) => !refresh);
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  /************************************************************************** */
  const handelIssue = async (e, sortId) => {
    try {
      setLoading(true);
      if (description == "") {
        alert("Please Add Description");
        setLoading(false);
      } else if (trayData?.actual_items?.length == trayData?.items?.length) {
        let obj = {
          trayId: trayId,
          description: description,
          sortId: trayData?.sort_id,
        };
        let res = await axiosWarehouseIn.post("/issue-to-agent-wht", obj);
        if (res.status == 200) {
          alert(res.data.message);
          if (trayData?.sort_id == "Send for BQC") {
            setLoading(false);
            navigate("/bqc-request");
          } else {
            setLoading(false);
            navigate("/charging-request");
          }
        }
      } else {
        setLoading(false);
        alert("Please Verify Actual Data");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      {pageLoading === false ? (
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
        <>
          <Box
            sx={{
              mt: 11,
              height: 70,
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                float: "left",
              }}
            >
              <h6 style={{ marginLeft: "13px" }}>TRAY ID - {trayId}</h6>
              <h6 style={{ marginLeft: "13px" }}>
                AGENT NAME - {trayData?.issued_user_name}
              </h6>
            </Box>
            <Box
              sx={{
                float: "right",
              }}
            >
              <h6 style={{ marginRight: "13px" }}>
                Brand -- {trayData?.brand}
              </h6>
              <h6 style={{ marginRight: "13px" }}>
                Model -- {trayData?.model}
              </h6>
            </Box>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Paper sx={{ width: "95%", overflow: "hidden", m: 1 }}>
                <Box sx={{}}>
                  <Box
                    sx={{
                      float: "left",
                      ml: 2,
                    }}
                  >
                    <h6>Expected</h6>
                  </Box>
                  <Box
                    sx={{
                      float: "right",
                      mr: 2,
                    }}
                  >
                    <Box sx={{}}>
                      <h5>Total</h5>
                      <p style={{ paddingLeft: "5px", fontSize: "22px" }}>
                        {
                          trayData?.items?.filter(function (item) {
                            return item.status != "Duplicate";
                          }).length
                        }
                        /{trayData?.limit}
                      </p>
                    </Box>
                  </Box>
                </Box>
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
                        <TableCell>MUIC</TableCell>
                        <TableCell>BOT Tray</TableCell>
                        <TableCell>BOT Agent</TableCell>
                        {/* <TableCell>Tracking Number</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trayData?.items?.map((data, index) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data?.uic}</TableCell>
                          <TableCell>{data?.muic}</TableCell>
                          <TableCell>{data?.tray_id}</TableCell>
                          <TableCell>{data?.bot_agent}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
                <Box sx={{}}>
                  <Box
                    sx={{
                      float: "left",
                      ml: 2,
                    }}
                  >
                    <h6>ACTUAL</h6>
                    <TextField
                      sx={{ mt: 1 }}
                      id="outlined-password-input"
                      type="text"
                      name="doorsteps_diagnostics"
                      label="Please Enter UIC"
                      value={uic}
                      // onChange={(e) => setAwbn(e.target.value)}
                      onChange={(e) => {
                        setUic(e.target.value);
                        handelUic(e);
                      }}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      float: "right",
                      mr: 2,
                    }}
                  >
                    <Box sx={{}}>
                      <h5>Total</h5>
                      <p style={{ marginLeft: "5px", fontSize: "24px" }}>
                        {
                          trayData.actual_items?.filter(function (item) {
                            return item.status != "Duplicate";
                          }).length
                        }
                        /{trayData?.limit}
                      </p>
                    </Box>
                  </Box>
                </Box>
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
                        <TableCell>MUIC</TableCell>
                        <TableCell>BOT Tray</TableCell>
                        <TableCell>BOT Agent</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {trayData?.actual_items?.map((data, index) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data?.uic}</TableCell>
                          <TableCell>{data?.muic}</TableCell>
                          <TableCell>{data?.tray_id}</TableCell>
                          <TableCell>{data?.bot_agent}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
          <div style={{ float: "right" }}>
            <Box sx={{ float: "right" }}>
              <textarea
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                style={{ width: "400px" }}
                placeholder="Description"
              ></textarea>
              <Button
                sx={{ m: 3, mb: 9 }}
                variant="contained"
                disabled={loading == true ? true : false}
                style={{ backgroundColor: "green" }}
                onClick={(e) => {
                  if (window.confirm("You Want to Issue?")) {
                    handelIssue(e);
                  }
                }}
              >
                Issue To Agent
              </Button>
            </Box>
          </div>
        </>
      )}
    </>
  );
}
