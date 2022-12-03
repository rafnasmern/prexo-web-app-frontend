import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { useParams } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, axiosSuperAdminPrexo } from "../../../axios";
import Checkbox from "@mui/material/Checkbox";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";

//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function Home() {
  const [item, setItem] = useState([]);
  const navigate = useNavigate();
  const { bagId } = useParams();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [found, setFound] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    try {
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/getBagItemWithUic/" + bagId);
          if (res.status == 200) {
            setItem(res.data.data);
            dataTableFun();
          }
        };
        fetchData();
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error);
    }
  }, [refresh]);
  let token = localStorage.getItem("prexo-authentication");
  let user_name1;
  if (token) {
    const { user_name } = jwt_decode(token);
    user_name1 = user_name;
  }
  const handelUicGen = (e) => {
    e.preventDefault();
    if (isCheck.length == 0) {
      alert("Please Select Atleast One Delivered Data");
    } else {
      setLoading(true);
      const addUic = async () => {
        let count = 0;
        for (let i = 0; i < isCheck.length; i++) {
          if (item?.[0]?.delivery?.[isCheck[i]].uic_status != "Pending") {
            alert("Already UIC Created");
            setFound(true);
            break;
          }
          try {
            let obj = {
              _id: item?.[0]?.delivery?.[isCheck[i]]._id,
              email: user_name1,
              created_at: Date.now(),
            };
            let res = await axiosMisUser.post("/addUicCode", obj);
            if (res.status == 200) {
            }
          } catch (error) {
            alert(error);
          }
          count++;
        }
        if (count == isCheck.length) {
          alert("Successfully Generated");
          setLoading(false);
          setIsCheck([]);
          setRefresh((refresh) => !refresh);
        }
      };
      addUic();
    }
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (fileName) => {
    if (isCheck.length == 0) {
      alert("Please Select Atleast One Data");
    } else {
      let arr = [];
      let status = false;
      let changeStatus = async () => {
        for (let i = 0; i < isCheck.length; i++) {
          if (item?.[0]?.delivery?.[isCheck[i]].uic_code == undefined) {
            alert("Please Generate UIC");
            status = true;
            break;
          } else {
            try {
              let res = await axiosMisUser.put(
                "/changeUicStatus/" + item?.[0]?.delivery?.[isCheck[i]]?._id
              );
              if (res.status == 200) {
              }
            } catch (error) {
              alert(error);
            }
            let obj = {
              UIC: item?.[0]?.delivery?.[isCheck[i]]?.uic_code?.code,
              IMEI: item?.[0]?.delivery?.[isCheck[i]]?.imei?.replace(
                /[^a-zA-Z0-9 ]/g,
                ""
              ),
              Model: item?.[0]?.delivery?.[
                isCheck[i]
              ]?.order_old_item_detail?.replace(/[^a-zA-Z0-9 ]/g, " "),
            };

            arr.push(obj);
          }
        }
        if (status == false) {
          download(arr, fileName);
        }
      };
      changeStatus();
    }
  };
  function download(arr, fileName) {
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
    setIsCheck([]);
    setRefresh((refresh) => !refresh);
  }
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(item?.[0]?.delivery?.map((li, index) => index.toString()));
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

  const tabelData = useMemo(() => {
    return (
      <Table id="example">
        <TableHead>
          <TableRow>
            <TableCell>
              {" "}
              <Checkbox
                {...label}
                onClick={(e) => {
                  handleSelectAll();
                }}
                checked={
                  item?.[0]?.delivery?.length == isCheck.length ? true : false
                }
              />{" "}
              Select All
            </TableCell>
            <TableCell>S.NO</TableCell>
            <TableCell>UIC Status</TableCell>
            <TableCell>UIC Generated Admin</TableCell>
            <TableCell>UIC Generated Time</TableCell>
            <TableCell>UIC Code</TableCell>
            <TableCell>UIC Downloaded Time</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Tracking ID</TableCell>
            <TableCell>Actual Delivery Date</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>IMEI</TableCell>
            <TableCell>Item ID</TableCell>
            <TableCell>Old Item Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item?.[0]?.delivery?.map((data, index) => (
            <TableRow tabIndex={-1}>
              <TableCell>
                {" "}
                <Checkbox
                  {...label}
                  onClick={(e) => {
                    handleClick(e);
                  }}
                  id={index}
                  key={index}
                  checked={isCheck.includes(index?.toString())}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell
                style={
                  data?.uic_status == "Pending"
                    ? { color: "red" }
                    : data?.uic_status == "Created"
                    ? { color: "orange" }
                    : { color: "green" }
                }
              >
                {data?.uic_status}
              </TableCell>
              <TableCell>{data?.uic_code?.user}</TableCell>
              <TableCell>
                {" "}
                {data?.uic_code?.created_at == undefined
                  ? ""
                  : new Date(data?.uic_code?.created_at).toLocaleString(
                      "en-GB",
                      { hour12: true }
                    )}
              </TableCell>
              <TableCell>{data?.uic_code?.code}</TableCell>
              <TableCell>
                {data?.download_time == undefined
                  ? ""
                  : new Date(data?.download_time).toLocaleString("en-GB", {
                      hour12: true,
                    })}
              </TableCell>
              <TableCell>{data.order_id?.toString()}</TableCell>
              <TableCell>{data.tracking_id?.toString()}</TableCell>
              <TableCell>
                {new Date(data?.delivery_date).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </TableCell>
              <TableCell>
                {new Date(data.order_order_date).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </TableCell>
              <TableCell>{data.imei?.toString()}</TableCell>
              <TableCell>{data.item_id?.toString()}</TableCell>
              <TableCell>{data.order_old_item_detail?.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [item, isCheck]);
  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            mt: 9,
            mr: 3,
            ml: 3,
          }}
        >
          <Box sx={{ mr: 3 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              disabled={loading}
              style={{ backgroundColor: "#206CE2", float: "left" }}
              onClick={(e) => {
                handelUicGen(e);
              }}
            >
              Generate UIC
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              style={{ backgroundColor: "#206CE2", float: "left" }}
              onClick={(e) => {
                exportToCSV("UIC-Printing-Sheet");
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
        {/* <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="contained"
          disableElevation
          onClick={handleOptions}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Options
        </Button>
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handelUicAll} disableRipple>
            All
          </MenuItem>
          <MenuItem onClick={handelUicGenerated} disableRipple>
            UIC Generated
          </MenuItem>
          <MenuItem onClick={handelUicNotGenrated} disableRipple>
            UIC Not Generated
          </MenuItem>
          <MenuItem onClick={handelUicDownloaded} disableRipple>
            UIC Downloaded
          </MenuItem>
        </StyledMenu> */}
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3, mb: 2 }}>
        <TableContainer>{tabelData}</TableContainer>
      </Paper>
    </>
  );
}
