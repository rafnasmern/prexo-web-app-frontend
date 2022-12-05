import React, { useEffect, useState, useMemo } from "react";
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
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { axiosMisUser, axiosWarehouseIn } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

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
export default function StickyHeadTable({ props }) {
  const [whtTray, setWhtTray] = useState([]);
  const [sortingAgent, setSortingAgent] = useState([]);
  const [toWhtTray, setToWhatTray] = useState([]);
  const [open, setOpen] = useState(false);
  const [mergreData, setMergeData] = useState({
    fromTray: "",
    toTray: "",
    sort_agent: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  /******************************************************************************* */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          setLoading(false);
          let { location } = jwt_decode(admin);
          let response = await axiosWarehouseIn.post(
            "/wht-tray/" + "wht-merge/" + location
          );
          if (response.status === 200) {
            setWhtTray(response.data.data);
            setLoading(true);
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
  /* OPEN DIALOG BOX */
  const handelMerge = async (e, model, brand, trayId, itemCount) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const { location } = jwt_decode(token);
        let obj = {
          location: location,
          model: model,
          brand: brand,
          fromTray: trayId,
          itemCount: itemCount,
        };
        let res = await axiosMisUser.post("/toWhtTrayForMerge", obj);
        if (res.status === 200) {
          setOpen(true);
          setToWhatTray(res.data.data);
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
  const handleClose = () => {
    setOpen(false);
  };
  /******************************************************************************* */
  const handelViewItem = (id) => {
    navigate("/wht-tray-item/" + id);
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
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
  const tableData = useMemo(() => {
    return (
      <TableContainer>
        <Table id="example" style={{ width: "100%" }} aria-label="sticky table">
          <TableHead>
            <TableRow>
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
                <TableCell>{index + 1}</TableCell>
                <TableCell>{data.code}</TableCell>
                <TableCell>{data.warehouse}</TableCell>
                <TableCell>{data.type_taxanomy}</TableCell>
                <TableCell>{data.brand}</TableCell>
                <TableCell>{data.model}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>
                  {" "}
                  {data.items.length == 0
                    ? data.actual_items.length
                    : data.items.length}
                  /{data.limit}
                </TableCell>
                <TableCell>{data.display}</TableCell>
                <TableCell>{data.sort_id}</TableCell>
                <TableCell>
                  {new Date(data.created_at).toLocaleString("en-GB", {
                    hour12: true,
                  })}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handelViewItem(data.code)}
                      style={{ backgroundColor: "#206CE2" }}
                      component="span"
                    >
                      View
                    </Button>
                    <Button
                      sx={{ mt: 1 }}
                      type="submit"
                      variant="contained"
                      style={{ backgroundColor: "green" }}
                      onClick={(e) => {
                        handelMerge(
                          e,
                          data.model,
                          data.brand,
                          data.code,
                          data.items.length
                        );
                      }}
                    >
                      Merge
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [whtTray]);
  /******************************************************************************* */
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
              {toWhtTray.map((data) => (
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
            disabled={mergreData.sort_agent === "" || mergreData.toTray === ""}
            style={{ backgroundColor: "green" }}
            onClick={(e) => {
              handelSendRequest(e);
            }}
          >
            SUBMIT
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          top: { sm: 60, xs: 20 },
          left: { sm: 250 },
          m: 3,
          mt: 15,
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
          <Paper sx={{ width: "100%", overflow: "auto", mb: 2 }}>
            {tableData}
          </Paper>
        )}
      </Box>
    </>
  );
}
