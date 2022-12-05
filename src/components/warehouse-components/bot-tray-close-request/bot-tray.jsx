import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
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
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

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
  const [bot, setBot] = useState([]);
  const [trayId, setTrayId] = useState("");
  const [counts, setCounts] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let botTray = await axiosWarehouseIn.post(
            "/closeBotTray/" + location
          );
          if (botTray.status == 200) {
            setBot(botTray.data.data);
            dataTableFun2();
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
  function dataTableFun2() {
    $("#example2").DataTable({
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
  const handelViewSummery = (e, id) => {
    e.preventDefault();
    navigate("/summery-bot-bag/" + id);
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  // HANDEL RECEIVED TRY
  const handelTrayReceived = async () => {
    setLoading(true);
    try {
      let obj = {
        trayId: trayId,
        count: counts,
      };
      let res = await axiosWarehouseIn.post("/receivedTray", obj);
      if (res.status == 200) {
        setLoading(false);
        alert(res.data.message);
        setOpen(false);
        window.location.reload(false);
      }
    } catch (error) {
      if (error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
      setLoading(false);
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
          Please verify the count of - {trayId}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TextField
            label="Enter Item Count"
            variant="outlined"
            onChange={(e) => {
              setCounts(e.target.value);
            }}
            inputProps={{ maxLength: 3 }}
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              m: 1,
            }}
            variant="contained"
            disabled={counts === "" ? true : false}
            style={{ backgroundColor: "green" }}
            onClick={(e) => {
              handelTrayReceived(e);
            }}
          >
            RECEIVED
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
        {/* <Box sx={{ m: 3 }}>
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
        </Box> */}
      </Box>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 8,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table
                style={{ width: "100%" }}
                id="example2"
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>S.NO</TableCell>
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Bag Id</TableCell>
                    <TableCell>Tray Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    <TableCell>Closed Date</TableCell>
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bot.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data?.items?.[0]?.bag_id}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>
                        {" "}
                        {new Date(data.status_change_time).toLocaleString(
                          "en-GB",
                          { hour12: true }
                        )}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {new Date(data.closed_time_bot).toLocaleString(
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
                          style={{ backgroundColor: "#21b6ae" }}
                          onClick={(e) => {
                            handelViewSummery(e, data?.items?.[0]?.bag_id);
                          }}
                        >
                          Summery
                        </Button>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          disabled={data.sort_id === "Closed By Bot"}
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
                            disabled={loading}
                            variant="contained"
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
