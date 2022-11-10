import React, { useEffect, useState, useMemo } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  Dialog,
  TableContainer,
  TableHead,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TableRow,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";
import { axiosMisUser } from "../../../axios";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function StickyHeadTable({ props }) {
  const [infraData, setInfraData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [request, setRequest] = useState("");
  const [botName, setBotName] = useState("");
  const [bagId,setBagId]=useState("")
  const [botArr, setBotArr] = useState([]);
  const [clickState, setClickState] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/getStockin/" + location);
          if (res.status == 200) {
            setInfraData(res.data.data);
            dataTableFun();
          }
        };
        fetchData();
      }
    } catch (error) {
      alert(error);
    }
  }, []);
  useEffect(() => {
    try {
      const fetchData = async () => {
        let admin = localStorage.getItem("prexo-authentication");
        if(admin){
          let { location } = jwt_decode(admin);
          let res = await axiosMisUser.post("/getBot/" + location);
          if (res.status == 200) {
            setBotArr(res.data.data);
          }
        }
        else{
          navigate('/')
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
  // const handleClick = (event, code) => {
  //   setRequest(code);
  //   setClickState(false);
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClose = () => {
    setOpen(false)
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelClickOpen = (bagid) => {
    setBagId(bagid)
    setOpen(true)
  };
  const handelSendRequestConfirm = async () => {
    try {
      let obj = {
        bagId: bagId,
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
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="xs"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Please select user
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              p: 1,
              m: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Select user
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Cpc"
                fullWidth
                sx={{ mt: 2 }}
              >
                {botArr.map((data) => (
                  <MenuItem
                    value={data.user_name}
                    onClick={(e) => {
                      setBotName(data.user_name);
                    }}
                  >
                    {data.user_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              ml: 2,
            }}
            fullwidth
            variant="contained"
            style={{ backgroundColor: "green" }}
            disabled={botName == "" ? true : false}
            component="span"
            onClick={(e) => {
              if (window.confirm("You Want to assign?")) {
                handelSendRequestConfirm();
              }
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </BootstrapDialog>
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
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={data._id}
                    >
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
                        {
                        // request == data.code && clickState == true ? (
                        //   <Button
                        //     type="submit"
                        //     variant="contained"
                        //     style={{ backgroundColor: "#206CE2" }}
                        //     onClick={(e) => {
                        //       {
                        //         if (window.confirm("You Want to Send Request?"))
                        //           handelSendRequestConfirm(e, data.code);
                        //       }
                        //     }}
                        //   >
                        //     Send Request
                        //   </Button>
                        // ) : 
                        data.sort_id != "Requested to Warehouse" &&
                          data.sort_id != "Issued" &&
                          data.sort_id != "Closed By Bot" ? (
                          <>
                            <Button
                              variant="contained"
                              // aria-controls={open ? "basic-menu" : undefined}
                              // aria-haspopup="true"
                              // aria-expanded={open ? "true" : undefined}
                              // onClick={(e) => {
                              //   handleClick(e, data.code);
                              // }}
                              disabled={
                                data.sort_id == "In Progress" ? true : false
                              }
                              // endIcon={<KeyboardArrowDownIcon />}
                              onClick={(e)=>{ handelClickOpen(data.code)}}
                            >
                              Assign To BOT
                            </Button>
                            {/* <Menu
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
                            </Menu> */}
                          </>
                        ) : data.sort_id != "Issued" &&
                          data.sort_id != "Closed By Bot" ? (
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
