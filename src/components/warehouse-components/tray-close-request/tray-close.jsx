import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
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
  const [open, setOpen] = React.useState(false);
  const [assingNewTray, setAssignNewTray] = useState(false);
  const [infraData, setInfraData] = useState([]);
  const [receiveCheck, setReceiveCheck] = useState("");
  const [botUsers, setBotUsers] = useState([]);
  const [trayId, setTrayId] = useState("");
  const [userTray, setUserTray] = useState("");
  const [trayStatus, setTrayStatus] = useState("");
  const [trayIdCheck, setTrayIdCheck] = useState("");
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [laodingRecieved, setLoadinRecieved] = useState(false);
  const navigate = useNavigate();
  // YUP SCHEMA
  const schema = Yup.object().shape({
    user_name: Yup.string().required("Required*").nullable(),
    tray_type: Yup.string().required("Required*").nullable(),
    tray_Id: Yup.string().required("Required*").nullable(),
  });
  // ON SUBMIT FOR ASSIGN NEW TRAY
  const onSubmit = async (values) => {
    try {
      setLoadingAssign(true);
      let res = await axiosWarehouseIn.post("/assignNewTray", values);
      if (res.status === 200) {
        setLoadingAssign(false);
        alert(res.data.message);
        setAssignNewTray(false);
        setUserTray("");
        setTrayStatus("");
      }
    } catch (error) {
      if (error.response.status == 403) {
        alert(error.response.data.message);
      }
    }
  };
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handelOpen = async () => {
    try {
      let res = await axiosWarehouseIn.post("/botUsers");
      if (res.status == 200) {
        setAssignNewTray(true);
        setBotUsers(res.data.data);
      }
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosWarehouseIn.post(
            "/trayCloseRequest/" + location
          );
          if (res.status == 200) {
            setInfraData(res.data.data);
            dataTableFun();
          }
        };
        fetchData();
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error);
    }
  }, []);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAssignNewTray = () => {
    setAssignNewTray(false);
    reset({
      tray_Id: "",
      tray_type: "",
      user_name: "",
    });
    setUserTray("");
    setTrayStatus("");
  };

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelViewTray = (e, id) => {
    e.preventDefault();
    navigate("/tray-details/" + id);
  };
  const handelViewDetailTray = (e, id) => {
    e.preventDefault();
    navigate("/tray-view-detail/" + id);
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  // HANDEL RECEIVED TRY
  const handelTrayReceived = async () => {
    if (receiveCheck === "") {
      alert("Please confirm counts");
    } else {
      setLoadinRecieved(true);
      try {
        let obj = {
          trayId: trayId,
          check: receiveCheck,
        };
        let res = await axiosWarehouseIn.post("/receivedTray", obj);
        if (res.status == 200) {
          setLoadinRecieved(false);
          alert(res.data.message);
          setOpen(false);
          window.location.reload(false);
        }
      } catch (error) {
        setLoadinRecieved(false);
        alert(error);
      }
    }
  };
  // CHECK TRAY
  const handelBotTrayCheck = async (username, trayType) => {
    if (username === "") {
      alert("Please select user");
      reset({
        user_name: null,
      });
    } else {
      try {
        setUserTray("");
        let obj = {
          username: username,
          trayType: trayType,
        };
        let res = await axiosWarehouseIn.post("/checkBotUserTray", obj);
        if (res.status === 200) {
        }
      } catch (error) {
        if (error.response.status == 403) {
          setUserTray(error.response.data.message);
        }
      }
    }
  };
  const handelTrayId = async (e) => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        if (getValues("user_name") === "" || getValues("tray_type") === "") {
          alert("Please select user and tray type");
        } else if (trayIdCheck == "") {
          alert("Please add tray id");
        } else {
          if (getValues("tray_type") == "MMT") {
            let res = await axiosWarehouseIn.post(
              "/checkMmtTray/" + trayIdCheck + "/" + location
            );
            if (res.status == 200) {
              setTrayStatus(res.data.status);
            }
          } else if (getValues("tray_type") == "PMT") {
            let res = await axiosWarehouseIn.post(
              "/checkPmtTray/" + trayIdCheck + "/" + location
            );
            if (res.status == 200) {
              setTrayStatus(res.data.status);
            }
          } else {
            let res = await axiosWarehouseIn.post(
              "/checkBotTray/" + trayIdCheck + "/" + location
            );
            if (res.status == 200) {
              setTrayStatus(res.data.status);
            }
          }
        }
      }
    } catch (error) {
      alert(error.response.data.message);
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
          RECEIVED
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <h6>
            {" "}
            <Checkbox
              onClick={(e) => {
                receiveCheck == ""
                  ? setReceiveCheck("I have validated the counts")
                  : receiveCheck("");
              }}
              {...label}
              sx={{ ml: 3 }}
            />
            I have validated the counts
          </h6>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              m: 1,
            }}
            variant="contained"
            style={{ backgroundColor: "green" }}
            onClick={(e) => {
              handelTrayReceived(e);
            }}
          >
            RECEIVED
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={assingNewTray}
        fullWidth
        maxWidth="xs"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseAssignNewTray}
        >
          Assign new tray
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
              Bot users
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              fullWidth
              label="User Type"
              onChange={(e) => {
                reset({ tray_type: null });
              }}
              {...register("user_name")}
              error={errors.user_name ? true : false}
              helperText={errors.user_name?.message}
              sx={{ mt: 2 }}
            >
              {botUsers.map((data) => (
                <MenuItem value={data.user_name}>{data.user_name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
              Tray Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              fullWidth
              label="User Type"
              {...register("tray_type")}
              error={errors.tray_type ? true : false}
              helperText={errors.tray_type?.message}
              sx={{ mt: 2 }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem
                onClick={(e) =>
                  handelBotTrayCheck(getValues("user_name"), "BOT")
                }
                value="BOT"
              >
                BOT
              </MenuItem>
              <MenuItem
                onClick={(e) =>
                  handelBotTrayCheck(getValues("user_name"), "PMT")
                }
                value="PMT"
              >
                PMT
              </MenuItem>
              <MenuItem
                onClick={(e) =>
                  handelBotTrayCheck(getValues("user_name"), "MMT")
                }
                value="MMT"
              >
                MMT
              </MenuItem>
              <MenuItem
                onClick={(e) =>
                  handelBotTrayCheck(getValues("user_name"), "WHT")
                }
                value="WHT"
              >
                WHT
              </MenuItem>
            </Select>
          </FormControl>

          {userTray != "" ? (
            <h6 style={{ marginTop: "4px", color: "red" }}>{userTray}</h6>
          ) : (
            ""
          )}

          <TextField
            label="Tray Id"
            variant="outlined"
            fullWidth
            {...register("tray_Id")}
            error={errors.tray_Id ? true : false}
            helperText={errors.tray_Id ? errors.tray_Id.message : ""}
            onChange={(e) => setTrayIdCheck(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton
                    onClick={(e) => {
                      handelTrayId(e);
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 2 }}
          />
          {trayStatus !== "" ? (
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Tray Status"
              variant="standard"
              fullWidth
              value={trayStatus}
              sx={{ mt: 2 }}
            />
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              m: 1,
            }}
            disabled={
              trayStatus !== "Open" || userTray !== ""
                ? true
                : false || loadingAssign == true
                ? true
                : false
            }
            variant="contained"
            style={{ backgroundColor: "green" }}
            onClick={handleSubmit(onSubmit)}
          >
            Assign
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: 4,
          mr: 1,
          ml: 3,
        }}
      >
        <Box sx={{ m: 3 }}>
          <Button
            variant="contained"
            sx={{ mt: 5 }}
            style={{ backgroundColor: "#206CE2", float: "left" }}
            onClick={(e) => {
              handelOpen();
            }}
          >
            Assign new tray
          </Button>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 1,
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
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Tray Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infraData.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>
                        {data?.items?.length + "/" + data.limit}
                      </TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>
                        {" "}
                        {new Date(data.status_change_time).toLocaleString(
                          "en-GB",
                          { hour12: true }
                        )}
                      </TableCell>
                      <TableCell>{data.issued_user_name}</TableCell>
                      <TableCell>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "#206CE2" }}
                          onClick={(e) => {
                            handelViewTray(e, data.code);
                          }}
                        >
                          View
                        </Button>
                        {data.sort_id != "Received From BOT" ? (
                          <Button
                            sx={{
                              m: 1,
                            }}
                            variant="contained"
                            disabled={laodingRecieved}
                            style={{ backgroundColor: "green" }}
                            onClick={(e) => {
                              setOpen(true);
                              setTrayId(data.code);
                            }}
                          >
                            RECEIVED
                          </Button>
                        ) : (
                          <Button
                            sx={{
                              m: 1,
                            }}
                            variant="contained"
                            style={{ backgroundColor: "red" }}
                            onClick={(e) => {
                              handelViewDetailTray(e, data.code);
                            }}
                          >
                            Close
                          </Button>
                        )}
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
