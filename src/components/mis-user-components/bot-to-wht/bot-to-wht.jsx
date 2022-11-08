import React, { useState, useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
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
import { useNavigate } from "react-router-dom";
import { axiosMisUser } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import moment from "moment";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function CustomizedMenus() {
  const [item, setItem] = useState([]);
  const navigate = useNavigate();
  const [sortDate, setSortDate] = useState("");
  const [sortData, setSortData] = useState(false);
  const [yesterdayDate, setYesterDayDate] = useState("");
  /*-----------------------------------------------------------------------------*/
  useEffect(() => {
    let date = new Date(); // Today!
    setYesterDayDate(date.setDate(date.getDate() - 1));
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const { location } = jwt_decode(admin);
      const fetchData = async () => {
        try {
          let res = await axiosMisUser.post("/wh-closed-bot-tray/" + location);
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
  /*-----------------------------------------------------------------------------*/
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /****************************************DATE WISE SORT *************************************************** */
  const handelSort = async (e) => {
    e.preventDefault();
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        const { location } = jwt_decode(admin);
        let obj = {
          date: sortDate,
          location: location,
        };
        let res = await axiosMisUser.post("/wht-bot-sort", obj);
        $("#example").DataTable().destroy();
        if (res.status == 200) {
          setSortData(true);
          setItem(res.data.data);
          dataTableFun();
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  /*-----------------------------------------------------------------------------*/
  // NAVIGATE TO ASSIGN FOR SORTING PAGE
  const handelAssignForSorting = (e, code) => {
    e.preventDefault();
    navigate("/assign-for-sorting/" + code);
  };
  /*-----------------------------------------------------------------------------*/
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
            <TableCell>Tray ID</TableCell>
            <TableCell>Date of Clouser</TableCell>
            <TableCell>Items Count</TableCell>
            <TableCell>Sku's Count</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item?.map((data, index) => (
            <TableRow tabIndex={-1}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{data.code}</TableCell>
              <TableCell>
                {" "}
                {new Date(data.closed_time_wharehouse_from_bot).toLocaleString(
                  "en-GB",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )}
              </TableCell>
              <TableCell>
                {data.items.length}/{data.limit}
              </TableCell>
              <TableCell>{data.temp_array.length}</TableCell>
              <TableCell>{data.sort_id}</TableCell>
              <TableCell>
                <Button
                  sx={{
                    ml: 2,
                  }}
                  variant="contained"
                  style={{ backgroundColor: "green" }}
                  component="span"
                  onClick={(e) => {
                    handelAssignForSorting(e, data.code);
                  }}
                >
                  Assign For Sorting
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [item]);
  return (
    <div
      style={{ marginTop: "100px", marginLeft: "20px", marginRight: "20px" }}
    >
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
            helperText="Please Select BOT closed Date"
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
