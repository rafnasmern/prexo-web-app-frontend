import React, { useState, useEffect, useMemo } from "react";
import {
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Box,
  TableFooter,
  TablePagination,
  Select,
  TextField,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosSuperAdminPrexo } from "../../../axios";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomizedMenus() {
  const [page, setPage] = React.useState(0);
  const [item, setItem] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    type: "",
    searchData: "",
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setData((_) =>
      item.map((d, index) => {
        d.id = page * rowsPerPage + index + 1;
        return d;
      })
    );
  }, [page, item, rowsPerPage]);
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const fetchData = async () => {
        try {
          setLoading(false);
          let res = await axiosSuperAdminPrexo.post(
            "/itemTracking/" + page + "/" + rowsPerPage
          );
          if (res.status == 200) {
            setLoading(true);
            setItem(res.data.data);
            setCount(res.data.count);
            // dataTableFun();
          }
        } catch (error) {
          alert(error);
        }
      };
      fetchData();
    } else {
      navigate("/");
    }
  }, [refresh, page]);

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
  /*******************************SEARCH********************************* */
  const searchTrackItem = async (e) => {
    e.preventDefault();
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        if (e.target.value == "") {
          window.location.reload(false);
        } else {
          let obj = {
            location: location,
            type: search.type,
            searchData: e.target.value,
          };
          let res = await axiosSuperAdminPrexo.post(
            "/search-admin-track-item",
            obj
          );
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
  const tableData = useMemo(() => {
    return (
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Record.NO</TableCell>
            <TableCell>Delivery Status</TableCell>
            <TableCell>Tracking ID</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Uic Status</TableCell>
            <TableCell>UIC</TableCell>
            <TableCell>IMEI</TableCell>
            <TableCell>Item ID</TableCell>
            <TableCell>Stockin Date</TableCell>
            <TableCell>Bag ID</TableCell>
            <TableCell>Stockin Status</TableCell>
            <TableCell>Bag close Date</TableCell>
            <TableCell>BOT Agent Name</TableCell>
            <TableCell>Assigned to BOT Agent Date</TableCell>
            <TableCell>Tray ID</TableCell>
            <TableCell>Tray Type</TableCell>
            <TableCell>Tray Status</TableCell>
            <TableCell>Tray Location</TableCell>
            <TableCell>Tray Closed Time BOT</TableCell>
            <TableCell>Tray Received From BOT Time Warehouse</TableCell>
            <TableCell>Tray Closed Time Warehouse</TableCell>
            <TableCell>Sorting Agent Name</TableCell>
            <TableCell>Handover to Sorting Date</TableCell>
            <TableCell>WHT Tray</TableCell>
            <TableCell>WHT Tray Assigned Date</TableCell>
            <TableCell>WHT Tray Received From Sorting</TableCell>
            <TableCell>WHT Tray Closed After Sorting</TableCell>
            <TableCell>Charging Username</TableCell>
            <TableCell>Charging Assigned Date</TableCell>
            <TableCell>Charge In Date</TableCell>
            <TableCell>Charge Done Date</TableCell>
            <TableCell>Tray Received From Charging Time Warehouse</TableCell>
            <TableCell>Charging Done Tray Closed Time Warehouse</TableCell>
            <TableCell>BQC Agent Name</TableCell>
            <TableCell>Assigned to BQC</TableCell>
            <TableCell>BQC IN Date</TableCell>
            <TableCell>BQC Done Date</TableCell>
            <TableCell>Tray Received From BQC Time Warehouse</TableCell>
            <TableCell>Bqc Done Tray Closed Time Warehouse</TableCell>
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
              <TableCell>{data.delivery.tracking_id}</TableCell>
              <TableCell>{data.delivery.order_id}</TableCell>
              <TableCell
                style={
                  data.delivery.uic_status == "Printed"
                    ? { color: "green" }
                    : data.delivery.uic_status == "Created"
                    ? { color: "orange" }
                    : { color: "red" }
                }
              >
                {data.delivery.uic_status}
              </TableCell>
              <TableCell>{data.delivery.uic_code?.code}</TableCell>
              <TableCell>{data.delivery.imei}</TableCell>

              <TableCell>{data.delivery.item_id}</TableCell>
              <TableCell>
                {data?.delivery.stockin_date != undefined
                  ? new Date(data?.delivery.stockin_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.bag_id}</TableCell>
              <TableCell
                style={
                  data.delivery.stock_in_status == "Valid"
                    ? { color: "green" }
                    : { color: "red" }
                }
              >
                {data.delivery.stock_in_status}
              </TableCell>
              <TableCell>
                {data?.delivery.bag_close_date != undefined
                  ? new Date(data?.delivery.bag_close_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.agent_name}</TableCell>
              <TableCell>
                {data?.delivery.assign_to_agent != undefined
                  ? new Date(data?.delivery.assign_to_agent).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.tray_id}</TableCell>
              <TableCell>{data.delivery.tray_type}</TableCell>
              <TableCell>{data.delivery.tray_status}</TableCell>
              <TableCell>{data.delivery.tray_location}</TableCell>
              <TableCell>
                {data?.delivery.tray_closed_by_bot != undefined
                  ? new Date(data?.delivery.tray_closed_by_bot).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.bot_done_received != undefined
                  ? new Date(data?.delivery.bot_done_received).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.warehouse_close_date != undefined
                  ? new Date(
                      data?.delivery.warehouse_close_date
                    ).toLocaleString("en-GB", {
                      hour12: true,
                    })
                  : data?.delivery.tray_close_wh_date != undefined
                  ? new Date(data?.delivery.tray_close_wh_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : null}
              </TableCell>
              <TableCell>{data.delivery.sorting_agent_name}</TableCell>
              <TableCell>
                {data?.delivery.handover_sorting_date != undefined
                  ? new Date(
                      data?.delivery.handover_sorting_date
                    ).toLocaleString("en-GB", {
                      hour12: true,
                    })
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.wht_tray}</TableCell>
              <TableCell>
                {data?.delivery.wht_tray_assigned_date != undefined
                  ? new Date(
                      data?.delivery.wht_tray_assigned_date
                    ).toLocaleString("en-GB", {
                      hour12: true,
                    })
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.received_from_sorting != undefined
                  ? new Date(
                      data?.delivery.received_from_sorting
                    ).toLocaleString("en-GB", {
                      hour12: true,
                    })
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.closed_from_sorting != undefined
                  ? new Date(data?.delivery.closed_from_sorting).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.agent_name_charging}</TableCell>
              <TableCell>
                {data?.delivery.assign_to_agent_charging != undefined
                  ? new Date(
                      data?.delivery.assign_to_agent_charging
                    ).toLocaleString("en-GB", {
                      hour12: true,
                    })
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.charging_in_date != undefined
                  ? new Date(data?.delivery.charging_in_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.charging_done_date != undefined
                  ? new Date(data?.delivery.charging_done_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.charging_done_received != undefined
                  ? new Date(
                      data?.delivery.charging_done_received
                    ).toLocaleString("en-GB", {
                      hour12: true,
                    })
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.charging_done_close != undefined
                  ? new Date(data?.delivery.charging_done_close).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.agent_name_bqc}</TableCell>
              <TableCell>
                {data?.delivery.assign_to_agent_bqc != undefined
                  ? new Date(data?.delivery.assign_to_agent_bqc).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.bqc_in_date != undefined
                  ? new Date(data?.delivery.bqc_in_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.bqc_out_date != undefined
                  ? new Date(data?.delivery.bqc_out_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.bqc_done_received != undefined
                  ? new Date(data?.delivery.bqc_done_received).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>
                {data?.delivery.bqc_done_close != undefined
                  ? new Date(data?.delivery.bqc_done_close).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [data, item]);
  return (
    <>
      <Box
        sx={{
          mt: 10,
          ml: 2,
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
            {/* <FormControl sx={{ m: 1 }} fullWidth>
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
                <MenuItem value="uic">UIC</MenuItem>
                <MenuItem value="tracking_id">Tracking ID</MenuItem>
              </Select>
            </FormControl> */}
            <TextField
              onChange={(e) => {
                searchTrackItem(e);
              }}
              label="Search"
              variant="outlined"
              fullWidth
              sx={{ m: 2 }}
            />
          </Box>
        </Box>
      </Box>
      {loading === false ? (
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
      ) : (
        <Paper sx={{ overflow: "hidden", mt: 2, mb: 2 }}>
          <TableContainer>
            {tableData}
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 50, 100]}
                  colSpan={3}
                  count={count}
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
      )}
    </>
  );
}
