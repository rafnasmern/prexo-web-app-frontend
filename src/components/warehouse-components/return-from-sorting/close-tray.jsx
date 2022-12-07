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
import { useParams } from "react-router-dom";
import "yup-phone";
import { useNavigate } from "react-router-dom";
import { axiosWarehouseIn } from "../../../axios";
import CircularProgress from "@mui/material/CircularProgress";

export default function DialogBox() {
  const navigate = useNavigate();
  const [trayData, setTrayData] = useState([]);
  const { trayId } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  /**************************************************************************** */
  const [refresh, setRefresh] = useState(false);
  const [uic, setUic] = useState("");
  const [description, setDescription] = useState([]);
  /************************************************************/
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(false);
        let response = await axiosWarehouseIn.post(
          "/charging-done-recieved/" + trayId
        );
        if (response.status === 200) {
          setTrayData(response.data.data);
          setPageLoading(true);
        }
      } catch (error) {
        if (error.response.status === 403) {
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      }
    };
    fetchData();
  }, [refresh]);
  /************************************************************************** */
  const addActualitem = async (obj) => {
    if (trayData?.items.length < trayData?.actual_items?.length) {
      alert("All Items are Verified");
    } else {
      try {
        let objData = {
          trayId: trayId,
          item: obj,
        };
        let res = await axiosWarehouseIn.post(
          "/sorting-done-put-item",
          objData
        );
        if (res?.status == 200) {
          setRefresh((refresh) => !refresh);
          setUic("");
        }
      } catch (error) {
        if (error.response.status == 403) {
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      }
    }
  };
  /************************************************************************** */
  const handelIssue = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (description == "") {
        alert("Please Add Description");
        setLoading(false);
      } else {
        trayData.description = description;
        let res = await axiosWarehouseIn.post(
          "/wht-tray-close-from-sorting",
          trayData
        );
        if (res.status == 200) {
          alert(res.data.message);
          setLoading(false);
          navigate("/return-from-sorting");
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelUic = async (e) => {
    if (e.target.value.length === 11) {
      try {
        let obj = {
          uic: e.target.value,
          trayId: trayId,
        };
        let res = await axiosWarehouseIn.post("/check-uic-sorting-done", obj);
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
  /***************************************************************************************** */
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
          <h6 style={{ marginLeft: "13px" }}>Tray ID - {trayId}</h6>
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
            Closed On --{" "}
            {new Date(trayData?.closed_time_sorting_agent).toLocaleString(
              "en-GB",
              {
                hour12: true,
              }
            )}
          </h6>
          <h6 style={{ marginRight: "13px" }}>Brand -- {trayData?.brand}</h6>
          <h6 style={{ marginRight: "13px" }}>Model -- {trayData?.model}</h6>
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Paper sx={{ width: "95%", overflow: "hidden", m: 1 }}>
            <h6>Expected</h6>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Total</h5>
                  <p style={{ paddingLeft: "5px", fontSize: "22px" }}>
                    {trayData?.items?.length}/{trayData?.limit}
                  </p>
                </Box>
              </Box>
              <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Valid</h5>
                  <p style={{ marginLeft: "14px", fontSize: "24px" }}>
                    {trayData?.items?.length}
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
                    <TableCell>IMEI</TableCell>
                    <TableCell>Brand Name</TableCell>
                    <TableCell>Model Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trayData?.items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.uic}</TableCell>
                      <TableCell>{data?.muic}</TableCell>
                      <TableCell>{data?.imei}</TableCell>
                      <TableCell>{data?.brand_name}</TableCell>
                      <TableCell>{data?.model_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Total</h5>
                  <p style={{ marginLeft: "5px", fontSize: "24px" }}>
                    {trayData?.actual_items?.length}/{trayData?.limit}
                  </p>
                </Box>
              </Box>
              <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Valid</h5>
                  <p style={{ marginLeft: "19px", fontSize: "24px" }}>
                    {trayData?.actual_items?.length}
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
                    <TableCell>IMEI</TableCell>
                    <TableCell>Brand Name</TableCell>
                    <TableCell>Model Name</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {trayData?.actual_items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.uic}</TableCell>
                      <TableCell>{data?.muic}</TableCell>
                      <TableCell>{data?.imei}</TableCell>
                      <TableCell>{data?.brand_name}</TableCell>
                      <TableCell>{data?.model_name}</TableCell>
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
            disabled={
              trayData?.items?.length == trayData?.actual_items?.length ||
              loading == false
                ? false
                : true
            }
            style={{ backgroundColor: "green" }}
            onClick={(e) => {
              if (window.confirm("You Want to Close?")) {
                handelIssue(e);
              }
            }}
          >
            Tray Close
          </Button>
        </Box>
      </div>
    </>
  );
}
