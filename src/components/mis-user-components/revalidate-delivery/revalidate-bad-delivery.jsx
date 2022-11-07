import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Container,
  TextField,
} from "@mui/material";
import { axiosMisUser } from "../../../axios";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import moment from "moment";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";

export default function Home() {
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosMisUser.post("/getBadDelivery/" + location);
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
  const navigate = useNavigate();
  const [validate, setValidate] = useState(false);
  const [deliveryData, setDeliveryDate] = useState("");
  const [validateDisable, setValidateDisable] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);
  const [err, setErr] = useState({});
  const [item, setItem] = useState([]);
  const [exFile, setExfile] = useState(null);
  const importExcel = () => {
    readExcel(exFile);
  };
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const filReader = new FileReader();
      filReader.readAsArrayBuffer(file);
      filReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer", cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      filReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((data) => {
      data.map((obj) => {
        obj = toLowerKeys(obj);
        setItem((item) => [...item, obj]);
      });
    });
    function toLowerKeys(obj) {
      return Object.keys(obj).reduce((accumulator, key) => {
        accumulator.delivery_date = deliveryData;
        accumulator.created_at = Date.now();
        accumulator[key.toLowerCase().split(" ").join("_")] = obj[key];
        return accumulator;
      }, {});
    }
  };
  const handelSubmit = async () => {
    try {
      setSubmitDisable(true);
      let obj = {
        validItem: [],
        invalidItem: [],
      };

      let res = await axiosMisUser.post("/importDelivery", obj);
      if (res.status == 200) {
        alert(res.data.message);
        setSubmitDisable(false);
        navigate("/delivery");
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelValidation = async () => {
    try {
      setValidateDisable(true);
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        let obj = {
          item: item,
          location: location,
        };

        let res = await axiosMisUser.post("/bulkValidationDelivery", obj);
        if (res.status == 200) {
          alert(res.data.message);
          setValidateDisable(false);
          setValidate(true);
        }
      }
    } catch (error) {
      if (error.response.status == 400) {
        setErr(error.response.data.data);
        alert("Please Check Errors");
        setValidateDisable(false);
      }
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

  const handelDelete = (index) => {
    item.splice(index, 1);
    setItem((item) => [...item]);
  };

  return (
    <>
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
          {/* <TextField
                            id="filled-select-currency"
                            type="Date"
                            fullWidth
                            onChange={(e) => {
                                setDeliveryDate(e.target.value)
                            }}
                            inputProps={{
                                max: moment().format("YYYY-MM-DD")
                            }}

                            sx={{ mt: 3, mb: 1 }}
                            helperText="Please Select Deliverd Date"
                            variant="filled"
                        /> */}
          {validate ? (
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
              disabled={submitDisable}
              style={{ backgroundColor: "#206CE2" }}
              onClick={(e) => {
                handelSubmit();
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
                handelValidation(e);
              }}
            >
              Validate Data
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 510 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Record.NO</TableCell>
                <TableCell>Tracking ID</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>GEP Order</TableCell>
                <TableCell>IMEI</TableCell>
                <TableCell>Partner Purchase Price</TableCell>
                <TableCell>Partner Shop</TableCell>
                <TableCell>Base Discount</TableCell>
                <TableCell>Diagnostics Discount</TableCell>
                <TableCell>Storage Disscount</TableCell>
                <TableCell>Buyback Category</TableCell>
                <TableCell>Doorsteps Diagnostics</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item.map((data, index) => (
                <TableRow tabIndex={-1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="tracking_id"
                      value={data.tracking_id?.toString()}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.duplicate_tracking_id?.includes(
                      data.tracking_id?.toString()
                    ) ||
                    (Object.keys(err).length != 0 &&
                      data.tracking_id == undefined) ||
                    (Object.keys(err).length != 0 && data.tracking_id == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.duplicate_tracking_id?.includes(
                      data.tracking_id?.toString()
                    ) ? (
                      <p style={{ color: "red" }}>Duplicate Tracking ID</p>
                    ) : (Object.keys(err).length != 0 &&
                        data.tracking_id == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data.tracking_id == "") ? (
                      <p style={{ color: "red" }}>Tracking Id Does Not Exist</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="order_id"
                      value={data.order_id?.toString()}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.duplicate_order_id_found?.includes(
                      data.order_id?.toString()
                    ) ||
                    (Object.keys(err).length != 0 &&
                      data.order_id == undefined) ||
                    (Object.keys(err).length != 0 && data.order_id == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.duplicate_order_id_found?.includes(
                      data.order_id?.toString()
                    ) ? (
                      <p style={{ color: "red" }}>Duplicate Order Id Found</p>
                    ) : (Object.keys(err).length != 0 &&
                        data?.order_id == undefined) ||
                      (Object.keys(err).length != 0 && data.order_id == "") ? (
                      <p style={{ color: "red" }}>Order Id Does Not Exist</p>
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
                      value={data.order_date?.toString()}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.delivery_date?.includes(
                      data.order_date?.toString()
                    ) ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.delivery_date?.includes(
                      data.order_date?.toString()
                    ) ? (
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
                      name="item_id"
                      value={data.item_id?.toString()}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.item_does_not_exist?.includes(
                      data.item_id?.toString()
                    ) ||
                    (Object.keys(err).length != 0 &&
                      data?.item_id == undefined) ||
                    (Object.keys(err).length != 0 && data?.item_id == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.item_does_not_exist?.includes(
                      data.item_id?.toString()
                    ) ? (
                      <p style={{ color: "red" }}>Item Does Not Exist</p>
                    ) : (Object.keys(err).length != 0 &&
                        data?.item_id == undefined) ||
                      (Object.keys(err).length != 0 && data?.item_id == "") ? (
                      <p style={{ color: "red" }}>Item Does Not Exist</p>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      onChange={updateFieldChanged(index)}
                      id="outlined-password-input"
                      type="text"
                      name="gep_order"
                      value={data.gep_order?.toString()}
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
                      name="imei"
                      value={data.imei?.toString()}
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
                      value={data.partner_purchase_price?.toString()}
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
                      value={data.partner_shop?.toString()}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                    {err?.location_does_not_exist?.includes(
                      data.partner_shop?.toString()
                    ) ||
                    (Object.keys(err).length != 0 &&
                      data?.partner_shop == undefined) ||
                    (Object.keys(err).length != 0 &&
                      data?.partner_shop == "") ? (
                      <ClearIcon style={{ color: "red" }} />
                    ) : Object.keys(err).length != 0 ? (
                      <DoneIcon style={{ color: "green" }} />
                    ) : (
                      ""
                    )}
                    {err?.location_does_not_exist?.includes(
                      data.partner_shop?.toString()
                    ) ? (
                      <p style={{ color: "red" }}>You Can't Add This Data</p>
                    ) : (Object.keys(err).length != 0 &&
                        data?.partner_shop == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data?.partner_shop == "") ? (
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
                      name="base_discount"
                      value={data.base_discount?.toString()}
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
                      name="diagnostics_discount"
                      value={data.diagnostics_discount?.toString()}
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
                      name="storage_disscount"
                      value={data.storage_disscount?.toString()}
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
                      value={data.buyback_category?.toString()}
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
                      name="doorsteps_diagnostics"
                      value={data.doorsteps_diagnostics?.toString()}
                      inputProps={{
                        style: {
                          width: "auto",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {err?.delivery_date?.includes(
                      data.order_date?.toString()
                    ) ||
                    (Object.keys(err).length != 0 && data?.tracking_id == "") ||
                    (Object.keys(err).length != 0 && data?.order_id == "") ||
                    (Object.keys(err).length != 0 && data?.item_id == "") ||
                    (Object.keys(err).length != 0 &&
                      data?.partner_shop == "") ||
                    (Object.keys(err).length != 0 &&
                      data.order_date == undefined) ||
                    (Object.keys(err).length != 0 && data.order_date == "") ||
                    err?.duplicate_tracking_id?.includes(
                      data.tracking_id?.toString()
                    ) == true ||
                    (Object.keys(err).length != 0 &&
                      data?.tracking_id == undefined) ||
                    err?.duplicate_order_id_found?.includes(
                      data.order_id?.toString()
                    ) == true ||
                    (Object.keys(err).length != 0 &&
                      data?.order_id == undefined) ||
                    err?.item_does_not_exist?.includes(
                      data.item_id?.toString()
                    ) == true ||
                    (Object.keys(err).length != 0 &&
                      data.item_id == undefined) ||
                    err?.location_does_not_exist?.includes(
                      data.partner_shop?.toString()
                    ) == true ||
                    (Object.keys(err).length != 0 &&
                      data.partner_shop == undefined) ? (
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
    </>
  );
}
