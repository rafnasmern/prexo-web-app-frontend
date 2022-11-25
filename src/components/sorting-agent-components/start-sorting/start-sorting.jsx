import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import "yup-phone";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { axiosSortingAgent } from "../../../axios";
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

export default function DialogBox() {
  const navigate = useNavigate();
  const [tray, setTray] = useState([]);
  const { trayId } = useParams();
  /**************************************************************************** */
  const [awbn, setAwbn] = useState("");
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  /*********************************************************** */

  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { user_name } = jwt_decode(admin);
          let response = await axiosSortingAgent.post(
            "/get-data-for-start-sorting/" + user_name + "/" + trayId
          );
          if (response.status === 200) {
            setTray(response.data.data);
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
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setAwbn("");
  };

  const handelAwbn = async (e) => {
    if (e.target.value.length === 11) {
      try {
        let obj = {
          uic: e.target.value,
          trayId: trayId,
          wht_tray: tray?.wht,
        };
        let res = await axiosSortingAgent.post("/cheack-uic-for-sorting", obj);
        if (res?.status === 200) {
          setItemDetails(res.data.data);
          setOpen(true);
        }
      } catch (error) {
        setAwbn("");
        if (error.response.status === 403) {
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      }
    }
  };
  /************************************************************************** */
  const addActualitem = async (e) => {
    try {
      if (e.keyCode === 32) {
      } else {
        setLoading(true);
        let res = await axiosSortingAgent.post(
          "/item-move-to-wht",
          itemDetails
        );
        if (res?.status === 200) {
          setRefresh((refresh) => !refresh);
          setAwbn("");
          handleClose();
          setLoading(false);
        }
      }
    } catch (error) {
      if (error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };
  /************************************************************************** */
  const handelIssue = async (e, trayId) => {
    e.preventDefault();
    try {
      if (description == "") {
        alert("Please Add Description");
      } else {
        setLoading2(true);
        let obj = {
          wht: tray?.wht,
          trayId: trayId,
        };
        let res = await axiosSortingAgent.post(
          "/bot-and-wht-send-to-warehouse",
          obj
        );
        if (res.status === 200) {
          alert(res.data.message);
          setLoading2(false);
          navigate("/view-assigned-sorting-requests");
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelViewItem = (e, code) => {
    e.preventDefault();
    navigate("/wht-tray-item/" + code);
  };

  /***************************************************************************************** */
  return (
    <>
      <BootstrapDialog aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          width="600px"
        >
          You are moving
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
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <h5>MUIC:-{itemDetails?.muic}</h5>
                <h5>UIC:-{itemDetails?.uic}</h5>
                <h5>From:-{itemDetails?.tray_id}</h5>
              </Grid>
              <Grid item xs={6}>
                <h5>Model Name:-{itemDetails?.model}</h5>
                <h5>Brand Name:-{itemDetails?.brand}</h5>
                <h5>To:-{itemDetails?.wht_tray}</h5>
              </Grid>
            </Grid>
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
            disabled={loading}
            component="span"
            onClick={(e) => {
              addActualitem(e);
            }}
          >
            YES
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          mt: 11,
          height: 70,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            float: "left",
          }}
        >
          <h6 style={{ marginLeft: "13px" }}>BOT Tray Id - {trayId}</h6>
        </Box>
        <Box
          sx={{
            float: "right",
          }}
        >
          <h6 style={{ marginRight: "13px" }}>
            Assigned Date --{" "}
            {new Date(tray?.bot?.status_change_time).toLocaleString("en-GB", {
              hour12: true,
            })}
          </h6>
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Paper sx={{ width: "95%", overflow: "hidden", m: 1 }}>
            <h6>BOT TRAY ITEM</h6>

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
                    <TableCell>UIC</TableCell>
                    <TableCell>IMEI</TableCell>
                    <TableCell>MUIC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tray?.bot?.actual_items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.uic}</TableCell>
                      <TableCell>{data?.imei}</TableCell>
                      <TableCell>{data?.muic}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
            <h6>WHT TRAY</h6>
            <TextField
              sx={{ m: 1 }}
              id="outlined-password-input"
              type="text"
              name="doorsteps_diagnostics"
              label="Please Enter UIC"
              value={awbn}
              // onChange={(e) => setAwbn(e.target.value)}
              onChange={(e) => {
                setAwbn(e.target.value);
                handelAwbn(e);
              }}
              inputProps={{
                style: {
                  width: "auto",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Box
                sx={{
                  m: 2,
                }}
              >
                {/* <Box sx={{}}>
                  <h5>Total</h5>
                  <p style={{ marginLeft: "5px", fontSize: "24px" }}>
                    {tray?.whtactual?.length}/{picklist?.items?.length}
                  </p>
                </Box> */}
              </Box>
              {/* <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Valid</h5>
                  <p style={{ marginLeft: "19px", fontSize: "24px" }}>
                    {
                      picklist?.actual?.filter(function (item) {
                        return item.item_status == "Valid";
                      }).length
                    }
                  </p>
                </Box>
              </Box> */}
              {/* <Box
                sx={{
                  m: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Invalid</h5>
                  <p style={{ marginLeft: "25px", fontSize: "24px" }}>
                    {
                      picklist?.actual?.filter(function (item) {
                        return item.item_status == "Invalid";
                      }).length
                    }
                  </p>
                </Box>
              </Box>{" "} */}
            </Box>
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
                    <TableCell>WHT TRay ID</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tray?.wht?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.code}</TableCell>
                      <TableCell>{data?.brand}</TableCell>
                      <TableCell>{data?.model}</TableCell>
                      <TableCell>
                        {data?.items.length}/{data.limit}
                      </TableCell>

                      <TableCell>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          onClick={(e) => handelViewItem(e, data.code)}
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
        </Grid>
      </Grid>
      <div style={{ float: "right" }}>
        <Box sx={{ float: "right" }}>
          <textarea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            style={{ width: "400px" }}
            placeholder="Description"
          ></textarea>

          <Button
            sx={{ m: 3, mb: 9 }}
            variant="contained"
            disabled={
              tray?.bot?.actual_items?.length !== 0
                ? true
                : loading2 == true
                ? true
                : false
            }
            style={{ backgroundColor: "green" }}
            onClick={(e) => {
              handelIssue(e, trayId);
            }}
          >
            Close BOT Tray
          </Button>
        </Box>
      </div>
    </>
  );
}
