import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import "yup-phone";
import { useNavigate, useLocation } from "react-router-dom";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { axiosWarehouseIn, axiosMisUser } from "../../../axios";
import Checkbox from "@mui/material/Checkbox";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function DialogBox() {
  const [clubModel, setClubModel] = useState({});
  const navigate = useNavigate();
  const [whtTray, setWhtTray] = useState([]);
  const [assignedTray, setAssignedTray] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [currentstate, setCurrentState] = useState("");
  const [loading, setLoading] = useState(false);
  const [trayDataCheck, setTrayDataCheck] = useState(false);
  const [whtTrayId, setWhtTrayId] = useState([]);
  const { state } = useLocation();
  const [count, setCount] = useState(0);
  const { isCheck, muic } = state;
  /**************************************************************************** */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let obj = {
          tray: isCheck,
          muic: muic,
        };
        let res = await axiosMisUser.post("/view-bot-clubed-data-model", obj);
        if (res.status === 200) {
          setClubModel(res.data.data);
          //   dataTableFun();
        } else {
          navigate("/bag-issue-request");
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [refresh]);
  useEffect(() => {
    setCount(0);
    if (clubModel?.items !== undefined) {
      for (let x of clubModel?.items) {
        if (x.muic === clubModel.muic) {
        }
        if (x.wht_tray !== null && x.muic === clubModel.muic) {
          setCount((count) => count + 1);
        }
      }
    }
  }, [clubModel]);

  /******************************************USEEFFECT FOR READY TO ASSIGN TRAY******************************/
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      const fetchData = async () => {
        if (admin) {
          let { location } = jwt_decode(admin);
          let obj = {
            brand: clubModel.brand,
            model: clubModel.model,
            location: location,
            trayId: isCheck,
            whtTrayId: clubModel?.items,
          };
          if (clubModel?.items !== undefined) {
            let res = await axiosWarehouseIn.post("/getAssignedTray", obj);
            if (res.status === 200) {
              setAssignedTray(res.data.data);
            }
          }
          handeTrayGet("Use_existing_tray");
        } else {
          navigate("/");
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, [refresh, clubModel]);
  /***********************************GET TRAY***************************************************** */
  const handeTrayGet = async (type) => {
    try {
      setCurrentState(type);
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        let obj = {
          type: type,
          brand_name: clubModel.brand,
          model_name: clubModel.model,
          location: location,
        };
        let res = await axiosWarehouseIn.post("/getWhtTray", obj);
        if (res.status === 200) {
          if (res.data.data?.length === 0) {
            setTrayDataCheck(true);
          } else {
            setTrayDataCheck(false);
          }
          setWhtTray(res.data.data);
          dataTableFun();
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  /****************************************SELECT TRAY*********************************************** */
  const handelSelect = async (
    whtTrayId,
    trayLimit,
    trayQunatity,
    tempLength
  ) => {
    try {
      setLoading(true);
      let obj = {
        wht_tray: whtTrayId,
        item: [],
        sku: clubModel.temp_array?.[0].vendor_sku_id,
        muic: clubModel?.muic,
        botTray: isCheck,
      };
      let i = 1;
      let count = trayLimit - trayQunatity;
      let tempCount = trayLimit - tempLength;
      for (let x of clubModel.items) {
        if (x.wht_tray === null && x.muic === clubModel?.muic) {
          if (trayLimit >= i && count >= i && tempCount >= i) {
            x.model_name = clubModel?.model;
            x.brand_name = clubModel?.brand;
            x.muic = clubModel?.muic;
            x.created = clubModel.temp_array?.[0].created_at;
            obj.item.push(x);
          } else {
            break;
          }
          i++;
        }
      }
      if (obj.item.length !== 0) {
        let res = await axiosWarehouseIn.post("/itemAssignToWht", obj);
        if (res.status === 200) {
          setLoading(false);
          setRefresh((refresh) => !refresh);
          handeTrayGet(currentstate);
          alert(res.data.message);
        }
      } else {
        alert("Tray Already Full");
      }
    } catch (error) {
      alert(error);
    }
  };
  /**********************************DATATABLE************************************************* */
  function dataTableFun() {
    $("#trayTable").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  /********************************************HANDEL REMOVE********************************************* */
  const handelRemoveTray = async (WhttrayId) => {
    try {
      let obj = {
        code: WhttrayId,
        botTray: isCheck,
        muic: clubModel?.muic,
      };
      let res = await axiosWarehouseIn.post("/removeItemWht", obj);
      if (res.status === 200) {
        window.location.reload(false);
        alert(res.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelIssue = async (e) => {
    e.preventDefault();
    navigate(-1);
  };
  return (
    <>
      <Box
        sx={{
          mt: 14,
          ml: 1,
        }}
      >
        <Grid container spacing={1}>
          <Grid itme xs={6}>
            <Box>
              <h6 style={{ marginLeft: "13px" }}>MUIC - {clubModel?.muic}</h6>
              <h6 style={{ marginLeft: "13px" }}>
                Model Name - {clubModel?.model}
              </h6>
              <FormControl sx={{ mt: 1, width: "300px" }}>
                <InputLabel sx={{ pt: 1 }} id="demo-simple-select-label">
                  Select
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label="Select search field"
                  sx={{ m: 1 }}
                >
                  <MenuItem
                    onClick={(e) => {
                      handeTrayGet("Use_existing_tray");
                    }}
                    value="Use_existing_tray"
                  >
                    Use Existing Tray
                  </MenuItem>

                  <MenuItem
                    onClick={(e) => {
                      handeTrayGet("use_new_tray");
                    }}
                    value="use_new_tray"
                  >
                    Use New Tray
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <h6 style={{ marginLeft: "13px" }}>
                Brand Name - {clubModel?.brand}
              </h6>
              <h6 style={{ marginLeft: "13px" }}>
                Number of Pieces - {count} / {clubModel?.temp_array?.length}
              </h6>
            </Box>
          </Grid>
          <Grid xs={6}>
            <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
              <TableContainer>
                <Table
                  style={{ width: "100%" }}
                  // id="trayTable"
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>S.NO</TableCell>
                      <TableCell>Tray Id</TableCell>
                      <TableCell>Quantity</TableCell>
                      {count === clubModel?.temp_array?.length ? (
                        <TableCell>Select</TableCell>
                      ) : (
                        ""
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {whtTray.map((data, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{data?.code}</TableCell>
                        <TableCell>
                          {data.items.length +
                            "/" +
                            data?.temp_array?.length +
                            "/" +
                            data?.limit}
                        </TableCell>
                        {count === clubModel?.temp_array?.length ? null : (
                          <TableCell>
                            {data?.items?.length < data.limit &&
                            data?.temp_array?.length < data.limit &&
                            data?.items?.length + data?.temp_array?.length <
                              data.limit ? (
                              <Checkbox
                                {...label}
                                disabled={loading === true ? true : false}
                                onClick={(e) => {
                                  handelSelect(
                                    data.code,
                                    data.limit,
                                    data?.items?.length,
                                    data?.temp_array?.length
                                  );
                                }}
                                id={index}
                                key={index}
                              />
                            ) : null}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {trayDataCheck === true ? (
                <p style={{ textAlign: "center" }}>
                  No data available in table
                </p>
              ) : null}
            </Paper>
          </Grid>
          <Grid xs={6}>
            <Paper sx={{ width: "95%", overflow: "hidden", m: 1 }}>
              <TableContainer>
                <Table
                  style={{ width: "100%" }}
                  // id="trayTable2"
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>S.NO</TableCell>
                      <TableCell>Tray Id</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {assignedTray.map((data, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{data?.code}</TableCell>
                        <TableCell>
                          {data.items.length +
                            "/" +
                            data?.temp_array?.length +
                            "/" +
                            data?.limit}
                        </TableCell>
                        <TableCell>
                          <Button
                            sx={{
                              ml: 2,
                            }}
                            variant="contained"
                            style={{ backgroundColor: "red" }}
                            component="span"
                            onClick={() => {
                              if (window.confirm("You Want to Remove?")) {
                                handelRemoveTray(data?.code);
                              }
                            }}
                          >
                            Remove
                          </Button>
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
            <Button
              sx={{ m: 3, mb: 9 }}
              variant="contained"
              disabled={loading === true ? true : false}
              style={{ backgroundColor: "green" }}
              onClick={(e) => {
                handelIssue(e);
              }}
            >
              Back to List
            </Button>
          </Box>
        </div>
      </Box>
    </>
  );
}
