import React, { useState, useEffect, useMemo } from "react";
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
  MenuItem,
  Menu,
  TableFooter,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, axiosSuperAdminPrexo } from "../../../axios";
import Checkbox from "@mui/material/Checkbox";
import { styled, alpha } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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
  const navigate = useNavigate();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [stateOfPage,setStateOfPage]=useState("")
  const [data, setData] = useState([]);
  const [search, setSearch] = useState({
    type: "",
    searchData: "",
    location: "",
  });
  const open = Boolean(anchorEl);
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    try {
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/uicPageData/" + location);
          if (res.status == 200) {
            setStateOfPage("All")
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
  let token = localStorage.getItem("prexo-authentication");
  const { user_name } = jwt_decode(token);
  const handelUicGen = (e) => {
    e.preventDefault();
    if (isCheck.length == 0) {
      alert("Please Select Atleast One Delivered Data");
    } else {
      const addUic = async () => {
        let count = 0;
        for (let i = 0; i < isCheck.length; i++) {
          if (item[isCheck[i]].uic_status != "Pending") {
            alert("Already UIC Created");

            break;
          }
          try {
            let obj = {
              _id: item[isCheck[i]]?._id,
              email: user_name,
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
          alert("Successfully Created");
          setIsCheck([]);
          setRefresh((refresh) => !refresh);
        }
      };
      addUic();
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (fileName) => {
    console.log("f");
    if (isCheck.length == 0) {
      alert("Please Select Atleast One Data");
    } else {
      let arr = [];
      let status = false;
      let changeStatus = async () => {
        for (let i = 0; i < isCheck.length; i++) {
          if (item[isCheck[i]].uic_code == undefined) {
            alert("Please Generate UIC");
            status = true;
            break;
          } else {
            try {
              let res = await axiosMisUser.put(
                "/changeUicStatus/" + item[isCheck[i]]._id
              );
              if (res.status == 200) {
              }
            } catch (error) {
              alert(error);
            }
            let obj = {
              UIC: item[isCheck[i]].uic_code?.code,
              IMEI: item[isCheck[i]]?.order?.imei?.replace(
                /[^a-zA-Z0-9 ]/g,
                ""
              ),
              Model: item[isCheck[i]]?.order?.old_item_details?.replace(
                /[^a-zA-Z0-9 ]/g,
                " "
              ),
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
  // function dataTableFun() {
  //   $("#example").DataTable({
  //     destroy: true,
  //     scrollX: true,
  //   });
  // }
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(item.map((li, index) => index.toString()));
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

  const handelUicAll = async () => {
    try {
      // $("#example").DataTable().destroy();
      let admin = localStorage.getItem("prexo-authentication");
      let { location } = jwt_decode(admin);
      let res = await axiosMisUser.post("/uicPageData/" + location);
      if (res.status == 200) {
        setStateOfPage("All")
        setItem(res.data.data);
        // dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelUicGenerated = async () => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      let { location } = jwt_decode(admin);
      // $("#example").DataTable().destroy();
      let obj = {
        status: "Created",
        location: location,
      };
      let res = await axiosMisUser.post("/uicGeneratedRecon", obj);
      if (res.status == 200) {
        setItem(res.data.data);
        setStateOfPage("Created")

        // dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelUicNotGenrated = async () => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      let { location } = jwt_decode(admin);
      // $("#example").DataTable().destroy();
      let obj = {
        status: "Pending",
        location: location,
      };
      let res = await axiosMisUser.post("/uicGeneratedRecon", obj);
      if (res.status == 200) {
        setItem(res.data.data);
        setStateOfPage("Pending")

      }
    } catch (error) {
      alert(error);
    }
  };
  const handelUicDownloaded = async () => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      let { location } = jwt_decode(admin);
      // $("#example").DataTable().destroy();
      let obj = {
        status: "Printed",
        location: location,
      };
      let res = await axiosMisUser.post("/uicGeneratedRecon", obj);
      if (res.status == 200) {
        setItem(res.data.data);
        setStateOfPage("Printed")
        // dataTableFun();
      }
    } catch (error) {
      alert(error);
    }
  };
  const handleOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };
  console.log(stateOfPage);
  /*****************************************SEARCH ORDERS*************************************************** */
  const searchOrders = async (e) => {
    e.preventDefault();
    let admin = localStorage.getItem("prexo-authentication");
    let { location } = jwt_decode(admin);
    try {
      if (e.target.value == "") {
        if (stateOfPage== "All") {
          handelUicAll();
        } else if (stateOfPage== "Pending") {
          handelUicNotGenrated();
        } else if (stateOfPage == "Created") {
          handelUicGenerated();
        } else {
          handelUicDownloaded();
        }
      } else if (search.type == "") {
        alert("Please add input");
      } else {
       
        if (stateOfPage =="All") {
          let obj = {
            location: location,
            type: search.type,
            searchData: e.target.value,
          };
          let res = await axiosMisUser.post("/searchUicPageAll", obj);
          setRowsPerPage(10);
          setPage(0);
          if (res.status == 200 && res.data.data?.length !== 0) {
            setItem(res.data.data);
          } else {
            alert("No data found");
          }
        } else {
          let obj = {
            location: location,
            type: search.type,
            searchData: e.target.value,
            uic_status:""
          };
          if(stateOfPage =="Pending"){
            obj.uic_status="Pending"
          }
          else if(stateOfPage=="Created"){
            obj.uic_status="Created"
          }
          else
          {
            obj.uic_status="Printed"
          }
          let res = await axiosMisUser.post("/searchUicPageAll", obj);
          setRowsPerPage(10);
          setPage(0);
          if (res.status == 200 && res.data.data?.length !== 0) {
            setItem(res.data.data);
          } else {
            alert("No data found");
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
                checked={item.length == isCheck.length ? true : false}
              />{" "}
              Select All
            </TableCell>
            <TableCell>Record.NO</TableCell>
            <TableCell>UIC Status</TableCell>
            <TableCell>UIC Generated Admin</TableCell>
            <TableCell>UIC Generated Time</TableCell>
            <TableCell>UIC Code</TableCell>
            <TableCell>UIC Downloaded Time</TableCell>
            <TableCell>Delivery Status</TableCell>
            <TableCell>Actual Delivery Date</TableCell>
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
            <TableCell>Customer Declaration Physical Defect Present</TableCell>
            <TableCell>Customer Declaration Physical Defect Type</TableCell>
            <TableCell>Partner Price No Defect</TableCell>
            <TableCell>Revised Partner Price</TableCell>
            <TableCell>Delivery Fee</TableCell>
            <TableCell>Exchange Facilitation Fee</TableCell>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((data, index) => (
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
              <TableCell>{data.id}</TableCell>
              <TableCell
                style={
                  data.uic_status == "Pending"
                    ? { color: "red" }
                    : data.uic_status == "Created"
                    ? { color: "orange" }
                    : { color: "green" }
                }
              >
                {data.uic_status}
              </TableCell>
              <TableCell>{data.uic_code?.user}</TableCell>
              <TableCell>
                {" "}
                {data.uic_code?.created_at == undefined
                  ? ""
                  : new Date(data.uic_code?.created_at).toLocaleString(
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
              <TableCell style={{ color: "green" }}>
                {data.order.delivery_status}
              </TableCell>
              <TableCell>
                {new Date(data?.delivery_date).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </TableCell>
              <TableCell>{data.order.order_id?.toString()}</TableCell>
              <TableCell>
                {data.order.order_date == null
                  ? ""
                  : new Date(data.order.order_date).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
              </TableCell>
              <TableCell>
                {data?.order.order_timestamp == null
                  ? ""
                  : new Date(data.order.order_timestamp).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )}
              </TableCell>
              <TableCell>{data.order.order_status?.toString()}</TableCell>
              {/* <TableCell>{data.buyback_category?.toString()}</TableCell> */}
              <TableCell>{data.order.partner_id?.toString()}</TableCell>
              {/* <TableCell>{data.partner_email?.toString()}</TableCell> */}
              {/* <TableCell>{data.partner_shop?.toString()}</TableCell> */}
              <TableCell>{data.order.item_id?.toString()}</TableCell>
              <TableCell>{data.order.old_item_details?.toString()}</TableCell>
              <TableCell>{data.order.imei?.toString()}</TableCell>
              {/* <TableCell>{data.gep_order?.toString()}</TableCell> */}
              <TableCell>{data.order.base_discount?.toString()}</TableCell>
              <TableCell>{data.order.diagnostic}</TableCell>
              <TableCell>{data.order.partner_purchase_price}</TableCell>
              <TableCell>{data.order.tracking_id}</TableCell>
              <TableCell>
                {" "}
                {data.order.delivery_date == undefined
                  ? ""
                  : new Date(data.order.delivery_date).toLocaleString("en-GB", {
                      hour12: true,
                    })}
              </TableCell>
              <TableCell>{data.order.order_id_replaced}</TableCell>
              <TableCell>{data.order.deliverd_with_otp}</TableCell>
              <TableCell>{data.order.deliverd_with_bag_exception}</TableCell>
              <TableCell>{data.order.gc_amount_redeemed?.toString()}</TableCell>
              <TableCell>{data.order.gc_amount_refund?.toString()}</TableCell>
              <TableCell>
                {data?.order.gc_redeem_time == null
                  ? ""
                  : new Date(data.order.gc_redeem_time).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )}
              </TableCell>
              <TableCell>
                {data.order.gc_amount_refund_time?.toString()}
              </TableCell>
              <TableCell>{data.order.diagnstic_status?.toString()}</TableCell>
              <TableCell>{data.vc_eligible?.toString()}</TableCell>
              <TableCell>
                {data.order.customer_declaration_physical_defect_present?.toString()}
              </TableCell>
              <TableCell>
                {data.order.customer_declaration_physical_defect_type?.toString()}
              </TableCell>
              <TableCell>
                {data.order.partner_price_no_defect?.toString()}
              </TableCell>
              <TableCell>
                {data.order.revised_partner_price?.toString()}
              </TableCell>
              <TableCell>{data.order.delivery_fee?.toString()}</TableCell>
              <TableCell>
                {data.order.$exchange_facilitation_fee?.toString()}
              </TableCell>
              <TableCell>{data.tracking_id?.toString()}</TableCell>
              <TableCell>{data.order_id?.toString()}</TableCell>
              {/* <TableCell>{data.delivery.order_date?.toString()}</TableCell> */}
              <TableCell>{data.item_id?.toString()}</TableCell>
              <TableCell>{data.gep_order?.toString()}</TableCell>
              <TableCell>{data.imei?.toString()}</TableCell>
              <TableCell>{data.partner_purchase_price?.toString()}</TableCell>
              <TableCell>{data.partner_shop?.toString()}</TableCell>
              <TableCell>{data.base_discount?.toString()}</TableCell>
              <TableCell>{data.diagnostics_discount?.toString()}</TableCell>
              <TableCell>{data.storage_disscount?.toString()}</TableCell>
              <TableCell>{data.buyback_category?.toString()}</TableCell>
              <TableCell>{data.doorsteps_diagnostics?.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [item, isCheck, data]);
  return (
    <>
      <Box>
        <Box
          sx={{
            mt: 9,
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
                mt: 2,
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
                label="Search"
                variant="outlined"
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "start",
              }}
            >
              <Button
                variant="contained"
                // fullWidth
                sx={{ m: 1, mt: 3 }}
                style={{ backgroundColor: "#206CE2" }}
                onClick={(e) => {
                  handelUicGen(e);
                }}
              >
                Generate UIC
              </Button>
              <Button
                variant="contained"
                // fullWidth
                sx={{ m: 1, mt: 3 }}
                style={{ backgroundColor: "#206CE2", float: "left" }}
                onClick={(e) => {
                  exportToCSV("UIC-Printing-Sheet");
                }}
              >
                Download
              </Button>

              <Button
                sx={{ m: 1, mt: 3 }}
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="contained"
                disableElevation
                // fullWidth
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
              </StyledMenu>
            </Box>
          </Box>
        </Box>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          {tabelData}
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
    </>
  );
}
