import React, { useState, useEffect } from "react";
import { Box, Container, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TableCell,
  CircularProgress,
} from "@mui/material";
import { axiosMisUser, axiosSuperAdminPrexo } from "../../../axios";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { LoadingButton } from "@mui/lab";
export default function Home() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [validate, setValidate] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState([]);
  const [sub, setSub] = useState([]);
  const [err, setErr] = useState({});
  const [exFile, setExfile] = useState(null);
  const [validateDisable, setValidateDisable] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);

  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/getBadOrders/" + location);
          if (res.status == 200) {
            setItem(res.data.data);
            // dataTableFun()
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
  // Validate the data
  const handelValidate = async (e) => {
    try {
      setValidateDisable(true);
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        let obj = {
          item: item,
          location: location,
        };
        let res = await axiosMisUser.post("/bulkOrdersValidation", obj);
        if (res.status == 200) {
          setValidate(true);
          setValidateDisable(false);
          alert(res.data.message);
        }
      }
    } catch (error) {
      if (error.response.status == 400) {
        setErr(error.response.data.data);
        alert(error.response.data.message);
        setValidateDisable(false);
      }
    }
  };
  // handelSubmit
  const handelSubmit = async (e) => {
    try {
      setSubmitDisable(true);
      let res = await axiosMisUser.post("/ordersImport", item);
      if (res.status == 200) {
        alert("Successfully Added");
        setSubmitDisable(false);
        navigate("/orders");
      }
    } catch (error) {
      alert(error);
    }
  };
  // ----------------------------------------------------------------------------------------------------------------------------
  const updateFieldChanged = (index) => (e) => {
    setValidate(false);
    const newArr = item.map((data, i) => {
      if (index === i) {
        return { ...data, [e.target.name]: e.target.value };
      } else {
        return data;
      }
    });
    setItem(newArr);
  };
  const mystyle = {
    ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
      width: "auto",
    },
  };
  const handelDelete = (index) => {
    item.splice(index, 1);
    setItem((item) => [...item]);
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: 11,
          mr: 3,
          ml: 3,
        }}
      >
        <Box sx={{ m: 1 }}>
          {validate ? (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 1 }}
              disabled={submitDisable}
              style={{ backgroundColor: "#206CE2" }}
              onClick={(e) => {
                handelSubmit(e);
              }}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 1 }}
              disabled={validateDisable}
              style={{ backgroundColor: "#206CE2" }}
              onClick={(e) => {
                handelValidate(e);
              }}
            >
              Validate Data
            </Button>
          )}
        </Box>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Record.NO</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Order TimeStamp</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Buyback Category</TableCell>
                <TableCell>Partner ID</TableCell>
                <TableCell>Partner Email</TableCell>
                <TableCell>Partner Shop</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>Old Item Details</TableCell>
                <TableCell>IMEI</TableCell>
                <TableCell>GEP Order</TableCell>
                <TableCell>Base Disscount</TableCell>
                <TableCell>Diganostic</TableCell>
                <TableCell>Partner Purchase Price</TableCell>
                <TableCell>Tracking ID</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Order ID Replaced</TableCell>
                <TableCell>Deliverd With OTP</TableCell>
                <TableCell>Deliverd With Bag Exception</TableCell>
                <TableCell>GC Amount Redeemed</TableCell>
                <TableCell>GC Amount Refund</TableCell>
                <TableCell>GC Redeem Time</TableCell>
                <TableCell>GC Amount Refund Time</TableCell>
                <TableCell>Diagonstic Status</TableCell>
                <TableCell>VC Eligible</TableCell>
                <TableCell>
                  Customer Declaration Physical Defect Present
                </TableCell>
                <TableCell>Customer Declaration Physical Defect Type</TableCell>
                <TableCell>Partner Price No Defect</TableCell>
                <TableCell>Revised Partner Price</TableCell>
                <TableCell>Delivery Fee</TableCell>
                <TableCell>Exchange Facilitation Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item.map((data, index) => (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      type="text"
                      name="order_id"
                      value={data["order_id"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.order_id_is_duplicate?.includes(data["order_id"]) ||
                    (Object.keys(err).length != 0 &&
                      data["order_id"] == undefined) ||
                    (Object.keys(err).length != 0 && data["order_id"] == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}

                    {err?.order_id_is_duplicate?.includes(data["order_id"]) ? (
                      <p style={{ color: "red" }}>Order Id Is Duplicate</p>
                    ) : (Object.keys(err).length != 0 &&
                        data["order_id"] == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data["order_id"] == "") ? (
                      <p style={{ color: "red" }}>Order Does Not Exist</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="order_date"
                      value={data["order_date"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.order_date?.includes(data["order_date"]) ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.order_date?.includes(data["order_date"]) ? (
                      <p style={{ color: "red" }}>Please check date formate</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="order_timestamp"
                      value={data["order_timestamp"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.order_timestamp?.includes(data["order_timestamp"]) ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.order_timestamp?.includes(data["order_timestamp"]) ? (
                      <p style={{ color: "red" }}>Please check date formate</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="order_status"
                      value={data["order_status"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="buyback_category"
                      value={data["buyback_category"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="partner_id"
                      value={data["partner_id"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.partner_id_does_not_exist?.includes(
                      data["partner_id"]
                    ) ||
                    (Object.keys(err).length != 0 &&
                      data["partner_id"] == undefined) ||
                    (Object.keys(err).length != 0 &&
                      data["partner_id"] == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.partner_id_does_not_exist?.includes(
                      data["partner_id"]
                    ) ? (
                      <p style={{ color: "red" }}>Partner Id Does Not Exist</p>
                    ) : (Object.keys(err).length != 0 &&
                        data["partner_id"] == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data["partner_id"] == "") ? (
                      <p style={{ color: "red" }}>Partner Id Does Not Exist</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="partner_email"
                      value={data["partner_email"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="partner_shop"
                      value={data["partner_shop"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.location_does_not_exist?.includes(
                      data["partner_shop"]
                    ) ||
                    (Object.keys(err).length != 0 &&
                      data["partner_shop"] == undefined) ||
                    (Object.keys(err).length != 0 &&
                      data["partner_shop"] == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}

                    {err?.location_does_not_exist?.includes(
                      data["partner_shop"]
                    ) ? (
                      <p style={{ color: "red" }}>You can't add this data</p>
                    ) : Object.keys(err).length != 0 &&
                      data["partner_shop"] == undefined ? (
                      <p style={{ color: "red" }}>Location Does Not Exist</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="item_id"
                      value={data["item_id"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.item_id_does_not_exist?.includes(data["item_id"]) ||
                    (Object.keys(err).length != 0 &&
                      data["item_id"] == undefined) ||
                    (Object.keys(err).length != 0 && data["item_id"] == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.item_id_does_not_exist?.includes(data["item_id"]) ? (
                      <p style={{ color: "red" }}>Item Id Does Not Exist</p>
                    ) : (Object.keys(err).length != 0 &&
                        data["item_id"] == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data["item_id"] == "") ? (
                      <p style={{ color: "red" }}>Item Id Does Not Exist</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="old_item_details"
                      value={data["old_item_details"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.brand_name_does_not_exist?.includes(
                      data["old_item_details"].split(":")[0]
                    ) ||
                    (Object.keys(err).length != 0 &&
                      data["old_item_details"].split(":")[0] == undefined) ||
                    (Object.keys(err).length != 0 &&
                      data["old_item_details"]?.split(":")[0] == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : err?.model_name_does_not_exist?.includes(
                        data["old_item_details"].split(":")[1]
                      ) ||
                      (Object.keys(err).length != 0 &&
                        data["old_item_details"].split(":")[1] == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data["old_item_details"]?.split(":")[1] == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.brand_name_does_not_exist?.includes(
                      data["old_item_details"].split(":")[0]
                    ) ? (
                      <p style={{ color: "red" }}>
                        This Brand Name Does Not Exist
                      </p>
                    ) : err?.model_name_does_not_exist?.includes(
                        data["old_item_details"].split(":")[1]
                      ) ? (
                      <p style={{ color: "red" }}>Model Name Does Not Exist</p>
                    ) : (Object.keys(err).length != 0 &&
                        data["old_item_details"].split(":")[0] == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data["old_item_details"]?.split(":")[0] == "") ? (
                      <p style={{ color: "red" }}>
                        This Brand Name Does Not Exist
                      </p>
                    ) : (Object.keys(err).length != 0 &&
                        data["old_item_details"].split(":")[1] == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data["old_item_details"]?.split(":")[1] == "") ? (
                      <p style={{ color: "red" }}>Model Name Does Not Exist</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    {" "}
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="imei"
                      value={data["imei"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.imei_number_is_duplicate?.includes(data["imei"]) ||
                    (Object.keys(err).length != 0 &&
                      data["imei"] == undefined) ||
                    (Object.keys(err).length != 0 && data["imei"] == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.imei_number_is_duplicate?.includes(data["imei"]) ? (
                      <p style={{ color: "red" }}>IMEI Number Is Duplicate</p>
                    ) : (Object.keys(err).length != 0 &&
                        data["imei"] == undefined) ||
                      (Object.keys(err).length != 0 && data["imei"] == "") ? (
                      <p style={{ color: "red" }}>
                        IMEI Number Does Not Exist{" "}
                      </p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    {" "}
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="gep_order"
                      value={data["gep_order"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="base_discount"
                      value={data["base_discount"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="diagnostic"
                      value={data["diagnostic"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="partner_purchase_price"
                      value={data["partner_purchase_price"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="tracking_id"
                      value={data["tracking_id"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="delivery_date"
                      value={data["delivery_date"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.delivery_date?.includes(data["delivery_date"]) ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.delivery_date?.includes(data["delivery_date"]) ? (
                      <p style={{ color: "red" }}>Please check date formate</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="order_id_replaced"
                      value={data["order_id_replaced"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="deliverd_with_otp"
                      value={data["deliverd_with_otp"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="deliverd_with_bag_exception"
                      value={data["deliverd_with_bag_exception"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="gc_amount_redeemed"
                      value={data["gc_amount_redeemed"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="gc_amount_refund"
                      value={data["gc_amount_refund"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="gc_redeem_time"
                      value={data["gc_redeem_time"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="gc_amount_refund_time"
                      value={data["gc_amount_refund_time"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="diagnstic_status"
                      value={data["diagnstic_status"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="vc_eligible"
                      value={data["vc_eligible"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="customer_declaration_physical_defect_present"
                      value={
                        data["customer_declaration_physical_defect_present"]
                      }
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="customer_declaration_physical_defect_type"
                      value={data["customer_declaration_physical_defect_type"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="partner_price_no_defect"
                      value={data["partner_price_no_defect"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="revised_partner_price"
                      value={data["revised_partner_price"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="delivery_fee"
                      value={data["delivery_fee"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="exchange_facilitation_fee"
                      value={data["exchange_facilitation_fee"]}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {(Object.keys(err).length != 0 &&
                      data["partner_id"] == "") ||
                    (Object.keys(err).length != 0 && data["order_id"] == "") ||
                    (Object.keys(err).length != 0 &&
                      data["partner_shop"] == "") ||
                    (Object.keys(err).length != 0 && data["item_id"] == "") ||
                    (Object.keys(err).length != 0 &&
                      data["old_item_details"]?.split(":")[0] == "") ||
                    (Object.keys(err).length != 0 &&
                      data["old_item_details"]?.split(":")[1] == "") ||
                    (Object.keys(err).length != 0 && data["imei"] == "") ||
                    err?.order_date?.includes(data["order_date"]) ||
                    err?.order_timestamp?.includes(data["order_timestamp"]) ||
                    err?.delivery_date?.includes(data["delivery_date"]) ||
                    err?.order_id_is_duplicate?.includes(data["order_id"]) ==
                      true ||
                    (Object.keys(err).length != 0 &&
                      data["order_id"] == undefined) ||
                    err?.partner_id_does_not_exist?.includes(
                      data["partner_id"]
                    ) == true ||
                    (Object.keys(err).length != 0 &&
                      data["partner_id"] == undefined) ||
                    err?.location_does_not_exist?.includes(
                      data["partner_shop"]
                    ) == true ||
                    (Object.keys(err).length != 0 &&
                      data["partner_shop"] == undefined) ||
                    err?.item_id_does_not_exist?.includes(data["item_id"]) ==
                      true ||
                    (Object.keys(err).length != 0 &&
                      data["item_id"] == undefined) ||
                    err?.brand_name_does_not_exist?.includes(
                      data["old_item_details"].split(":")[0]
                    ) == true ||
                    (Object.keys(err).length != 0 &&
                      data["old_item_details"].split(":")[0] == undefined) ||
                    err?.model_name_does_not_exist?.includes(
                      data["old_item_details"].split(":")[1]
                    ) == true ||
                    data["old_item_details"].split(":")[1] == undefined ||
                    err?.imei_number_is_duplicate?.includes(data["imei"]) ==
                      true ||
                    (Object.keys(err).length != 0 &&
                      data["imei"] == undefined) ? (
                      <Button
                        sx={{
                          ml: 2,
                        }}
                        variant="contained"
                        style={{ backgroundColor: "red" }}
                        component="span"
                        onClick={() => {
                          if (window.confirm("You Want to Remove?")) {
                            handelDelete(index);
                          }
                        }}
                      >
                        Remove
                      </Button>
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
