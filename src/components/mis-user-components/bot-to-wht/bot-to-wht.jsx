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
import Checkbox from "@mui/material/Checkbox";
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
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
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
  /*********************************************SELECT************************************************ */
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(item?.map((li, index) => li.code));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };
  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  /*-----------------------------------------------------------------------------*/
  // NAVIGATE TO ASSIGN FOR SORTING PAGE
  const handelAssignForSorting = (e, code) => {
    e.preventDefault();
    navigate("/assign-for-sorting", { state: { isCheck: isCheck,type:"Not From Request" } });
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
            <TableCell>
              {" "}
              <Checkbox
                {...label}
                onClick={(e) => {
                  handleSelectAll();
                }}
                checked={item?.length == isCheck.length ? true : false}
              />{" "}
              Select All
            </TableCell>
            <TableCell>Record.NO</TableCell>
            <TableCell>Tray ID</TableCell>
            <TableCell>Date of Clouser</TableCell>
            <TableCell>Items Count</TableCell>
            <TableCell>Sku's Count</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item?.map((data, index) => (
            <TableRow tabIndex={-1}>
              <TableCell>
                {" "}
                <Checkbox
                  {...label}
                  onClick={(e) => {
                    handleClick(e);
                  }}
                  id={data.code}
                  key={data.code}
                  checked={isCheck.includes(data.code)}
                />
              </TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [item, isCheck]);
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
          <Box>
            <Button
              sx={{
                mt: 2,
                height: "48px",
                width: "200px",
              }}
              variant="contained"
              style={{ backgroundColor: "green" }}
              component="span"
              disabled={isCheck.length === 0}
              onClick={(e) => {
                handelAssignForSorting(e);
              }}
            >
              Assign For Sorting
            </Button>
          </Box>
        </Box>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <TableContainer>{tableData}</TableContainer>
      </Paper>
    </div>
  );
}
