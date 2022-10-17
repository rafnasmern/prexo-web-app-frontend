import React, { useState, useEffect, useMemo } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import {
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Box,
  TextField,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, axiosWarehouseIn } from "../../../axios";
import moment from "moment";
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [item, setItem] = useState([]);
  const [sortDate, setSortDate] = useState("");
  const [sortData, setSortData] = useState(false);
  const navigate = useNavigate();
  const [isCheck, setIsCheck] = useState([]);
  const [yesterdayDate, setYesterDayDate] = useState("");

  useEffect(() => {
    let date = new Date(); // Today!
    setYesterDayDate(date.setDate(date.getDate() - 1));

    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const { location } = jwt_decode(admin);
      const fetchData = async () => {
        try {
          let res = await axiosWarehouseIn.post("/picklist");
          if (res.status == 200) {
            setItem(res.data.data);
            dataTableFun();
          }
        } catch (error) {
          alert(error);
        }
      };
      fetchData();
    } else {
      navigate("/");
    }
  }, []);

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /******************************PICK LIST VIEW DETAIL**************************************** */
  const handelViewDetailClub = (e, id) => {
    e.preventDefault();
    navigate("/picklist-view-detail/" + id);
  };
  const handelAssignWht = (e, id) => {
    e.preventDefault();
    navigate("/wht-tray-assign/" + id);
  };
  /******************************************PRINT PICKLIST*********************************** */
  const handelPrintPicklist = async (e, muic, sku, model_name) => {
    try {
      let arr = [];
      let res = await axiosWarehouseIn.post("/getPickList/" + sku);
      if (res.status === 200) {
        for (let x of res.data.data?.items) {
          x.picklist_id = res.data.data.pick_list_id;
          delete x._id;
          arr.push(x);
        }
        download(arr, `pick-list -${res.data.data.pick_list_id}`);
      }
    } catch (error) {
      alert(error);
    }
  };
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  function download(arr, fileName) {
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  /*************************************CLOSE PICKLIST**************************************************** */
  const handelClosePickList = (e, picklistId) => {
    e.preventDefault();
    navigate("/pick-list-close/" + picklistId);
  };
  /****************************************DATE WISE SORT *************************************************** */
  const handelSort = async (e) => {
    e.preventDefault();
    try {
      let obj = {
        date: sortDate,
      };
      let res = await axiosWarehouseIn.post("/picklist-sort", obj);
      $("#example").DataTable().destroy();
      if (res.status == 200) {
        setItem(res.data.data);
        setSortData(true);
        dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };

  const tableData = useMemo(() => {
    return (
      <Table
        id="example"
        style={{ width: "100%" }}
        stickyHeader
        aria-label="sticky table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Record.NO</TableCell>
            <TableCell>Picklist Status</TableCell>
            <TableCell>MUIC</TableCell>
            <TableCell>Brand Name</TableCell>
            <TableCell>Model Name</TableCell>
            <TableCell>IN BOT</TableCell>
            {/* <TableCell>In WHT</TableCell> */}
            <TableCell>IN Picklist</TableCell>
            <TableCell>WHT Tray</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item?.map((data, index) => (
            <TableRow tabIndex={-1}>
              <TableCell>{index + 1}</TableCell>
              <TableCell
                style={
                  data.pick_list_status == "Pending"
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {data.pick_list_status}
              </TableCell>
              <TableCell>{data.muic}</TableCell>
              <TableCell>{data.brand_name}</TableCell>
              <TableCell>{data.model_name}</TableCell>
              <TableCell>{data.item.length}</TableCell>
              {/* <TableCell>{}</TableCell> */}
              <TableCell>{data.pick_list_items}</TableCell>
              <TableCell>{data.wht_tray.toString()}</TableCell>

              <TableCell>
                <Button
                  sx={{
                    m: 1,
                  }}
                  variant="contained"
                  style={{ backgroundColor: "#206CE2" }}
                  onClick={(e) => {
                    handelViewDetailClub(e, data.vendor_sku_id);
                  }}
                >
                  View Item
                </Button>
                {data.pick_list_status == "Created" ? (
                  ""
                ) : (
                  <Button
                    sx={{
                      m: 1,
                    }}
                    variant="contained"
                    style={{ backgroundColor: "green" }}
                    onClick={(e) => {
                      handelAssignWht(e, data.vendor_sku_id);
                    }}
                  >
                    Assign Tray
                  </Button>
                )}
                {data.pick_list_status == "Created" ? (
                  <>
                    {data.pick_list_status != "Closed" ? (
                      <Button
                        sx={{
                          m: 1,
                        }}
                        variant="contained"
                        style={{ backgroundColor: "#21b6ae" }}
                        onClick={(e) => {
                          handelPrintPicklist(
                            e,
                            data.muic,
                            data.pick_list_id,
                            data.model_name
                          );
                        }}
                      >
                        Print PickList
                      </Button>
                    ) : null}
                    <Button
                      sx={{
                        m: 1,
                      }}
                      variant="contained"
                      style={{ backgroundColor: "red" }}
                      onClick={(e) => {
                        handelClosePickList(e, data.pick_list_id);
                      }}
                    >
                      Close Picklist
                    </Button>
                  </>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [item, isCheck]);
  return (
    <div style={{ marginTop: "100px", marginLeft: "20px" }}>
      <Box
        sx={{
          float: "left",
        }}
      >
        <h6>
          Date:-{" "}
          {new Date(
            sortDate != "" && sortData == true ? sortDate : yesterdayDate
          ).toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </h6>
      </Box>
      <Box
        sx={{
          float: "right",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "start",
          }}
        >
          <TextField
            id="filled-select-currency"
            type="Date"
            fullWidth
            onChange={(e) => {
              setSortDate(e.target.value);
            }}
            inputProps={{
              max: moment().format("YYYY-MM-DD"),
            }}
            sx={{ mt: 1, mb: 1 }}
            helperText="Please Select Date"
            variant="filled"
          />
          <Button
            sx={{
              mt: 20,
              m: 2,
              height: "38px",
            }}
            disabled={sortDate == "" ? true : false}
            variant="contained"
            style={{ backgroundColor: "#206CE2", marginTop: "23px" }}
            onClick={(e) => {
              handelSort(e);
            }}
          >
            Sort
          </Button>
        </Box>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <TableContainer>{tableData}</TableContainer>
      </Paper>
    </div>
  );
}
