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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import "yup-phone";
import { axiosBqc, axiosWarehouseIn } from "../../../axios";
export default function DialogBox() {
  const navigate = useNavigate();
  const [trayData, setTrayData] = useState([]);
  const { trayId } = useParams();
  /**************************************************************************** */
  const [uic, setUic] = useState("");
  const [description, setDescription] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [resDataUic, setResDataUic] = useState({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  /*********************************************************** */

  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { user_name } = jwt_decode(admin);
          let response = await axiosBqc.post(
            "/assigned-wht-item/" +
              trayId +
              "/" +
              user_name +
              "/" +
              "Issued to BQC"
          );
          if (response.status === 200) {
            setTrayData(response.data.data);
            //   dataTableFun()
          }
        }
      } catch (error) {
        if (error.response.status === 403) {
          alert(error.response.data.message);
          navigate(-1);
        } else {
          alert(error);
        }
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
          setOpen(true);
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
    if (trayData.limit <= trayData?.actual_items?.length) {
      alert("All Items Scanned");
    } else {
      resDataUic.remark = description;
      try {
        let objData = {
          trayId: trayId,
          item: obj,
        };
        let res = await axiosWarehouseIn.post("/wht-add-actual-item", objData);
        if (res.status == 200) {
          setUic("");
          setRefresh((refresh) => !refresh);
          handleClose();
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  /************************************************************************** */
  const handelIssue = async (e) => {
    try {
      if (description == "") {
        alert("Please Add Description");
      } else if (trayData?.actual_items?.length == trayData?.items?.length) {
        setLoading(true);
        let obj = {
          trayId: trayId,
          description: description,
        };
        let res = await axiosBqc.post("/bqc-in", obj);
        if (res.status == 200) {
          alert(res.data.message);
          setLoading(false);
          navigate("/view-assigned-tray-bqc");
        }
      } else {
        alert("Please Verify Actual Data");
      }
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };
  return (
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
          <h6 style={{ marginRight: "13px" }}>Brand -- {trayData?.brand}</h6>
          <h6 style={{ marginRight: "13px" }}>Model -- {trayData?.model}</h6>
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
          disabled={loading}
          style={{ backgroundColor: "green" }}
          onClick={() => {
            if (window.confirm("Are you want to BQC IN?")) {
              handelIssue();
            }
          }}
        >
          BQC IN
        </Button>
      </Box>
    </>
  );
}
