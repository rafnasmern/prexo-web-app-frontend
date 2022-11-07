import React, { useState, useEffect, useMemo } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import {
  MenuItem,
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableFooter,
  FormControl,
  InputLabel,
  Select,
  Box,
  TablePagination,
  TextField,
  Container
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { axiosMisUser } from "../../../axios";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [item, setItem] = useState([]);
  const [allOrders, setAllOrders] = useState(false);
  const [deliveredOrders, setDeliveredOrders] = useState(false);
  const [deliverdBut, setDeliveredBut] = useState(false);
  const [noOrders, setNoOrders] = useState(false);
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = useState({
    type: "",
    searchData: "",
    location: "",
  });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      let { location } = jwt_decode(admin);
    } else {
      navigate("/");
    }
  }, []);
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

  let admin = localStorage.getItem("prexo-authentication");
  let location1;
  if (admin) {
    let { location } = jwt_decode(admin);
    location1 = location;
  }
  const handelAllOrders = async () => {
    try {
      // $("#example").DataTable().destroy();
      setLoading(true);
      let res = await axiosMisUser.post("/getOrders/" + location1);
      if (res.status == 200) {
        setDeliveredOrders(false);
        setLoading(false);
        setAllOrders(true);
        setItem(res.data.data);
        // dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  const handeNewOrders = async () => {
    try {
      // $("#example").DataTable().destroy();
      let res = await axiosMisUser.post("/newOrders/" + location1);
      if (res.status == 200) {
        setDeliveredBut(false);
        setNoOrders(false);

        setItem(res.data.data);
        // dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelDeliverdOrders = async () => {
    try {
      // $("#example").DataTable().destroy();
      setLoading(true);
      let res = await axiosMisUser.post("/getDeliveredOrders/" + location1);
      if (res.status == 200) {
        setAllOrders(false);
        setLoading(false);
        setDeliveredOrders(true);
        setItem(res.data.data);
        // dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelNotDelivered = async () => {
    try {
      // $("#example").DataTable().destroy();
      setLoading(true);
      let res = await axiosMisUser.post("/notDeliveredOrders/" + location1);
      if (res.status == 200) {
        setDeliveredOrders(false);
        setLoading(false);
        setAllOrders(false);
        setItem(res.data.data);
        // dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelDeliveredNoOrders = async () => {
    try {
      // $("#example").DataTable().destroy();
      let res = await axiosMisUser.post("/deliveredNoOrderId/" + location1);
      if (res.status == 200) {
        setDeliveredBut(false);
        setItem(res.data.data);
        // dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
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

  /*****************************************SEARCH ORDERS*************************************************** */
  const searchOrders = async (e) => {
    e.preventDefault();
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        if (e.target.value == "") {
          if (deliveredOrders) {
            handelDeliverdOrders();
          } else if (allOrders) {
            handelAllOrders();
          } else {
            handelNotDelivered();
          }
        } else {
          let obj = {
            location: location,
            type: search.type,
            searchData: e.target.value,
          };
          if (allOrders) {
            let res = await axiosMisUser.post("/ordersSearch", obj);
            setRowsPerPage(10);
            setPage(0);
            if (res.status == 200 && res.data.data?.length !== 0) {
              setItem(res.data.data);
            } else {
              alert("No data found");
            }
          } else if (deliveredOrders) {
            let res = await axiosMisUser.post("/searchDeliveredOrders", obj);
            setRowsPerPage(10);
            setPage(0);
            if (res.status == 200 && res.data.data?.length !== 0) {
              setItem(res.data.data);
            } else {
              alert("No data found");
            }
          } else {
            let res = await axiosMisUser.post("/ordersSearch", obj);
            setRowsPerPage(10);
            setPage(0);
            if (res.status == 200 && res.data.data?.length !== 0) {
              setItem(res.data.data);
            } else {
              alert("No data found");
            }
          }
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const tableData = useMemo(() => {
    return (
      <>
        {" "}
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Record.NO</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Order TimeStamp</TableCell>
              <TableCell>Order Status</TableCell>
              {/* <TableCell>Buyback Category</TableCell> */}
              <TableCell>Partner ID</TableCell>
              {/* <TableCell>Partner Email</TableCell> */}
              {/* <TableCell>Partner Shop</TableCell> */}
              <TableCell>Item ID</TableCell>
              <TableCell>Old Item Details</TableCell>
              <TableCell>IMEI</TableCell>
              {/* <TableCell>GEP Order</TableCell> */}
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

              {/* {
                            deliverdBut ?
                                <> */}
              <TableCell>Tracking ID</TableCell>
              <TableCell>Order ID</TableCell>
              {/* <TableCell>Order Date</TableCell> */}
              <TableCell>Item ID</TableCell>
              <TableCell>Gep Order</TableCell>
              <TableCell>IMEI</TableCell>
              <TableCell>Partner Purchase Price</TableCell>
              <TableCell>Partner Shop</TableCell>
              <TableCell>Base Discount</TableCell>
              <TableCell>Diganostic Discount</TableCell>
              <TableCell>Storage Discount</TableCell>
              <TableCell>Buyback Category</TableCell>
              <TableCell>Doorstep Diganostic</TableCell>
              {/* </>
                                : ""
                        } */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data, index) => (
              <TableRow tabIndex={-1}>
                <TableCell>{data.id}</TableCell>
                <TableCell
                  style={
                    data.delivery_status == "Pending"
                      ? { color: "red" }
                      : { color: "green" }
                  }
                >
                  {data?.delivery_status}
                </TableCell>
                <TableCell>{data.order_id?.toString()}</TableCell>
                <TableCell>
                  {data.order_date == null
                    ? ""
                    : new Date(data.order_date).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                </TableCell>
                <TableCell>
                  {" "}
                  {data.order_timestamp == null
                    ? ""
                    : new Date(data.order_timestamp).toLocaleString("en-GB", {
                        hour12: true,
                      })}
                </TableCell>
                <TableCell>{data.order_status?.toString()}</TableCell>
                {/* <TableCell>{data.buyback_category?.toString()}</TableCell> */}
                <TableCell>{data.partner_id?.toString()}</TableCell>
                {/* <TableCell>{data.partner_email?.toString()}</TableCell> */}
                {/* <TableCell>{data.partner_shop?.toString()}</TableCell> */}
                <TableCell>{data.item_id?.toString()}</TableCell>
                <TableCell>{data.old_item_details?.toString()}</TableCell>
                <TableCell>{data.imei?.toString()}</TableCell>
                {/* <TableCell>{data.gep_order?.toString()}</TableCell> */}
                <TableCell>{data.base_discount?.toString()}</TableCell>
                <TableCell>{data.diagnostic}</TableCell>
                <TableCell>{data.partner_purchase_price}</TableCell>
                <TableCell>{data.tracking_id}</TableCell>
                <TableCell>
                  {" "}
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
                <TableCell>{data.gc_amount_refund_time?.toString()}</TableCell>
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
                <TableCell>{data.revised_partner_price?.toString()}</TableCell>
                <TableCell>{data.delivery_fee?.toString()}</TableCell>
                <TableCell>
                  {data.exchange_facilitation_fee?.toString()}
                </TableCell>

                {/* {
                                deliverdBut ?
                                    <> */}
                <TableCell>{data.delivery?.tracking_id?.toString()}</TableCell>
                <TableCell>{data.delivery?.order_id?.toString()}</TableCell>
                {/* <TableCell>
                  {" "}
                  {data?.order_date == null
                    ? ""
                    : new Date(data.order_date).toLocaleString("en-GB", {
                        hour12: true,
                      })}
                </TableCell> */}
                <TableCell>{data.delivery?.item_id?.toString()}</TableCell>
                <TableCell>{data.delivery?.gep_order?.toString()}</TableCell>
                <TableCell>{data.delivery?.imei?.toString()}</TableCell>
                <TableCell>
                  {data.delivery?.partner_purchase_price?.toString()}
                </TableCell>
                <TableCell>{data.delivery?.partner_shop?.toString()}</TableCell>
                <TableCell>
                  {data.delivery?.base_discount?.toString()}
                </TableCell>
                <TableCell>
                  {data.delivery?.diagnostics_discount?.toString()}
                </TableCell>
                <TableCell>
                  {data.delivery?.storage_disscount?.toString()}
                </TableCell>
                <TableCell>
                  {data.delivery?.buyback_category?.toString()}
                </TableCell>
                <TableCell>
                  {data.delivery?.doorsteps_diagnostics?.toString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  }, [item, data]);
  return (
    <div style={{ marginTop: "100px", }}>
      <Box>
        <Box
          sx={{
            float: "left",
          }}
        >
          {item.length !== 0 ? (
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
                  <MenuItem value="order_id">Order ID</MenuItem>
                  {/* <MenuItem value="order_date">order Date</MenuItem> */}
                  {/* <MenuItem value="order_date">Order Date</MenuItem> */}
                  {/* <MenuItem value="order_status">Delivery Status</MenuItem> */}
                  <MenuItem value="imei">IMEI</MenuItem>
                  <MenuItem value="tracking_id">Tracking ID</MenuItem>
                  <MenuItem value="item_id">Item ID</MenuItem>
                  {/* <MenuItem value="old_item_details">OLD Item Details</MenuItem>  */}
                </Select>
              </FormControl>
              <TextField
                onChange={(e) => {
                  searchOrders(e);
                }}
                disabled={search.type == "" ? true : false}
                label="Search"
                variant="outlined"
                fullWidth
                sx={{ m: 2 }}
              />
            </Box>
          ) : null}
        </Box>
        <Box
          sx={{
            float: "right",
            m: 1,
          }}
        >
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
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
            <MenuItem onClick={handelAllOrders} disableRipple>
              All Orders
            </MenuItem>
            {/* <MenuItem onClick={handeNewOrders} disableRipple>
          New Orders
        </MenuItem> */}
            <MenuItem onClick={handelDeliverdOrders} disableRipple>
              Delivered Orders
            </MenuItem>
            <MenuItem onClick={handelNotDelivered} disableRipple>
              Not Delivered Orders
            </MenuItem>
            {/* <MenuItem onClick={handelDeliveredNoOrders} disableRipple>
          Delivered But Not In Orders
        </MenuItem> */}
          </StyledMenu>
        </Box>
      </Box>
      {
        loading === true ? 
          <Container>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                pt: 30,
              }}
            >
              <CircularProgress />
              <p style={{ paddingTop: "10px" }}>Loading...</p>
            </Box>
          </Container>
          :

      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          {" "}
          {tableData}
          <TableFooter>
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
          </TableFooter>
        </TableContainer>
      </Paper>
      }
    </div>
  );
}
