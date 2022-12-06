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
import Checkbox from "@mui/material/Checkbox";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";

export default function DialogBox() {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const { trayId } = useParams();
  /**************************************************************************** */
  const [awbn, setAwbn] = useState("");
  const [bagReuse, setBagReuse] = useState(false);
  const [description, setDescription] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  /******************************************************************************** */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(false);
        let response = await axiosWarehouseIn.post(
          "/getBagItemRequest/" + trayId
        );
        if (response.status === 200) {
          setEmployeeData(response.data.data);
          setPageLoading(true);
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);
  /******************************************************************************** */
  const getitem = async () => {
    try {
      setPageLoading(false);
      let response = await axiosWarehouseIn.post(
        "/getBagItemRequest/" + trayId
      );
      if (response.status === 200) {
        setEmployeeData(response.data.data);
        setPageLoading(true);
        //   dataTableFun()
      } else if (response.status == 201) {
        setPageLoading(true);
        setEmployeeData(response.data.data);
        alert(response.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  /******************************************************************************** */
  const handelAwbn = async (e) => {
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
          alert(error.response.data.message);
        } else if (error.response.status == 400) {
          alert("This Item Does Not Exist In This Tray");
        } else {
          alert(error);
        }
      }
    }
  };
  /************************************************************************** */
  const addActualitem = async (uic) => {
    try {
      let obj = {
        bag_id: trayId,
        awbn_number: uic.awbn_number,
        order_id: uic.order_id,
        order_date: uic.order_date,
        uic: uic.uic,
        stock_in: new Date(),
        status: data[0].status,
      };
      let res = await axiosWarehouseIn.post("/addActualitem", obj);
      if (res?.status == 200) {
        setAwbn("");
        getitem();
      }
    } catch (error) {
      alert(error);
    }
  };
  /************************************************************************** */
  const handelIssue = async (e, trayId) => {
    e.preventDefault();
    setLoading(true);
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let obj = {
          toTray: trayId,
          fromTray: employeeData[0].from_merge,
        };
        let res = await axiosWarehouseIn.post("/mergeDoneMmttrayClose", obj);
        if (res.status === 200) {
          alert(res.data.message);
          setLoading(false);
          navigate("/return-from-mmt-merge");
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };
  /******************************************************************************** */
  const handelDelete = async (id) => {
    try {
      let obj = {
        bagId: trayId,
        id: id,
      };
      let data = await axiosWarehouseIn.put("/actualBagItem", obj);
      if (data.status == 200) {
        alert(data.data.message);
        getitem();
      }
    } catch (error) {
      alert(error);
    }
  };
  /***************************************************************************************** */
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  /******************************************************************************** */

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
              <h6 style={{ marginLeft: "13px" }}>Tray ID - {trayId}</h6>
              <h6 style={{ marginLeft: "13px" }}>
                AGENT NAME - {employeeData[0]?.issued_user_name}
              </h6>
            </Box>
            <Box
              sx={{
                float: "right",
              }}
            >
              <h6 style={{ marginRight: "13px" }}>
                Closed On --{" "}
                {new Date(
                  employeeData[0]?.closed_time_sorting_agent
                ).toLocaleString("en-GB", { hour12: true })}
              </h6>
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
                        {
                          employeeData[0]?.items?.filter(function (item) {
                            return item.status != "Duplicate";
                          }).length
                        }
                        /{employeeData[0]?.limit}
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
                        <TableCell>Bag Id</TableCell>
                        {/* <TableCell>AWBN Number</TableCell> */}
                        <TableCell>Order ID</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employeeData[0]?.items?.map((data, index) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data?.uic}</TableCell>
                          <TableCell>{data?.bag_id}</TableCell>
                          {/* <TableCell>{data?.awbn_number}</TableCell> */}
                          <TableCell>{data?.order_id}</TableCell>
                          <TableCell>
                            {new Date(data?.order_date).toLocaleString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}
                          </TableCell>
                          <TableCell
                            style={
                              data.status == "Valid"
                                ? { color: "green" }
                                : { color: "red" }
                            }
                          >
                            {data.status}
                          </TableCell>
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
                  sx={{ m: 1 }}
                  id="outlined-password-input"
                  type="text"
                  name="doorsteps_diagnostics"
                  label="Please Enter UIC"
                  value={awbn}
                  onChange={(e) => {
                    setAwbn(e.target.value);
                    handelAwbn(e);
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
                        {
                          employeeData[0]?.actual_items?.filter(function (
                            item
                          ) {
                            return item.status != "Duplicate";
                          }).length
                        }
                        /{employeeData[0]?.limit}
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
                        <TableCell>Bag Id</TableCell>
                        {/* <TableCell>AWBN Number</TableCell> */}
                        <TableCell>Order ID</TableCell>
                        <TableCell>Order Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employeeData[0]?.actual_items?.map((data, index) => (
                        <TableRow hover role="checkbox" tabIndex={-1}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{data?.uic}</TableCell>
                          <TableCell>{data?.bag_id}</TableCell>
                          {/* <TableCell>{data?.awbn_number}</TableCell> */}
                          <TableCell>{data?.order_id}</TableCell>
                          <TableCell>
                            {new Date(data?.order_date).toLocaleString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}
                          </TableCell>
                          <TableCell
                            style={
                              data.status == "Valid"
                                ? { color: "green" }
                                : { color: "red" }
                            }
                          >
                            {data.status}
                          </TableCell>
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

              <>
                <Checkbox
                  checked={bagReuse}
                  onClick={(e) => {
                    if (
                      window.confirm(
                        bagReuse
                          ? "Already Added"
                          : "You Want to Release Tray ?"
                      )
                    ) {
                      setBagReuse(true);
                    }
                  }}
                  {...label}
                />
                <label>{employeeData[0].from_merge} - Release</label>
              </>

              <Button
                sx={{ m: 3, mb: 9 }}
                variant="contained"
                style={{ backgroundColor: "green" }}
                disabled={
                  loading == true ||
                  description == "" ||
                  bagReuse == false ||
                  employeeData[0]?.actual_items?.length !==
                    employeeData[0]?.items?.length
                    ? true
                    : false
                }
                onClick={(e) => {
                  handelIssue(e, employeeData[0]?.code);
                }}
              >
                Tray Close
              </Button>
            </Box>
          </div>
        </>
      )}
    </>
  );
}
