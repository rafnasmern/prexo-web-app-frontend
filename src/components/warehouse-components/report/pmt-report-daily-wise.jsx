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
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TextField,
  Container,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, axiosWarehouseIn } from "../../../axios";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import moment from "moment";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import CircularProgress from "@mui/material/CircularProgress";

export default function CustomizedMenus() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [item, setItem] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [sortDate, setSortDate] = useState("");
  const [search, setSearch] = useState({
    type: "",
    searchData: "",
    location: "",
  });
  const navigate = useNavigate();
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

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const { location } = jwt_decode(admin);
      const fetchData = async () => {
        setLoading(false);
        try {
          let obj = {
            location: location,
            trayType: "PMT",
          };
          let res = await axiosWarehouseIn.post("/mmt-pmt-report", obj);
          if (res.status == 200) {
            setLoading(true);
            setItem(res.data.data);
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
  }, [refresh]);

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
      setLoading(false);
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        const { location } = jwt_decode(admin);
        let obj = {
          date: sortDate,
          location: location,
          trayType: "PMT",
        };
        let res = await axiosWarehouseIn.post("/sort-mmt-pmt-report", obj);
        if (res.status == 200) {
          setLoading(true);

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
  /*******************************SEARCH********************************* */
  const searchTrackItem = async (e) => {
    e.preventDefault();
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        if (e.target.value == "") {
          setRefresh((refresh) => !refresh);
        } else {
          let obj = {
            location: location,
            type: search.type,
            searchData: e.target.value,
          };
          let res = await axiosMisUser.post("/search-mis-track-item", obj);
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
      <Table id="example">
        <TableHead>
          <TableRow>
            <TableCell>Record.NO</TableCell>
            <TableCell>Tracking ID</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>UIC</TableCell>
            <TableCell>IMEI</TableCell>
            <TableCell>Item ID</TableCell>
            <TableCell>Bag ID</TableCell>
            <TableCell>BOT Agent Name</TableCell>
            <TableCell>Tray ID</TableCell>
            <TableCell>Tray Type</TableCell>
            <TableCell>Tray Closed Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((data, index) => (
            <TableRow tabIndex={-1}>
              <TableCell>{data.id}</TableCell>
              <TableCell>{data.tracking_id}</TableCell>
              <TableCell>{data.order_id}</TableCell>
              <TableCell>{data.uic_code?.code}</TableCell>
              <TableCell>{data.imei}</TableCell>
              <TableCell>{data.item_id}</TableCell>
              <TableCell>{data.bag_id}</TableCell>
              <TableCell>{data.agent_name}</TableCell>
              <TableCell>{data.tray_id}</TableCell>
              <TableCell>{data.tray_type}</TableCell>
              <TableCell>
                {new Date(data?.warehouse_close_date).toLocaleString("en-GB", {
                  hour12: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [item, data]);
  return (
    <div>
      <Box
        sx={{
          mt: 10,
        }}
      >
        {/* <Box
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
                <MenuItem value="uic">UIC</MenuItem>
                <MenuItem value="tracking_id">Tracking ID</MenuItem>
              </Select>
            </FormControl>
            <TextField
              onChange={(e) => {
                searchTrackItem(e);
              }}
              label="Search"
              variant="outlined"
              disabled={search.type == "" ? true : false}
              fullWidth
              sx={{ m: 2 }}
            />
          </Box>
        </Box> */}
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
              helperText="Please Select MMT closed Date"
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
        <Paper sx={{ width: "100%", overflow: "hidden", mt: 3, mb: 2 }}>
          <TableContainer>
            {tableData}
            {item.length == 0 ? (
              <p style={{ textAlign: "center" }}> No data available in table</p>
            ) : null}
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
      )}
    </div>
  );
}
