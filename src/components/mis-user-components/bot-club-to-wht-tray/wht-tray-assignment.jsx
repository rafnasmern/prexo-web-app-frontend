import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";

import {
  Box,
  Button,
  Paper,
  Table,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
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
import { useParams } from "react-router-dom";
import "yup-phone";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
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
  const { muic, trayId } = useParams();
  const [refresh, setRefresh] = useState(false);
  const [currentstate, setCurrentState] = useState("");
  const [loading, setLoading] = useState(false);
  const [trayDataCheck, setTrayDataCheck] = useState(false);

  /**************************************************************************** */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axiosMisUser.post(
          "/view-bot-clubed-data-model/" + muic + "/" + trayId
        );
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

  /******************************************USEEFFECT FOR READY TO ASSIGN TRAY******************************/
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      const fetchData = async () => {
        if (admin) {
          let { location } = jwt_decode(admin);
          let res = await axiosWarehouseIn.post(
            "/getAssignedTray/" +
              trayId +
              "/" +
              location +
              "/" +
              clubModel.temp_array?.[0].brand +
              "/" +
              clubModel.temp_array?.[0].model
          );
          if (res.status === 200) {
            setAssignedTray(res.data.data);

            dataTableFun2();
          }
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
          vendor_sku_id: clubModel.temp_array?.[0].vendor_sku_id,
          type: type,
          brand_name: clubModel.temp_array?.[0].brand,
          model_name: clubModel.temp_array?.[0].model,
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
  console.log(clubModel.temp_array);
  /****************************************SELECT TRAY*********************************************** */
  const handelSelect = async (whtTrayId, trayLimit, trayQunatity) => {
    try {
      setLoading(true);
      let obj = {
        wht_tray: whtTrayId,
        item: [],
        sku: clubModel.temp_array?.[0].vendor_sku_id,
        bot_tray: trayId,
        muic: clubModel.temp_array?.[0].muic,
      };
      let i = 1;
      let count = trayLimit - trayQunatity;
      for (let x of clubModel.items) {
        if (x.wht_tray == null && x.muic == clubModel?.temp_array?.[0].muic) {
          if (trayLimit >= i && count >= i) {
            x.model_name = clubModel.temp_array?.[0].model;
            x.brand_name = clubModel.temp_array?.[0].brand;
            x.muic = clubModel.temp_array?.[0].muic;
            x.created = clubModel.temp_array?.[0].created_at;
            x.trayId = trayId;
            obj.item.push(x);
          } else {
            break;
          }
          i++;
        }
      }
      obj.count = Number(
        clubModel?.temp_array?.[0]?.assigned_count + obj.item.length
      );
      let res = await axiosWarehouseIn.post("/itemAssignToWht", obj);
      if (res.status === 200) {
        setLoading(false);
        setRefresh((refresh) => !refresh);
        handeTrayGet(currentstate);
        alert(res.data.message);
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
  function dataTableFun2() {
    $("#trayTable2").DataTable({
      destroy: true,
      scrollX: true,
    });
  }

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  /********************************************HANDEL REMOVE********************************************* */
  const handelRemoveTray = async (WhttrayId) => {
    try {
      let obj = {
        count: clubModel?.temp_array?.[0]?.assigned_count,
        code: WhttrayId,
        botTray: trayId,
        muic: clubModel?.temp_array?.[0].muic,
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

  /************************************************VIEW ITEM************************************************** */
  const handelViewItem = (id) => {
    navigate("/wht-tray-item/" + id);
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
              <h6 style={{ marginLeft: "13px" }}>
                MUIC - {clubModel?.temp_array?.[0].muic}
              </h6>
              <h6 style={{ marginLeft: "13px" }}>
                Model Name - {clubModel?.temp_array?.[0].model}
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
                Brand Name - {clubModel?.temp_array?.[0].brand}
              </h6>
              <h6 style={{ marginLeft: "13px" }}>
                Number of Pieces - {clubModel?.temp_array?.[0]?.assigned_count}{" "}
                / {clubModel?.temp_array?.[0]?.item?.length}
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
                      <TableCell>Qunatity</TableCell>
                      {clubModel?.temp_array?.[0]?.assigned_count ==
                      clubModel?.temp_array?.[0]?.item?.length ? (
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
                          {data?.items?.length} / {data?.limit}
                        </TableCell>
                        {clubModel?.temp_array?.[0]?.assigned_count ==
                        clubModel?.temp_array?.[0]?.item?.length ? null : (
                          <TableCell>
                            <Checkbox
                              {...label}
                              disabled={loading == true ? true : false}
                              onClick={(e) => {
                                clubModel?.wht_tray?.includes(data.code)
                                  ? alert("Already Assigned")
                                  : handelSelect(
                                      data.code,
                                      data.limit,
                                      data?.items?.length
                                    );
                              }}
                              id={index}
                              key={index}
                              checked={clubModel?.wht_tray?.includes(data.code)}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {trayDataCheck == true ? (
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
                      <TableCell>Qunatity</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {assignedTray.map((data, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{data?.code}</TableCell>
                        <TableCell>
                          {data?.items?.length} / {data?.limit}
                        </TableCell>
                        <TableCell>
                          <Button
                            sx={{
                              m: 2,
                            }}
                            variant="contained"
                            style={{ backgroundColor: "green" }}
                            component="span"
                            onClick={() => {
                              handelViewItem(data?.code);
                            }}
                          >
                            View
                          </Button>
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
        {/* <Box
        sx={{
          float: "right",
        }}
      >
        <Button
          sx={{
            m: 2,
          }}
          variant="contained"
          style={{ backgroundColor: "green" }}
          component="span"
          disabled={laodingPickList == true ? true : false}
          // onClick={() => {
          //   if (window.confirm("You Want to Create Picklist?")) {
          //     handelCreatePickList();
          //   }
          // }}
        >
          Create Picklist
        </Button>
      </Box> */}
      </Box>
    </>
  );
}
