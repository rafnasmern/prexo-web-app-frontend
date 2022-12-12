import React, { useState, useEffect } from "react";
import { Box, Container, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TableFooter,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, axiosSuperAdminPrexo } from "../../../axios";
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
/********************************************************************** */

export default function Home() {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const [item, setItem] = useState([]);
  const [isCheck, setIsCheck] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState({
    type: "",
    searchData: "",
    location: "",
  });
  const [page, setPage] = React.useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/getBadDelivery/" + location);
          if (res.status == 200) {
            setItem(res.data.data);
            // dataTableFun();
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
    e.preventDefault();
    download(item, "bad-delivery");
  };
  // REMOVE DATA
  const handelRemoveData = async (e) => {
    e.preventDefault();
    try {
      if (isCheck.length == 0) {
        alert("Please Select Atleast One Data");
      } else {
        let res = await axiosMisUser.post("/deleteBadDelivery", isCheck);
        if (res.status == 200) {
          alert(res.data.message);
          window.location.reload(false);
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  function download(arr, fileName) {
    const ws = XLSX.utils.json_to_sheet(arr);
    ws["!cols"] = [];
    ws["!cols"][0] = { hidden: true };
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(item.map((li, index) => li._id));
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
  /*****************************************SEARCH Delivery*************************************************** */
  const searchDelivery = async (e) => {
    e.preventDefault();

    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        if (e.target.value == "") {
          setRefresh((refresh) => !refresh);
        } else if (search.type == "") {
          alert("Please add input");
        } else {
          let obj = {
            location: location,
            type: search.type,
            searchData: e.target.value,
          };
          let res = await axiosMisUser.post("/searchBadDelivery", obj);
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
  return (
    <>
      <Box
        sx={{
          mt: 4,
          mr: 1,
          ml: 1,
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
              mt: 6,
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
                <MenuItem value="order_id">Order ID</MenuItem>
                {/* <MenuItem value="order_date">Order Date</MenuItem> */}
                {/* <MenuItem value="order_status">UIC Status</MenuItem> */}
                <MenuItem value="imei">IMEI</MenuItem>
                <MenuItem value="tracking_id">Tracking ID</MenuItem>
                <MenuItem value="item_id">Item ID</MenuItem>
              </Select>
            </FormControl>
            <TextField
              onChange={(e) => {
                searchDelivery(e);
              }}
              label="Search"
              variant="outlined"
              fullWidth
              sx={{ m: 2 }}
            />
          </Box>
        </Box>
        <Box sx={{ mt: 6, float: "right" }}>
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
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table id="example">
            <TableHead>
              <TableRow>
                {/* <TableCell>
                  {" "}
                  <Checkbox
                    {...label}
                    onClick={(e) => {
                      handleSelectAll();
                    }}
                    checked={item.length == isCheck.length ? true : false}
                  />{" "}
                  Select All
                </TableCell> */}
                <TableCell>Record.NO</TableCell>
                <TableCell>Delivery Imported Date</TableCell>
                <TableCell>Tracking ID</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>GEP Order</TableCell>
                <TableCell>IMEI</TableCell>
                <TableCell>Partner Purchase Price</TableCell>
                <TableCell>Partner Shop</TableCell>
                <TableCell>Base Discount</TableCell>
                <TableCell>Diagnostics Discount</TableCell>
                <TableCell>Storage Disscount</TableCell>
                <TableCell>Buyback Category</TableCell>
                <TableCell>Doorsteps Diagnostics</TableCell>
                <TableCell>Delivered Date</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((data, index) => (
                <TableRow tabIndex={-1}>
                  {/* <TableCell>
                    {" "}
                    <Checkbox
                      {...label}
                      onClick={(e) => {
                        handleClick(e);
                      }}
                      id={data._id}
                      key={data._id}
                      checked={isCheck.includes(data._id)}
                    />
                  </TableCell> */}
                  <TableCell>{data.id}</TableCell>
                  <TableCell>
                    {new Date(data.created_at).toLocaleString("en-GB", {
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>{data.tracking_id?.toString()}</TableCell>
                  <TableCell>{data.order_id?.toString()}</TableCell>
                  <TableCell>
                    {data?.order_date == null
                      ? ""
                      : new Date(data?.order_date).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                  </TableCell>
                  <TableCell>{data.item_id?.toString()}</TableCell>
                  <TableCell>{data.gep_order?.toString()}</TableCell>
                  <TableCell>{data.imei?.toString()}</TableCell>
                  <TableCell>
                    {data.partner_purchase_price?.toString()}
                  </TableCell>
                  <TableCell>{data.partner_shop?.toString()}</TableCell>
                  <TableCell>{data.base_discount?.toString()}</TableCell>
                  <TableCell>{data.diagnostics_discount?.toString()}</TableCell>
                  <TableCell>{data.storage_disscount?.toString()}</TableCell>
                  <TableCell>{data.buyback_category?.toString()}</TableCell>
                  <TableCell>
                    {data.doorsteps_diagnostics?.toString()}
                  </TableCell>
                  <TableCell>
                    {new Date(data?.delivery_date).toLocaleString("en-GB", {
                      hour12: true,
                    })}
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
