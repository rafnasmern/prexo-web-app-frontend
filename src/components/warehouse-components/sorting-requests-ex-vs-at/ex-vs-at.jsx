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
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import "yup-phone";
import { useNavigate } from "react-router-dom";
import { axiosWarehouseIn } from "../../../axios";
export default function DialogBox() {
  const navigate = useNavigate();
  const [trayData, setTrayData] = useState([]);
  const { trayId } = useParams();
  const [loading, setLoading] = useState(false);
  /**************************************************************************** */
  const [uic, setUic] = useState("");
  const [description, setDescription] = useState([]);
  const [refresh, setRefresh] = useState(false);
  /*********************************************************** */

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post(
          "/get-tray-sorting/" + trayId
        );
        if (response.status === 200) {
          setTrayData(response.data.data);
          //   dataTableFun()
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
    if (trayData.limit <= trayData?.actual_items?.length) {
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
  const handelIssue = async (e) => {
    e.preventDefault();
    navigate(-1);
  };
  const handelDelete = async (id) => {
    try {
      let obj = {
        trayId: trayId,
        id: id,
      };
      let data = await axiosWarehouseIn.put("/actualBagItem", obj);
      if (data.status == 200) {
        alert(data.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  /*********************************TRAY ASSIGNEMENT********************************** */

  /***************************************************************************************** */
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
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
        {/* <Box
          sx={{
            float: "right",
          }}
        >
          <h6 style={{ marginRight: "13px" }}>Brand -- {trayData?.brand}</h6>
          <h6 style={{ marginRight: "13px" }}>Model -- {trayData?.model}</h6>
        </Box> */}
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
                      <TableCell>{data?.user_name}</TableCell>
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
                      <TableCell>{data?.user_name}</TableCell>
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
          <Button
            sx={{ m: 3, mb: 9 }}
            variant="contained"
            disabled={loading == true ? true : false}
            style={{ backgroundColor: "green" }}
            onClick={(e) => {
              handelIssue(e);
            }}
          >
            Back to List
          </Button>
        </Box>
      </div>
    </>
  );
}
