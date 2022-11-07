import React, { useEffect, useState } from "react";
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
  TablePagination,
  TableRow,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { axiosMisUser, axiosWarehouseIn } from "../../../axios";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import CloseIcon from "@mui/icons-material/Close";
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
  const [whtTray, setWhtTray] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [chargingPerson, setChargingPerson] = useState("");
  const [chargingArr, setChrgingArr] = useState([]);
  const navigate = useNavigate();
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        $("#example").DataTable().destroy();
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let response = await axiosWarehouseIn.post(
            "/wht-tray/" + "Closed/" + location
          );
          if (response.status === 200) {
            setWhtTray(response.data.data);
            dataTableFun();
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [refresh]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let res = await axiosMisUser.post(
            "/get-charging-users/" + "Charging/" + location
          );
          if (res.status == 200) {
            setChrgingArr(res.data.data);
          }
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);

  const handelViewItem = (id) => {
    navigate("/wht-tray-item/" + id);
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /***************************************SELECT CHECKBOX******************************************/
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(whtTray.map((li, index) => li.code));
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

  /***************************************CHECKBOX LABEL****************************************** */
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  /******************************************************************************************* */
  /*****************************************ASSING TO CHARGING REQUEST WILL GO TO MIS PANEL****** */
  const handelAssignToCharging = async (e) => {
    try {
      let obj = {
        tray: isCheck,
        user_name: chargingPerson,
        sort_id: "Send for charging",
      };
      let res = await axiosMisUser.post("/wht-sendTo-wharehouse", obj);
      if (res.status === 200) {
        setRefresh((refresh) => !refresh);
        alert(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      if (error.response.status == 403) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
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
                {chargingArr.map((data) => (
                  <MenuItem
                    value={data.user_name}
                    onClick={(e) => {
                      setChargingPerson(data.user_name);
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
            disabled={chargingPerson == "" ? true : false}
            component="span"
            onClick={(e) => {
              if (window.confirm("You Want to assign?")) {
                handelAssignToCharging();
              }
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: 11,
          mr: 3,
          ml: 3,
        }}
      >
        <Button
          variant="contained"
          // fullWidth
          sx={{ m: 1, mt: 3 }}
          style={{ backgroundColor: "#206CE2" }}
          onClick={(e) => {
            if (isCheck.length == 0) {
              alert("Please select atleast one tray");
            } else {
              setOpen(true);
            }
          }}
        >
          ASSIGN TO CHARGING
        </Button>
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
          <Paper sx={{ width: "100%", overflow: "auto" }}>
            <TableContainer>
              <Table
                id="example"
                style={{ width: "100%" }}
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <Checkbox
                        {...label}
                        onClick={(e) => {
                          handleSelectAll();
                        }}
                        checked={
                          whtTray.length == isCheck.length ? true : false
                        }
                      />{" "}
                      Select All
                    </TableCell>
                    <TableCell>Record.NO</TableCell>
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Tray Category</TableCell>
                    <TableCell>Tray Brand</TableCell>
                    <TableCell>Tray Model</TableCell>
                    <TableCell>Tray Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Tray Display</TableCell>
                    <TableCell>status</TableCell>
                    <TableCell>Creation Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {whtTray.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>
                        {" "}
                        <Checkbox
                          {...label}
                          onClick={(e) => {
                            handleClick(e);
                          }}
                          id={data.code}
                          key={data.code}
                          checked={isCheck.includes(data.code)}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.warehouse}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>{data.brand}</TableCell>
                      <TableCell>{data.model}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>
                        {" "}
                        {data.items.length}/{data.limit}
                      </TableCell>
                      <TableCell>{data.display}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>
                        {new Date(data.created_at).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          onClick={() => handelViewItem(data.code)}
                          style={{ backgroundColor: "green" }}
                          component="span"
                        >
                          View
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
