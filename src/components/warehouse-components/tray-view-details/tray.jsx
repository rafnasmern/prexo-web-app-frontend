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
import { useParams } from "react-router-dom";
import "yup-phone";
import { useNavigate } from "react-router-dom";
import { axiosWarehouseIn } from "../../../axios";
import Checkbox from "@mui/material/Checkbox";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";

export default function DialogBox() {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const { trayId } = useParams();
  /**************************************************************************** */
  const [awbn, setAwbn] = useState("");
  const [awbnSuccess, setAwbnSuccess] = useState(false);
  const [bagReuse, setBagReuse] = useState(false);
  const [description, setDescription] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post(
          "/getBagItemRequest/" + trayId
        );
        if (response.status === 200) {
          setEmployeeData(response.data.data);
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  const getitem = async () => {
    try {
      let response = await axiosWarehouseIn.post(
        "/getBagItemRequest/" + trayId
      );
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
    if (e.target.value.length === 11) {
      try {
        let obj = {
          uic: e.target.value,
          trayId: trayId,
        };
        let res = await axiosWarehouseIn.post("/check-uic", obj);
        if (res?.status == 200) {
          setAwbnSuccess(true);
          addActualitem(res.data.data);
        }
      } catch (error) {
        setAwbnSuccess(false);
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
    if (
      employeeData[0]?.actual_items?.filter(function (item) {
        return item.status == "Valid";
      }).length +
        employeeData[0]?.actual_items?.filter(function (item) {
          return item.status == "Invalid";
        }).length >=
      employeeData[0].limit
    ) {
      alert("Bag Is Full");
    } else {
      let data = employeeData[0]?.items?.filter(function (item) {
        return item.awbn_number == uic.awbn_number;
      });
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
    }
  };
  /************************************************************************** */
  const handelIssue = async (e, bagId) => {
    e.preventDefault();
    setLoading(true);
    let admin = localStorage.getItem("prexo-authentication");
    try {
      if (admin) {
        let { location } = jwt_decode(admin);
        if (description == "") {
          alert("Please Add Description");
          setLoading(false);
        } else if (
          employeeData[0]?.type_taxanomy == "BOT" &&
          bagReuse == false
        ) {
          alert("Please confirm bag release");
          setLoading(false);
        } else if (
          employeeData[0]?.actual_items?.filter(function (item) {
            return item.status == "Duplicate";
          })?.length != 0
        ) {
          alert("Please Remove Duplicate Items");
          setLoading(false);
        } else if (
          employeeData[0]?.actual_items?.length ==
          employeeData[0]?.items?.length
        ) {
          let obj = {
            trayId: trayId,
            description: description,
            bagId: bagId,
            location: location,
          };
          if (employeeData?.[0]?.type_taxanomy != "BOT") {
            let res = await axiosWarehouseIn.post("/trayclose", obj);
            if (res.status == 200) {
              alert(res.data.message);
              setLoading(false);
              navigate("/tray-close-request");
            }
          } else {
            let res = await axiosWarehouseIn.post("/traycloseBot", obj);
            if (res.status == 200) {
              alert(res.data.message);
              setLoading(false);
              navigate("/bot-tray-close");
            }
          }
        } else {
          alert("Please Verify Actual Data");
        }
      }
    } catch (error) {
      alert(error);
    }
  };
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
            {new Date(employeeData[0]?.closed_time_bot).toLocaleString(
              "en-GB",
              { hour12: true }
            )}
          </h6>

          {/* <Checkbox
            checked={uic}
            onClick={(e) => {
              if (
                window.confirm(uic ? "Already Added" : "You Want to add UIC ?")
              ) {
                setUic(true);
              }
            }}
            {...label}
          />
          <label>UIC Label</label>
          <Checkbox
            checked={sleaves}
            onClick={(e) => {
              if (
                window.confirm(
                  sleaves ? "Already Added" : "You Want to add sleeves ?"
                )
              ) {
                setSleaves(true);
              }
            }}
            {...label}
          />
          <label>Sleeves</label> */}
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
              <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Valid</h5>
                  <p style={{ marginLeft: "14px", fontSize: "24px" }}>
                    {
                      employeeData[0]?.items?.filter(function (item) {
                        return item.status == "Valid";
                      }).length
                    }
                  </p>
                </Box>
              </Box>
              <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Invalid</h5>
                  <p style={{ marginLeft: "20px", fontSize: "24px" }}>
                    {
                      employeeData[0]?.items?.filter(function (item) {
                        return item.status == "Invalid";
                      }).length
                    }
                  </p>
                </Box>
              </Box>{" "}
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
                        {new Date(data?.order_date).toLocaleString("en-GB", {
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
                      {/* <TableCell>
                        <Button
                          sx={{
                            ml: 2,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          component="span"
                          onClick={() => {
                            if (window.confirm("Delete the item?")) {
                              handelDelete(data._id);
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </TableCell> */}
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
              // onChange={(e) => setAwbn(e.target.value)}
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
                      employeeData[0]?.actual_items?.filter(function (item) {
                        return item.status != "Duplicate";
                      }).length
                    }
                    /{employeeData[0]?.limit}
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
                    {
                      employeeData[0]?.actual_items?.filter(function (item) {
                        return item.status == "Valid";
                      }).length
                    }
                  </p>
                </Box>
              </Box>
              <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Invalid</h5>
                  <p style={{ marginLeft: "25px", fontSize: "24px" }}>
                    {
                      employeeData[0]?.actual_items?.filter(function (item) {
                        return item.status == "Invalid";
                      }).length
                    }
                  </p>
                </Box>
              </Box>{" "}
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
                        {new Date(data?.order_date).toLocaleString("en-GB", {
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
                      {data.status !== "Valid" ? (
                        <TableCell>
                          <Button
                            sx={{
                              ml: 2,
                            }}
                            variant="contained"
                            style={{ backgroundColor: "red" }}
                            component="span"
                            onClick={() => {
                              if (window.confirm("Delete the item?")) {
                                handelDelete(data._id);
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
         <div style={{float:"right"}}>

      <Box  sx={{ float: "right"}}>
        <textarea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          style={{ width: "400px" }}
          placeholder="Description"
        ></textarea>
        {employeeData[0]?.type_taxanomy == "BOT" ? (
          <>
            <Checkbox
          
              checked={bagReuse}
              onClick={(e) => {
                if (
                  window.confirm(
                    bagReuse ? "Already Added" : "You Want to Release Bag ?"
                  )
                ) {
                  setBagReuse(true);
                }
              }}
              {...label}
            />
            <label>Bag Release</label>
          </>
        ) : (
          ""
        )}
        <Button
          sx={{ m: 3, mb: 9 }}
          variant="contained"
          style={{ backgroundColor: "green" }}
          disabled={loading == true ? true : false}
          onClick={(e) => {
            handelIssue(e, employeeData[0]?.items[0]?.bag_id);
          }}
        >
          Tray Close
        </Button>
      </Box>
         </div>
    </>
  );
}
