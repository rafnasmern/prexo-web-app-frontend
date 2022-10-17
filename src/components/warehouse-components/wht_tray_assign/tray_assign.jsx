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
  InputAdornment,
  InputLabel,
  Select,
} from "@mui/material";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import "yup-phone";
import { useNavigate } from "react-router-dom";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { axiosWarehouseIn } from "../../../axios";
import Checkbox from "@mui/material/Checkbox";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
export default function DialogBox() {
  const [open, setOpen] = React.useState(false);
  const [clubModel, setClubModel] = useState({});
  const navigate = useNavigate();
  const [whtTray, setWhtTray] = useState([]);
  const [assignedTray, setAssignedTray] = useState([]);
  const { vendor_sku_id } = useParams();
  const [refresh, setRefresh] = useState(false);
  const [currentstate, setCurrentState] = useState("");
  /**************************************************************************** */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post(
          "/viewModelClub/" + vendor_sku_id
        );
        if (response.status == 200) {
          setClubModel(response.data.data[0]);

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
  /******************************************USEEFFECT FOR ASSIGNED TRAY******************************/
  useEffect(() => {
    try {
      $("#trayTable2").DataTable().destroy();
      const fetchData = async () => {
        let res = await axiosWarehouseIn.post(
          "/getAssignedTray/" + vendor_sku_id
        );
        if (res.status === 200) {
          setAssignedTray(res.data.data);

          dataTableFun2();
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, [refresh]);
  /***********************************GET TRAY***************************************************** */
  const handeTrayGet = async (type) => {
    try {
      setCurrentState(type);
      $("#trayTable").DataTable().destroy();
      let obj = {
        vendor_sku_id: vendor_sku_id,
        type: type,
        brand_name: clubModel.brand_name,
        model_name: clubModel.model_name,
      };
      let res = await axiosWarehouseIn.post("/getWhtTray", obj);
      if (res.status === 200) {
        setWhtTray(res.data.data);
        dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  /****************************************SELECT TRAY*********************************************** */
  const handelSelect = async (trayId, trayLimit, trayQunatity) => {
    try {
      let obj = {
        wht_tray: trayId,
        item: [],
        sku: vendor_sku_id,
      };
      let i = 1;
      let count = trayLimit - trayQunatity;
      for (let x of clubModel.item) {
        if (x.wht_tray == null) {
          if (trayLimit >= i && count >= i) {
            x.model_name = clubModel.model_name;
            x.brand_name = clubModel.brand_name;
            x.muic = clubModel.muic;
            obj.item.push(x);
          } else {
            break;
          }
          i++;
        }
      }
      obj.count = Number(clubModel.count_assigned_tray + obj.item.length);
      if (obj.item.length == 0) {
        alert("All Items Already Assigned");
      } else {
        let res = await axiosWarehouseIn.post("/itemAssignToWht", obj);
        if (res.status == 200) {
          setRefresh((refresh) => !refresh);
          handeTrayGet(currentstate);
          alert(res.data.message);
        }
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
  const handelRemoveTray = async (trayId) => {
    try {
      let obj = {
        vendor_sku_id: vendor_sku_id,
        code: trayId,
      };
      let res = await axiosWarehouseIn.post("/removeItemWht", obj);
      if (res.status === 200) {
        setRefresh((refresh) => !refresh);
        alert(res.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  /******************************************CREATE PICKLIST******************************************** */
  const handelCreatePickList = async () => {
    try {
      if (assignedTray?.length == 0) {
        alert("Please Assign Tray");
      } else {
        let token = localStorage.getItem("prexo-authentication");
        const { user_name } = jwt_decode(token);
        let obj = {
          skuId: vendor_sku_id,
          user_name: user_name,
          picklist_items: clubModel.pick_list_items,
          model_name: clubModel.model_name,
          brand_name: clubModel.brand_name,
          muic: clubModel.muic,
        };
        let res = await axiosWarehouseIn.post("/createPickList", obj);
        if (res.status === 200) {
          alert(res.data.message);
          navigate("/picklist-request");
        }
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
    <Box
      sx={{
        mt: 14,
      }}
    >
      <Grid container spacing={2} sx={{ m: 1 }}>
        <Grid itme xs={6}>
          <Box>
            <h6 style={{ marginLeft: "13px" }}>MUIC - {clubModel.muic}</h6>
            <h6 style={{ marginLeft: "13px" }}>
              Model Name - {clubModel.model_name}
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
              Brand Name - {clubModel.brand_name}
            </h6>
            <h6 style={{ marginLeft: "13px" }}>
              Number of Pieces -{" "}
              {clubModel?.item?.filter((data) => data.wht_tray != null).length}{" "}
              / {clubModel?.item?.length}
            </h6>
          </Box>
        </Grid>
        <Grid xs={6}>
          <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
            <TableContainer>
              <Table
                style={{ width: "100%" }}
                id="trayTable"
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>S.NO</TableCell>
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Qunatity</TableCell>
                    {clubModel?.item?.filter((data) => data.wht_tray != null)
                      .length != clubModel?.item?.length ? (
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
                      {clubModel?.item?.filter((data) => data.wht_tray != null)
                        .length != clubModel?.item?.length ? (
                        <TableCell>
                          <Checkbox
                            {...label}
                            onClick={(e) => {
                              clubModel?.wht_tray?.includes(data.code) &&
                              data?.items?.length == data.limit
                                ? alert("Already Assigned")
                                : handelSelect(
                                    data.code,
                                    data.limit,
                                    data?.items?.length
                                  );
                            }}
                            id={index}
                            key={index}
                            checked={
                              (clubModel?.wht_tray?.includes(data.code) &&
                                data?.items?.length == data.limit) ||
                              (clubModel?.wht_tray?.includes(data.code) &&
                                clubModel?.item?.filter(
                                  (data) => data.wht_tray != null
                                ).length == clubModel?.item?.length)
                            }
                          />
                        </TableCell>
                      ) : (
                        ""
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid xs={6}>
          <Paper sx={{ width: "95%", overflow: "hidden", m: 1 }}>
            <TableContainer>
              <Table
                style={{ width: "100%" }}
                id="trayTable2"
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
      <Box
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
          onClick={() => {
            if (window.confirm("You Want to Create Picklist?")) {
              handelCreatePickList();
            }
          }}
        >
          Create Picklist
        </Button>
      </Box>
    </Box>
  );
}
