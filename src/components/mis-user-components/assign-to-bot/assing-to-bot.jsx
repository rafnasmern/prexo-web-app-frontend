import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  Button,
  MenuItem,
  Menu,
} from "@mui/material";
import { axiosMisUser, axiosSuperAdminPrexo } from "../../../axios";
import Swal from "sweetalert2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [infraData, setInfraData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [request, setRequest] = useState("");
  const [botName, setBotName] = useState("");
  const [botArr, setBotArr] = useState([]);
  const [clickState, setClickState] = useState(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosMisUser.post("/getStockin");
        if (res.status == 200) {
          setInfraData(res.data.data);
          dataTableFun();
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosMisUser.post("/getBot");
        if (res.status == 200) {
          setBotArr(res.data.data);
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
  const handleClick = (event, code) => {
    setRequest(code);
    setClickState(false);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //api for delete a employee
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
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelSendRequest = (botName) => {
    setBotName(botName);
    setClickState(true);
  };
  const handelSendRequestConfirm = async (e, id) => {
    try {
      let obj = {
        bagId: id,
        bot_name: botName,
      };

      let res = await axiosMisUser.post("/issueRequestSend", obj);
      if (res.status == 200) {
        alert(res.data.message);
        window.location.reload(false);
      }
    } catch (error) {
      if (error.response.status == 403) {
        alert(error.response.data.message);
        navigate("/uic-generate/" + error.response.data.bagId);
      }
     
    }
  };
  const handelUicGen = (e, bagid) => {
    e.preventDefault();
    navigate("/uic-generate/" + bagid);
  };
  return (
    <>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 13,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table
                style={{ width: "100%" }}
                id="example"
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>S.NO</TableCell>
                    <TableCell>Bag Id</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Of Closure </TableCell>
                    <TableCell>Max</TableCell>
                    <TableCell>Valid</TableCell>
                    <TableCell>Invalid</TableCell>
                    <TableCell>Duplicate</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infraData.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>
                        {new Date(data.status_change_time).toLocaleString(
                          "en-GB",
                          { hour12: true }
                        )}
                      </TableCell>
                      <TableCell>{data.limit}</TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Valid";
                          }).length
                        }
                      </TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Invalid";
                          }).length
                        }
                      </TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Duplicate";
                          }).length
                        }
                      </TableCell>
                      <TableCell>{data?.items?.length}</TableCell>
                      <TableCell>
                        {request == data.code && clickState == true ? (
                          <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: "#206CE2" }}
                            onClick={(e) => {
                              {
                                if (window.confirm("You Want to Send Request?"))
                                  handelSendRequestConfirm(e, data.code);
                              }
                            }}
                          >
                            Send Request
                          </Button>
                        ) : data.sort_id != "Requested to Warehouse" &&
                          data.sort_id != "Issued" && data.sort_id != "Closed By Bot" ? (
                          <>
                            <Button
                              variant="contained"
                              aria-controls={open ? "basic-menu" : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              onClick={(e) => {
                                handleClick(e, data.code);
                              }}
                              disabled={
                                data.sort_id == "Inprogress" ? true : false
                              }
                              endIcon={<KeyboardArrowDownIcon />}
                            >
                              Assign To BOT
                            </Button>
                            <Menu
                              id="basic-menu"
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }}
                            >
                              {botArr.map((botData) => (
                                <MenuItem
                                  onClick={(e) => {
                                    handelSendRequest(botData.user_name);
                                    handleClose();
                                  }}
                                >
                                  {botData.user_name}
                                </MenuItem>
                              ))}
                            </Menu>
                          </>
                        ) : data.sort_id != "Issued" && data.sort_id != "Closed By Bot" ? (
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "#206CE2" }}
                            // onClick={
                            //   handleSubmit(onSubmit)
                            // }
                          >
                            Requested
                          </Button>
                        ) : (
                          ""
                        )}
                        <Button
                          sx={{
                            ml: 2,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "green" }}
                          onClick={(e) => {
                            handelUicGen(e, data.code);
                          }}
                        >
                          Generate UIC
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
