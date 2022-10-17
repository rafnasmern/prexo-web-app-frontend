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
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { axiosWarehouseIn } from "../../../axios";
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
  const [editCall, setEditCall] = useState(false);
  const navigate = useNavigate();
  const [picklist, setPicklist] = useState([]);
  const { picklistId } = useParams();
  /**************************************************************************** */
  const [awbn, setAwbn] = useState("");
  const [awbnSuccess, setAwbnSuccess] = useState(false);
  const [uic, setUic] = useState(false);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  /*********************************************************** */

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post(
          "/getPickList/" + picklistId
        );
        if (response.status === 200) {
          setPicklist(response.data.data);
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);
  const handleClose = () => {
    setOpen(false);
  };

  const getitem = async () => {
    try {
      let response = await axiosWarehouseIn.post("/getPickList/" + picklistId);
      if (response.status === 200) {
        setPicklist(response.data.data);
        handleClose();
        //   dataTableFun()
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelAwbn = async (e) => {
    if (e.target.value.length === 11) {
      try {
        let obj = {
          uic: e.target.value,
          pickListId: picklistId,
        };
        let res = await axiosWarehouseIn.post("/actualPickList", obj);
        if (res?.status == 200) {
          setItemDetails(
            picklist.items?.filter(function (item) {
              return item.uic == res.data.data;
            })
          );
          setOpen(true);
        }
      } catch (error) {
        setAwbn("");
        setAwbnSuccess(false);
        if (error.response.status == 403) {
          alert(error.response.data.message);
        } else if (error.response.status == 400) {
          alert("This Item Does Not Exist In This Picklist");
        } else {
          alert(error);
        }
      }
    }
  };
  /************************************************************************** */
  const addActualitem = async () => {
    let data = picklist.items?.filter(function (item) {
      return item.uic == awbn;
    });
    data[0].item_status = "Valid";
    try {
      let obj = {
        picklist_id: picklistId,
        items: data[0],
      };
      let res = await axiosWarehouseIn.post("/add-actual-picklist-item", obj);
      if (res?.status == 200) {
        setAwbn("");
        getitem();
      }
    } catch (error) {
      alert(error);
    }
  };

  /************************************************************************** */
  const handelIssue = async (e, picklistId) => {
    e.preventDefault();
    try {
      if (description == "") {
        alert("Please Add Description");
      } else if (picklist?.actual?.length == picklist?.items?.length) {
        let res = await axiosWarehouseIn.post("/close-pick-list/" + picklistId);
        if (res.status == 200) {
          alert(res.data.message);
          navigate("/picklist-request");
        }
      } else {
        alert("Please Verify Actual Data");
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelDelete = async (id) => {
    try {
      let obj = {
        picklistId: picklistId,
        id: id,
      };
      let data = await axiosWarehouseIn.put("/remove-actual-picklist", obj);
      if (data.status == 200) {
        alert(data.data.message);
        getitem();
      }
    } catch (error) {
      alert(error);
    }
  };
  /***************************************************************************************** */
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <>
      <BootstrapDialog aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
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
                <h5>MUIC:-{itemDetails[0]?.muic}</h5>
                <h5>UIC:-{itemDetails[0]?.uic}</h5>
                <h5>From:-{itemDetails[0]?.tray_id}</h5>
              </Grid>
              <Grid item xs={6}>
                <h5>Model Name:-{itemDetails[0]?.model_name}</h5>
                <h5>Brand Name:-{itemDetails[0]?.brand_name}</h5>
                <h5>To:-{itemDetails[0]?.wht_tray}</h5>
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
            component="span"
            onClick={(e) => {
              if (window.confirm("You Want to move?")) {
                addActualitem();
              }
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
          <h6 style={{ marginLeft: "13px" }}>Picklist ID - {picklistId}</h6>
          <h6 style={{ marginLeft: "13px" }}>
            Created By - {picklist.created_user_name}
          </h6>
        </Box>
        <Box
          sx={{
            float: "right",
          }}
        >
          <h6 style={{ marginRight: "13px" }}>
            Created At --{" "}
            {new Date(picklist.created_at).toLocaleString("en-GB", {
              hour12: true,
            })}
          </h6>
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Paper sx={{ width: "95%", overflow: "hidden", m: 1 }}>
            <h6>Expected</h6>

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
                    <TableCell>BOT Tray ID</TableCell>
                    <TableCell>WHT TRay ID</TableCell>
                    <TableCell>UIC</TableCell>
                    <TableCell>Closed Date</TableCell>
                    <TableCell>VSKU ID</TableCell>
                    <TableCell>MUIC</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {picklist.items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.tray_id}</TableCell>
                      <TableCell>{data?.wht_tray}</TableCell>
                      <TableCell>{data?.uic}</TableCell>
                      <TableCell>
                        {new Date(data?.closed_time).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{data?.vendor_sku_id}</TableCell>
                      <TableCell>{data?.muic}</TableCell>
                      <TableCell>{data?.brand_name}</TableCell>
                      <TableCell>{data?.model_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
            <h6>ACTUAL</h6>
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
                <Box sx={{}}>
                  <h5>Total</h5>
                  <p style={{ marginLeft: "5px", fontSize: "24px" }}>
                    {picklist?.actual?.length}/{picklist?.items?.length}
                  </p>
                </Box>
              </Box>
              <Box
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
              </Box>
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
                    <TableCell>BOT Tray ID</TableCell>
                    <TableCell>WHT TRay ID</TableCell>
                    <TableCell>UIC</TableCell>
                    <TableCell>Closed Date</TableCell>
                    <TableCell>VSKU ID</TableCell>
                    <TableCell>MUIC</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {picklist.actual?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.tray_id}</TableCell>
                      <TableCell>{data?.wht_tray}</TableCell>
                      <TableCell>{data?.uic}</TableCell>
                      <TableCell>
                        {new Date(data?.closed_time).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{data?.vendor_sku_id}</TableCell>

                      <TableCell>{data?.muic}</TableCell>
                      <TableCell>{data?.brand_name}</TableCell>
                      <TableCell>{data?.model_name}</TableCell>
                      <TableCell style={{ color: "green" }}>
                        {data?.item_status}
                      </TableCell>
                      <TableCell>
                        <Button
                          sx={{
                            ml: 2,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          component="span"
                          onClick={() => {
                            if (window.confirm("You want to remove?")) {
                              handelDelete(data._id);
                            }
                          }}
                        >
                          Remove
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
          style={{ backgroundColor: "green" }}
          onClick={(e) => {
            handelIssue(e, picklistId);
          }}
        >
          Picklist Close
        </Button>
      </Box>
    </>
  );
}
