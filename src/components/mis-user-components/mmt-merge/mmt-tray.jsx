import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import { axiosMisUser } from "../../../axios";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
/*********************************************************** */
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

export default function MmtMerge() {
  const [mmtTray, setMmtTray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sortingAgent, setSortingAgent] = useState([]);
  const [toMmtTray, setToMmtTray] = useState([]);
  const [mergreData, setMergeData] = useState({
    fromTray: "",
    toTray: "",
    sort_agent: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        setLoading(false);
        const { location } = jwt_decode(token);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/getClosedMmtTray/" + location);
          if (res.status == 200) {
            setMmtTray(res.data.data);
            setLoading(true);
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
  useEffect(() => {
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const { location } = jwt_decode(token);
        const fetchData = async () => {
          let res = await axiosMisUser.post(
            "/getSortingAgentMergeMmt/" + location
          );
          if (res.status === 200) {
            setSortingAgent(res.data.data);
          }
        };
        fetchData();
      }
    } catch (error) {
      if (error.response.status === 403) {
        alert(error.response.data.message);
      }
    }
  }, []);

  //api for delete a employee

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
  const handleClose = () => {
    setOpen(false);
  };
  /* OPEN DIALOG BOX */
  const handelMerge = async (e, trayId, itemsCount) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const { location } = jwt_decode(token);
        let res = await axiosMisUser.post(
          "/toMmtTrayForMerge/" + trayId + "/" + location + "/" + itemsCount
        );
        if (res.status === 200) {
          setOpen(true);
          setToMmtTray(res.data.data);
        }
        setMergeData((p) => ({ ...p, fromTray: trayId }));
      }
    } catch (error) {
      if (error.response.status == 403) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };
  /* REQUEST SEND TO WAREHOUSE */
  const handelSendRequest = async (e) => {
    e.preventDefault();
    try {
      let res = await axiosMisUser.post("/TrayMergeRequestSend", mergreData);
      if (res.status === 200) {
        alert(res.data.message);
        window.location.reload(false);
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
          Tray Merge
        </BootstrapDialogTitle>

        <DialogContent dividers>
          <FormControl fullWidth>
            <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
              To MMT Tray
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Cpc"
              fullWidth
              sx={{ mt: 2 }}
            >
              {toMmtTray.map((data) => (
                <MenuItem
                  onClick={(e) => {
                    setMergeData((p) => ({ ...p, toTray: data.code }));
                  }}
                  value={data.code}
                >
                  {data.code} - ({data.items.length})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
              Sorting Agent
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Cpc"
              fullWidth
              sx={{ mt: 2 }}
            >
              {sortingAgent.map((data) => (
                <MenuItem
                  onClick={(e) => {
                    setMergeData((p) => ({ ...p, sort_agent: data.user_name }));
                  }}
                  value={data.user_name}
                >
                  {data.user_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            disabled={
              mergreData.sort_agent === "" || mergreData.toTray === ""
            }
            style={{ backgroundColor: "green" }}
            onClick={(e) => {
              handelSendRequest(e);
            }}
          >
            SUBMIT
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
            mb: 2,
          }}
        >
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
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer>
                <Table
                  style={{ width: "100%" }}
                  id="example"
                  P
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
                      <TableCell>Closed Time Warehouse</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mmtTray.map((data, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{data.code}</TableCell>
                        <TableCell>
                          {data.items.length + "/" + data.limit}
                        </TableCell>
                        <TableCell>{data.type_taxanomy}</TableCell>
                        <TableCell>{data.sort_id}</TableCell>
                        <TableCell>
                          {new Date(data.closed_time_wharehouse).toLocaleString(
                            "en-GB",
                            { hour12: true }
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            sx={{ m: 1 }}
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: "#206CE2" }}
                            onClick={(e) => {
                              handelViewTray(e, data.code);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            sx={{ m: 1 }}
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: "green" }}
                            onClick={(e) => {
                              handelMerge(e, data.code, data.items.length);
                            }}
                          >
                            Merge
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </Box>
    </>
  );
}
