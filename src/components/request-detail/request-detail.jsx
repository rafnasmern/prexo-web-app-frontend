import React, { useEffect, useState,useMemo } from "react";
import {
  Box,
  Button,
  IconButton,
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
import { useParams } from "react-router-dom";
import "yup-phone";
import { useNavigate } from "react-router-dom";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { axiosWarehouseIn } from "../../axios";
import Checkbox from "@mui/material/Checkbox";
import SearchIcon from "@mui/icons-material/Search";
export default function DialogBox() {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const { bagId } = useParams();
  const [loading, setLoading] = useState(false);
  /**************************************************************************** */
  const [awbn, setAwbn] = useState("");
  const [uic, setUic] = useState(false);
  const [sleaves, setSleaves] = useState(false);
  const [description, setDescription] = useState([]);
  const [readyForAssign, setReadyForAssign] = useState(0);
  const [textBoxDis,setTextBoxDis]=useState(false)
  /*********************************************************** */
  const [botTray, setBotTray] = useState("");
  const [pmtTray, setPmtTray] = useState(null);
  const [mmtTray, setMmtTray] = useState(null);
  const [trayId, setTrayid] = useState({
    mmtTray: "",
    pmtTray: "",
    botTray: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post(
          "/getBagItemRequest/" + bagId
        );
        if (
          response.status === 200 &&
          response.data.data[0]?.sort_id != "Issued"
        ) {
          setEmployeeData(response.data.data);
          setUic(response.data.data[0]?.uic === "true");

          setSleaves(response.data.data[0]?.sleaves === "true");
          let res = await axiosWarehouseIn.post(
            "/autoFetchAlreadyAssignedTray/" +
              response.data.data[0]?.issued_user_name
          );
          if (res.status == 200) {
            setMmtTray(res.data.mmtTray);
            setPmtTray(res.data.pmtTray);
          }
        } else {
          navigate("/bag-issue-request");
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchAgentStatus = async () => {
      try {
        let res = await axiosWarehouseIn.post(
          "/checkBotUserStatus/" + employeeData[0]?.issued_user_name
        );
        if (res.status === 200) {
          setReadyForAssign(res.data.status);
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
    if (employeeData[0]?.issued_user_name !== undefined) {
      fetchAgentStatus();
    }
  }, [employeeData]);
  const getitem = async () => {
    try {
      let response = await axiosWarehouseIn.post("/getBagItemRequest/" + bagId);
      if (response.status === 200) {
        setEmployeeData(response.data.data);
        setUic(response.data.data[0]?.uic === "true");
        setSleaves(response.data.data[0]?.sleaves === "true");
        //   dataTableFun()
      } else if (response.status == 201) {
        setEmployeeData(response.data.data);
        setUic(response.data.data[0]?.uic === "true");
        setSleaves(response.data.data[0]?.sleaves === "true");
        alert(response.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelAwbn = async (e) => {
    if (e.target.value.length === 12) {
      try {
        let obj = {
          awbn: e.target.value,
          id: bagId,
        };
        setTextBoxDis(true)
        let res = await axiosWarehouseIn.post("/actualCheckAwbn", obj);
        if (res?.status == 200) {
          addActualitem(res.data.data);
        }
      } catch (error) {
        if (error.response.status == 403) {
          setTextBoxDis(false)
          setAwbn("");
          alert(error.response.data.message);
        } else if (error.response.status == 400) {
          setTextBoxDis(false)
          alert("This Item Does Not Exist In This Bag");
        } else {
          alert(error);
        }
      }
    }
  };
  /************************************************************************** */
  const addActualitem = async (awbn) => {
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
      setTextBoxDis(true)
      let data = employeeData[0]?.items?.filter(function (item) {
        return item.awbn_number == awbn.tracking_id;
      });
      try {
        let obj = {
          bag_id: bagId,
          awbn_number: awbn.tracking_id,
          order_id: awbn.order_id,
          order_date: awbn.order_date,
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
  const handelIssue = async (e) => {
    try {
      setLoading(true);
      if (uic == false) {
        alert("Please Confirm UIC");
        setLoading(false);
      } else if (sleaves == false) {
        alert("Please Confirm Sleeves");
        setLoading(false);
      } else if (description == "") {
        alert("Please Add Description");
        setLoading(false);
      } else if (pmtTray == null || mmtTray == null || botTray == "") {
        alert("Please Assign Tray");
        setLoading(false);
      } else if (
        employeeData[0]?.actual_items?.filter(function (item) {
          return item.status == "Duplicate";
        })?.length != 0
      ) {
        alert("Please Remove Duplicate Items");
        setLoading(false);
      } else if (
        employeeData[0]?.actual_items?.length == employeeData[0]?.items?.length
      ) {
        let obj = {
          bagId: bagId,
          description: description,
          sleaves: sleaves,
          uic: uic,
          try: [pmtTray, mmtTray, botTray],
        };

        let res = await axiosWarehouseIn.post("/issueToBot", obj);
        if (res.status == 200) {
          alert(res.data.message);
          setLoading(false);
          navigate("/bag-issue-request");
        }
      } else {
        setLoading(false);
        alert("Please Verify Actual Data");
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelDelete = async (id) => {
    try {
      let obj = {
        bagId: bagId,
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
  /*********************************TRAY ASSIGNEMENT********************************** */
  const handelBotTray = async (e, trayId) => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        if (trayId !== "") {
          setBotTray("");
          let res = await axiosWarehouseIn.post(
            "/checkBotTray/" + trayId + "/" + location
          );
          if (res.status == 200) {
            alert(res.data.message);
            setBotTray(res.data.data);
          }
        }
      } else {
        alert("Please enter tray id");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  const handelMmtTray = async (e, trayId) => {
    try {
      if (trayId !== "") {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          setMmtTray(null);
          let res = await axiosWarehouseIn.post(
            "/checkMmtTray/" + trayId + "/" + location
          );
          if (res.status == 200) {
            alert(res.data.message);
            setMmtTray(res.data.data);
          }
        } else {
          alert("Please enter tray id");
        }
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  const handelPmtTray = async (e, trayId) => {
    try {
      if (trayId !== "") {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          setPmtTray(null);
          let res = await axiosWarehouseIn.post(
            "/checkPmtTray/" + trayId + "/" + location
          );
          if (res.status == 200) {
            alert(res.data.message);
            setPmtTray(res.data.data);
          }
        }
      } else {
        alert("Please enter tray id");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  /***************************************************************************************** */
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const tabelDataExpected = useMemo(() => {
    return (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }, [employeeData[0]?.items]);
  const tableDataActul = useMemo(() => {
    return (
      <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
        <h6>ACTUAL</h6>
        <TextField
          sx={{ m: 1 }}
          id="outlined-password-input"
          type="text"
          disabled={textBoxDis}
          name="doorsteps_diagnostics"
          label="Please Enter AWB Number"
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
                <TableCell>AWBN Number</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employeeData[0]?.actual_items?.map((data, index) => (
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data?.awbn_number}</TableCell>
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
                  <TableCell>
                    {data.status !== "Valid" ? (
                      <Button
                        sx={{
                          ml: 2,
                        }}
                        variant="contained"
                        style={{ backgroundColor: "red" }}
                        component="span"
                        onClick={() => {
                          if (window.confirm("You want to Remove?")) {
                            handelDelete(data._id);
                          }
                        }}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }, [employeeData[0]?.actual_items,textBoxDis]);
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
          <h6 style={{ marginLeft: "13px" }}>BAG ID - {bagId}</h6>
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
            {new Date(employeeData[0]?.status_change_time).toLocaleString(
              "en-GB",
              { hour12: true }
            )}
          </h6>

          <Checkbox
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
          <label>Sleeves</label>
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          {tabelDataExpected}
        </Grid>
        <Grid item xs={6}>
          {tableDataActul}
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <TextField
            sx={{
              m: 1,
            }}
            onChange={(e) => setTrayid({ botTray: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    onClick={(e) => {
                      handelBotTray(e, trayId.botTray);
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            label="BOT Tray"
            id="standard-size-normal"
            variant="standard"
          />
          <TextField
            sx={{
              m: 1,
            }}
            onChange={(e) => setTrayid({ pmtTray: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    onClick={(e) => {
                      handelPmtTray(e, trayId.pmtTray);
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            label="PMT Tray"
            id="standard-size-normal"
            value={pmtTray}
            variant="standard"
          />

          <TextField
            sx={{
              m: 1,
            }}
            onChange={(e) => setTrayid({ mmtTray: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    onClick={(e) => {
                      handelMmtTray(e, trayId.mmtTray);
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            label="MMT Tray"
            value={mmtTray}
            id="standard-size-normal"
            variant="standard"
          />
        </Grid>

        <Grid item xs={6}>
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
              disabled={loading == true || readyForAssign !== 1 ? true : false}
              style={{ backgroundColor: "green" }}
              onClick={() => {
                if (window.confirm("You Want to Issue?")) {
                  handelIssue();
                }
              }}
            >
              {readyForAssign == 2
                ? `${employeeData[0]?.issued_user_name} have one bag`
                : "Issue To Agent"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
