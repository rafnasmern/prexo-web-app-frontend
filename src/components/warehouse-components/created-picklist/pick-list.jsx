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
  const [noOrders, setNoOrders] = useState(false);
  const navigate = useNavigate();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const { location } = jwt_decode(admin);
      const fetchData = async () => {
        try {
          let res = await axiosWarehouseIn.post("/get-all-pick-list");
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
          arr.push(x);
        }
        download(arr, "Pick-List");
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
    ws["!cols"] = [];
    ws["!cols"][6] = { hidden: true };
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  /*************************************CLOSE PICKLIST**************************************************** */
  const handelView = (e, picklistId) => {
    e.preventDefault();
    navigate("/view-pick-list-items/" + picklistId);
  };
  /*************************************CLOSE PICKLIST**************************************************** */
  const handelClosePickList = (e, picklistId) => {
    e.preventDefault();
    navigate("/pick-list-close/" + picklistId);
  };
  /****************************************DATE WISE SORT *************************************************** */

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
            <TableCell>Status</TableCell>
            <TableCell>Picklist ID</TableCell>
            <TableCell>Created Date</TableCell>
            <TableCell>Created Username</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>MUIC</TableCell>
            <TableCell>In Picklist Count</TableCell>
            <TableCell>In WHT</TableCell>
            <TableCell>Closed Date</TableCell>
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
              <TableCell>{data.pick_list_id}</TableCell>
              <TableCell>
                {new Date(data?.created_at).toLocaleString("en-GB", {
                  hour12: true,
                })}
              </TableCell>
              <TableCell>{data.created_user_name}</TableCell>
              <TableCell>{data.brand_name}</TableCell>
              <TableCell>{data.model_name}</TableCell>
              <TableCell>{data.muic}</TableCell>
              <TableCell>{data.items.length}</TableCell>
              <TableCell>{data.items.length}</TableCell>
              <TableCell>
                {data.closed_time == null
                  ? null
                  : new Date(data?.closed_time).toLocaleString("en-GB", {
                      hour12: true,
                    })}
              </TableCell>
              <TableCell>
                {" "}
                <Button
                  variant="contained"
                  style={{ backgroundColor: "green" }}
                  onClick={(e) => {
                    handelView(e, data.pick_list_id);
                  }}
                >
                  View
                </Button>
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
                {data.pick_list_status == "Pending" ? (
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
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <TableContainer>{tableData}</TableContainer>
      </Paper>
    </div>
  );
}
