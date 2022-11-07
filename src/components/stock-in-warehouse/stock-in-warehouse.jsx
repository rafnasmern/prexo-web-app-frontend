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
} from "@mui/material";
import "yup-phone";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { axiosWarehouseIn } from "../../axios";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";

export default function DialogBox() {
  const [employeeData, setEmployeeData] = useState([]);
  /**************************************************************************** */
  const [bagId, setBagId] = useState("");
  const [bagSuccess, setbagSuccess] = useState(false);
  const [awbn, setAwbn] = useState("");
  const [awbnSuccess, setAwbnSuccess] = useState(false);
  const [uic, setUic] = useState(false);
  const [sleaves, setSleaves] = useState(false);
  const [valid, setValid] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /***************************************************************************************** */
  const handelCheckBagId = async (e) => {
    if (bagId == "") {
      alert("Please Enter Bag ID");
    } else {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let obj = {
            location: location,
            bagId: bagId,
          };
          let res = await axiosWarehouseIn.post("/checkBagId", obj);
          if (res.status == 200) {
            alert(res.data.message);
            getitem();
            setbagSuccess(true);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        setbagSuccess(false);
        alert(error.response.data.message);
      }
    }
  };
  const getitem = async () => {
    try {
      let response = await axiosWarehouseIn.post("/getBagItem/" + bagId);
      if (response.status === 200) {
        setEmployeeData(response.data.data);
        //   dataTableFun()
      } else if (response.status == 201) {
        setEmployeeData(response.data.data);
        alert(response.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelAwbn = async (e) => {
    if (e.target.value.length == 12) {
      if (bagId == "") {
        alert("Please Fill The Input");
      } else {
        try {
          let admin = localStorage.getItem("prexo-authentication");
          if (admin) {
            let { location } = jwt_decode(admin);
            let obj = {
              awbn: e.target.value,
              bagId: bagId,
              location: location,
            };
            let res = await axiosWarehouseIn.post("/checkAwbn", obj);
            if (res.status == 200) {
              setAwbnSuccess(true);
              if (res.data.message == "AWBN Number Is Invalid") {
                setValid("Invalid");
                setAwbn("");
                handelSubmitStock(res.data.data, "Invalid");
              } else if (res.data.message == "AWBN Number Is Duplicate") {
                setValid("Duplicate");
                setAwbn("");
                handelSubmitStock(res.data.data, "Duplicate");
              } else {
                setValid("Valid");
                setAwbn("");
                handelSubmitStock(res.data.data, "Valid");
              }
            }
          }
        } catch (error) {
          setAwbnSuccess(false);
          alert(error.response.data.message);
        }
      }
    }
  };
  const handelSubmitStock = async (awbn, status) => {
    if (bagId == "") {
      alert("Please Fill the Input");
    } else if (employeeData[0]?.items != undefined) {
      if (
        employeeData[0]?.items?.filter(function (item) {
          return item.status != "Duplicate";
        }).length == employeeData[0]?.limit
      ) {
        alert("Bag Is Full");
      } else {
        try {
          let obj = {
            bag_id: bagId,
            awbn_number: awbn.tracking_id,
            order_id: awbn.order_id,
            order_date: awbn.order_date,
            status: status,
            sotckin_date:Date.now()
          };
          let res = await axiosWarehouseIn.post("/stockInToWarehouse", obj);
          if (res.status == 200) {
            setAwbnSuccess(false);
            setAwbn("");
            getitem();
          }
        } catch (error) {
          alert(error);
        }
      }
    }
  };
  const handeleUic = () => {
    if (uic == false) {
      setUic(true);
    } else {
      setUic(false);
    }
  };
  const handeleSleaves = () => {
    if (sleaves == false) {
      setSleaves(true);
    } else {
      setSleaves(false);
    }
  };
  const handelClose = async (e) => {
    try {
      setLoading(true);
      if (
        employeeData[0]?.items.filter(function (item) {
          return item.status == "Duplicate";
        }).length != 0
      ) {
        alert("Please Remove Duplicate Items");
        setLoading(false);
      } else if (employeeData[0]?.items.length == employeeData[0]?.limit) {
        let obj = {
          bagId: bagId,
          uic: uic,
          sleaves: sleaves,
          stage: "Closed",
        };
        let res = await axiosWarehouseIn.post("/bagClosing", obj);
        if (res.status == 200) {
          alert(res.data.message);
          setLoading(false);
          window.location.reload(false);
        }
      } else {
        let obj = {
          bagId: bagId,
          uic: uic,
          sleaves: sleaves,
          stage: "Pre-closure",
        };
        let res = await axiosWarehouseIn.post("/bagClosing", obj);
        if (res.status == 200) {
          alert("Bag going to Pre-closure");
          setLoading(false);
          window.location.reload(false);
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelDelete = async (id, awbn, state) => {
    try {
      let obj = {
        id: id,
        bagId: bagId,
        awbn: awbn,
        state: state,
      };
      let data = await axiosWarehouseIn.put("/stockin", obj);
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
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          mt: 15,
          mr: 3,
          ml: 3,
        }}
      >
        <Box sx={{ maxHeight: "10px" }}>
          <TextField
            id="outlined-password-input"
            type="text"
            name="doorsteps_diagnostics"
            label="Please Enter Bag ID"
            onChange={(e) => setBagId(e.target.value)}
            inputProps={{
              style: {
                width: "auto",
              },
            }}
          />
          <Button
            sx={{ ml: 3, mt: 1 }}
            variant="contained"
            style={{ backgroundColor: "#206CE2" }}
            onClick={handelCheckBagId}
          >
            GO
          </Button>
        </Box>
        {bagSuccess ? (
          <>
            <Box sx={{ ml: 2 }}>
              <TextField
                id="outlined-password-input"
                type="text"
                name="doorsteps_diagnostics"
                label="Please Enter AWB Number"
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
            </Box>
          </>
        ) : (
          ""
        )}
      </Box>
      <Box>
        {employeeData.length != 0 ? (
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
              <Box
                sx={{
                  m: 2,
                }}
              >
                <h4>Total</h4>
                <h6 style={{ marginLeft: "9px", fontSize: "24px" }}>
                  {
                    employeeData[0]?.items?.filter(function (item) {
                      return item.status != "Duplicate";
                    }).length
                  }
                  /{employeeData[0]?.limit}
                </h6>
              </Box>
            </Box>
            <Box
              sx={{
                m: 2,
              }}
            >
              <Box
                sx={{
                  m: 2,
                }}
              >
                <h4>Valid</h4>
                <h6 style={{ marginLeft: "22px", fontSize: "24px" }}>
                  {
                    employeeData[0]?.items?.filter(function (item) {
                      return item.status == "Valid";
                    }).length
                  }
                </h6>
              </Box>
            </Box>
            <Box
              sx={{
                m: 2,
              }}
            >
              <Box
                sx={{
                  m: 2,
                }}
              >
                <h4>Invalid</h4>
                <h6 style={{ marginLeft: "29px", fontSize: "24px" }}>
                  {
                    employeeData[0]?.items?.filter(function (item) {
                      return item.status == "Invalid";
                    }).length
                  }
                </h6>
              </Box>
            </Box>{" "}
            <Box
              sx={{
                m: 2,
              }}
            >
              <Box
                sx={{
                  m: 2,
                }}
              >
                <h4>Duplicate</h4>
                <h6 style={{ marginLeft: "45px", fontSize: "24px" }}>
                  {
                    employeeData[0]?.items?.filter(function (item) {
                      return item.status == "Duplicate";
                    }).length
                  }
                </h6>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 8,
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
                    <TableCell>AWBN Number</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeData[0]?.items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.awbn_number}</TableCell>
                      <TableCell>{data?.order_id}</TableCell>
                      <TableCell>
                        {data?.order_date == null
                          ? "No Order Date"
                          : new Date(data?.order_date).toLocaleString("en-GB", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
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
                      {data.status == "Valid" ? null : (
                        <TableCell>
                          <Button
                            sx={{
                              ml: 2,
                            }}
                            variant="contained"
                            style={{ backgroundColor: "red" }}
                            component="span"
                            onClick={() => {
                              if (window.confirm("You want to Remove?")) {
                                handelDelete(
                                  data._id,
                                  data?.awbn_number,
                                  data.status
                                );
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
        {employeeData[0]?.items?.length != 0 && employeeData.length != 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              mt: 2,
              mr: 3,
              ml: 3,
            }}
          >
            <Box>
              <Checkbox
                onClick={(e) => handeleUic()}
                {...label}
                sx={{ ml: 3 }}
              />
              <label>UIC Label</label>

              <Checkbox
                onClick={(e) => handeleSleaves()}
                {...label}
                sx={{ ml: 3 }}
              />
              <label>Sleeves</label>
              <Button
                sx={{
                  ml: 2,
                }}
                variant="contained"
                style={{ backgroundColor: "red" }}
                component="span"
                disabled={loading == true ? true : false}
                onClick={(e) => {
                  if (window.confirm("You want to Close?")) {
                    handelClose(e);
                  }
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </>
  );
}
