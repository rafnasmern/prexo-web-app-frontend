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
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
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
  const [mmtTray, setMmtTray] = useState([]);
  const [receiveCheck, setReceiveCheck] = useState("");
  const [trayId, setTrayId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchData = async () => {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let res = await axiosWarehouseIn.post(
            "/returnFromMerging/" + location
          );
          if (res.status == 200) {
            setMmtTray(res.data.data);
            dataTableFun();
          }
        } else {
          navigate("/");
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
  const handleClose = () => {
    setOpen(false);
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
    navigate("/return-from-mmt-merge-close/" + id);
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  // HANDEL RECEIVED TRY
  const handelTrayReceived = async () => {
    if (receiveCheck === "") {
      alert("Please confirm counts");
    } else {
      try {
        let obj = {
          trayId: trayId,
          check: receiveCheck,
          type: "Merging Done",
        };
        let res = await axiosWarehouseIn.post("/receivedTray", obj);
        if (res.status == 200) {
          alert(res.data.message);
          setOpen(false);
          window.location.reload(false);
        }
      } catch (error) {
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
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Tray Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Merge Done Date</TableCell>
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mmtTray.map((data, index) => (
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
                        {new Date(data.closed_time_sorting_agent).toLocaleString(
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
                        {data.sort_id != "Received From Merging" ? (
                          <Button
                            sx={{
                              m: 1,
                            }}
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
