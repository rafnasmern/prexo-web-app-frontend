import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";

import {
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Box,
  Button,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { axiosMisUser } from "../../../axios";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
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

export default function CustomizedMenus(props) {
  const [item, setItem] = useState({});
  const navigate = useNavigate();
  const [sortingAgent, setSortingAgent] = useState([]);
  const [sortingAgentName, setSortingAgentName] = useState("");
  const [open, setOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const { state } = useLocation();
  const { isCheck, type } = state;
  /******************************************************************************* */
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const { location } = jwt_decode(admin);
      const fetchData = async () => {
        try {
          let obj = {
            trayData: isCheck,
          };
          let res = await axiosMisUser.post("/assign-for-sorting", obj);
          if (res.status == 200) {
            setItem(res.data.data);
            dataTableFun();
          }
        } catch (error) {
          alert(error);
        }
      };
      fetchData();
    } else {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    // if (item.length !== 0) {
    //   for (let x of item) {
    //     for (let y of x.items) {
    //       if (x.wht_tray == null) {
    //       }
    //     }
    //   }
    //   // if (a == b) {
    //   //   setSortingButtonDis(false);
    //   // }
    // }
  }, [item]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let res = await axiosMisUser.post("/getSortingAgent/" + location);
          if (res.status == 200) {
            setSortingAgent(res.data.data);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);
  /********************************************************************************************** */
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSortingAgentName("");
  };
  /******************************PICK LIST VIEW DETAIL**************************************** */
  const handelViewDetailClub = (e, muic) => {
    e.preventDefault();
    navigate("/view-club-item-bot", {
      state: { isCheck: isCheck, muic: muic },
    });
  };
  const handelAssignWht = (e, muic) => {
    navigate("/bot-club-to-wht-assignment", {
      state: { isCheck: isCheck, muic: muic },
    });
  };
  /*********************************************TRAY ASSIGNE TO SORTING AGENT************************************************** */
  const handelSendRequestConfirm = async () => {
    try {
      setAssignLoading(true);
      let obj = {
        agent_name: sortingAgentName,
        trayId: isCheck,
      };
      let res = await axiosMisUser.post("/assign-to-sorting-agent", obj);
      if (res.status === 200) {
        setAssignLoading(false);
        alert(res.data.message);
        navigate("/bot-to-wht");
      }
    } catch (error) {
      alert(error);
    }
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
                {sortingAgent.map((data) => (
                  <MenuItem
                    value={data.user_name}
                    onClick={(e) => {
                      setSortingAgentName(data.user_name);
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
            disabled={
              sortingAgentName == "" || assignLoading == true ? true : false
            }
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
      <div
        style={{
          marginTop: "100px",
          marginLeft: "20px",
          marginRight: "20px",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
            float: "left",
            mb: 2,
          }}
        >
          <h6>BOT Tray - {isCheck.toString()}</h6>
        </Box>
        {type == "Not From Request" ? (
          <Box
            sx={{
              float: "right",
              mb: 2,
            }}
          >
            <Button
              sx={{
                mb: 1,
              }}
              variant="contained"
              style={{ backgroundColor: "green" }}
              component="span"
              disabled={item.not_assigned}
              onClick={(e) => {
                handelClickOpen();
              }}
            >
              Select Sorting Agent
            </Button>
          </Box>
        ) : null}

        <Paper sx={{ width: "100%", overflow: "hidden", mt: 8 }}>
          <TableContainer>
            <Table
              id="example"
              style={{ width: "100%" }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Record.NO</TableCell>
                  <TableCell>MUIC</TableCell>
                  <TableCell>Brand Name</TableCell>
                  <TableCell>Model Name</TableCell>
                  <TableCell>IN BOT</TableCell>
                  {/* <TableCell>In WHT</TableCell> */}
                  {/* <TableCell>IN Picklist</TableCell> */}
                  <TableCell>WHT Tray</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {item?.temp_array?.map((data, index) => (
                  <TableRow tabIndex={-1}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{data.muic}</TableCell>
                    <TableCell>{data.brand}</TableCell>
                    <TableCell>{data.model}</TableCell>
                    <TableCell>{data.item.length}</TableCell>
                    <TableCell>{data?.wht_tray?.join(', ')}</TableCell>
                    <TableCell>
                      <Button
                        sx={{
                          m: 1,
                        }}
                        variant="contained"
                        style={{ backgroundColor: "#206CE2" }}
                        onClick={(e) => {
                          handelViewDetailClub(e, data.muic);
                        }}
                      >
                        View Item
                      </Button>
                      {type == "Not From Request" ? (
                        <Button
                          sx={{
                            m: 1,
                          }}
                          disabled={data.dis_tray_assign}
                          variant="contained"
                          style={{ backgroundColor: "green" }}
                          onClick={(e) => {
                            handelAssignWht(e, data.muic);
                          }}
                        >
                          {data.item.length == data.assigned_count
                            ? "Tray Assigned"
                            : " Assign Tray"}
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </>
  );
}
