import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  TableFooter,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, axiosSuperAdminPrexo } from "../../../axios";
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

export default function Home() {
  const [page, setPage] = React.useState(0);
  const [item, setItem] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState({
    type: "",
    searchData: "",
    location: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/getAllDelivery/" + location);
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

  const handelDelivery = (e) => {
    e.preventDefault();
    navigate("/delivery-import");
  };
  const handelBadDelivery = (e) => {
    e.preventDefault();
    navigate("/bad-delivery");
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /*****************************************SEARCH Delivery*************************************************** */
  const searchDelivery = async (e) => {
    e.preventDefault();
    let admin = localStorage.getItem("prexo-authentication");
    let { location } = jwt_decode(admin);

    try {
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
        let res = await axiosMisUser.post("/searchDelivery", obj);
        if (res.status == 200) {
          setRowsPerPage(10);
          setPage(0);
          setItem(res.data.data);
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
                <MenuItem value="order_id">Order Id</MenuItem>
                {/* <MenuItem value="order_date">Order Date</MenuItem> */}
                {/* <MenuItem value="order_status">Delivery Imported Date</MenuItem> */}
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
        <Box sx={{ mt: 3, float: "right" }}>
          <Button
            variant="contained"
            sx={{ mt: 5 }}
            style={{ backgroundColor: "#206CE2", float: "left" }}
            onClick={(e) => {
              handelDelivery(e);
            }}
          >
            Add Delivery Data
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 5, ml: 2 }}
            style={{ backgroundColor: "#206CE2" }}
            onClick={(e) => {
              handelBadDelivery(e);
            }}
          >
            View Bad Delivery
          </Button>
        </Box>
      </Box>
      <Container maxWidth="xs"></Container>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table id="example">
            <TableHead>
              <TableRow>
                <TableCell>Record.NO</TableCell>
                <TableCell>Delivery Status</TableCell>
                <TableCell>Delivery Imported Date</TableCell>
                <TableCell>UIC Status</TableCell>
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
                <TableCell>Actual Delivered Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((data, index) => (
                <TableRow tabIndex={-1}>
                  <TableCell>{data.id}</TableCell>
                  <TableCell style={{ color: "green" }}>Delivered</TableCell>
                  <TableCell>
                    {new Date(data.created_at).toLocaleString("en-GB", {
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell
                    style={
                      data.uic_status == "Printed"
                        ? { color: "green" }
                        : data.uic_status == "Created"
                        ? { color: "orange" }
                        : { color: "red" }
                    }
                  >
                    {data.uic_status}
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
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
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
