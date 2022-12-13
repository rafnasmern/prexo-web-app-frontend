import React, { useState, useEffect } from "react";
import { Box, colors, Container, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import {
  Paper,
  TableFooter,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, } from "../../../axios";
import * as FileSaver from "file-saver";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import Checkbox from "@mui/material/Checkbox";
/*************************************************************************************** */

export default function Home() {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [item, setItem] = useState([]);
  const navigate = useNavigate();
  const [isCheck, setIsCheck] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState({
    type: "",
    searchData: "",
    location: "",
  });
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/getBadOrders/" + location);
          if (res.status == 200) {
            setItem(res.data.data);
            // dataTableFun()
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
  /*********************************USEEFECT FOR PAGINATION**************************************** */
  useEffect(() => {
    setData((_) =>
      item
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((d, index) => {
          d.id = page * rowsPerPage + index + 1;
          return d;
        })
    );
  }, [page, item, rowsPerPage]);
  const handelRevalidate = (e) => {
    download(item, "bad-orders");
  };
  // // REMOVE DATA
  // const handelRemoveData = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (isCheck.length == 0) {
  //       alert("Please Select Atleast One Data");
  //     } else {
  //       let res = await axiosMisUser.post("/deleteBadOrders", isCheck);
  //       if (res.status == 200) {
  //         alert(res.data.message);
  //         window.location.reload(false);
  //       }
  //     }
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  function download(arr, fileName) {
    const ws = XLSX.utils.json_to_sheet(arr);
    ws["!cols"] = [];
    ws["!cols"][0] = { hidden: true };
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  // const label = { inputProps: { "aria-label": "Checkbox demo" } };
  // const handleSelectAll = (e) => {
  //   setIsCheckAll(!isCheckAll);
  //   setIsCheck(item.map((li, index) => li._id));
  //   if (isCheckAll) {
  //     setIsCheck([]);
  //   }
  // };
  // const handleClick = (e) => {
  //   const { id, checked } = e.target;
  //   setIsCheck([...isCheck, id]);
  //   if (!checked) {
  //     setIsCheck(isCheck.filter((item) => item !== id));
  //   }
  // };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /*****************************************SEARCH ORDERS*************************************************** */
  const searchOrders = async (e) => {
    e.preventDefault();

    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        if (e.target.value == "") {
          setRefresh((refresh) => !refresh);
        }  else {
          let obj = {
            location: location,
            type: search.type,
            searchData: e.target.value,
          };
          let res = await axiosMisUser.post("/badOrdersSearch", obj);
          if (res.status == 200) {
            setRowsPerPage(10);
            setPage(0);
            setItem(res.data.data);
          }
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  /*************************************PAGINATION**************************************************** */
  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      <Box
        sx={{
          mt: 11,
          mr: 3,
          ml: 3,
        }}
      >
        <Box
          sx={{
            float: "left",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "start",
            }}
          >
            <FormControl sx={{ m: 1 }} fullWidth>
              <InputLabel sx={{ pt: 1 }} id="demo-simple-select-label">
                Select
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                label="Select search field"
                sx={{ m: 1 }}
                onChange={(e) => {
                  setSearch((p) => ({ ...p, type: e.target.value }));
                }}
              >
                <MenuItem value="order_id">Order Id</MenuItem>
                {/* <MenuItem value="order_date">order Date</MenuItem> */}
                {/* <MenuItem value="order_date">Order Date</MenuItem> */}
                <MenuItem value="order_status">Order Status</MenuItem>
                <MenuItem value="imei">IMEI</MenuItem>
                <MenuItem value="tracking_id">Tracking ID</MenuItem>
                <MenuItem value="item_id">Item ID</MenuItem>
                <MenuItem value="old_item_details">OLD Item Details</MenuItem>
              </Select>
            </FormControl>
            <TextField
              onChange={(e) => {
                searchOrders(e);
              }}
              label="Search"
              variant="outlined"
              disabled={search.type == "" ? true : false}
              fullWidth
              sx={{ m: 2 }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            float: "right",
          }}
        >
          {item.length != 0 ? (
            <>
              {/* <Button
                variant="contained"
                sx={{ m: 2 }}
                style={{ backgroundColor: "red", float: "left" }}
                onClick={(e) => {
                  handelRemoveData(e);
                }}
              >
                Remove Data
              </Button> */}
              <Button
                variant="contained"
                sx={{ m: 2 }}
                style={{ backgroundColor: "#206CE2", float: "left" }}
                onClick={(e) => {
                  handelRevalidate(e);
                }}
              >
                Download
              </Button>
            </>
          ) : (
            ""
          )}
        </Box>
      </Box>
      <Container maxWidth="xs"></Container>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
        <TableContainer sx={{ maxHeight: 1000, }} >
          <Table   stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Record.NO</TableCell>
                {/* <TableCell>Order Status</TableCell> */}
                <TableCell>Order Imported TimeStamp</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Order TimeStamp</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Partner ID</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>Old Item Details</TableCell>
                <TableCell>IMEI</TableCell>
                <TableCell>Base Disscount</TableCell>
                <TableCell>Diganostic</TableCell>
                <TableCell>Partner Purchase Price</TableCell>
                <TableCell>Tracking ID</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Order ID Replaced</TableCell>
                <TableCell>Deliverd With OTP</TableCell>
                <TableCell>Deliverd With Bag Exception</TableCell>
                <TableCell>GC Amount Redeemed</TableCell>
                <TableCell>GC Amount Refund</TableCell>
                <TableCell>GC Redeem Time</TableCell>
                <TableCell>GC Amount Refund Time</TableCell>
                <TableCell>Diagonstic Status</TableCell>
                <TableCell>VC Eligible</TableCell>
                <TableCell>
                  Customer Declaration Physical Defect Present
                </TableCell>
                <TableCell>Customer Declaration Physical Defect Type</TableCell>
                <TableCell>Partner Price No Defect</TableCell>
                <TableCell>Revised Partner Price</TableCell>
                <TableCell>Delivery Fee</TableCell>
                <TableCell>Exchange Facilitation Fee</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((data, index) => (
                <TableRow tabIndex={-1}>
                  <TableCell>{data.id}</TableCell>
                  {/* <TableCell
                    style={
                      data.delivery_status == "Pending"
                        ? { color: "red" }
                        : { color: "green" }
                    }
                  >
                    {data.delivery_status}
                  </TableCell> */}
                  <TableCell>
                    {new Date(data.created_at).toLocaleString("en-GB", {
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>{data.order_id?.toString()}</TableCell>
                  <TableCell>
                    {data?.order_date == null
                      ? ""
                      : new Date(data.order_date).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                  </TableCell>
                  <TableCell>
                    {data?.order_timestamp == null
                      ? ""
                      : new Date(data.order_timestamp).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                  </TableCell>
                  <TableCell>{data.order_status?.toString()}</TableCell>
                  <TableCell>{data.partner_id?.toString()}</TableCell>
                  <TableCell>{data.item_id?.toString()}</TableCell>
                  <TableCell>{data.old_item_details?.toString()}</TableCell>
                  <TableCell>{data.imei?.toString()}</TableCell>
                  <TableCell>₹{data.base_discount?.toString()}</TableCell>
                  <TableCell>{data.diagnostic}</TableCell>
                  <TableCell>₹{data.partner_purchase_price}</TableCell>
                  <TableCell>{data.tracking_id}</TableCell>
                  <TableCell>
                    {data.delivery_date == null
                      ? ""
                      : new Date(data.delivery_date).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                  </TableCell>
                  <TableCell>{data.order_id_replaced}</TableCell>
                  <TableCell>{data.deliverd_with_otp}</TableCell>
                  <TableCell>{data.deliverd_with_bag_exception}</TableCell>
                  <TableCell>{data.gc_amount_redeemed?.toString()}</TableCell>
                  <TableCell>{data.gc_amount_refund?.toString()}</TableCell>
                  <TableCell>
                    {data.gc_redeem_time == null
                      ? ""
                      : new Date(data.gc_redeem_time).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                  </TableCell>
                  <TableCell>
                    {data.gc_amount_refund_time == null
                      ? ""
                      : new Date(data.gc_amount_refund_time).toLocaleString(
                          "en-GB",
                          {
                            hour12: true,
                          }
                        )}
                  </TableCell>
                  <TableCell>{data.diagnstic_status?.toString()}</TableCell>
                  <TableCell>{data.vc_eligible?.toString()}</TableCell>
                  <TableCell>
                    {data.customer_declaration_physical_defect_present?.toString()}
                  </TableCell>
                  <TableCell>
                    {data.customer_declaration_physical_defect_type?.toString()}
                  </TableCell>
                  <TableCell>
                    {data.partner_price_no_defect?.toString()}
                  </TableCell>
                  <TableCell>
                    ₹{data.revised_partner_price?.toString()}
                  </TableCell>
                  <TableCell>₹{data.delivery_fee?.toString()}</TableCell>
                  <TableCell>
                    ₹{data.exchange_facilitation_fee?.toString()}
                  </TableCell>
                  <TableCell style={{color:"red"}}>
                    {data.reason}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 50, 100]}
                colSpan={3}
                count={item.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </TableContainer>
      </Paper>
    </>
  );
}
