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
import { axiosMisUser } from "../../axios";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
/********************************************************************** */
export default function Home() {
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
    } else {
      navigate("/");
    }
  }, []);
  const navigate = useNavigate();
  const [validate, setValidate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryData, setDeliveryDate] = useState("");
  const [err, setErr] = useState({});
  const [item, setItem] = useState([]);
  const [exFile, setExfile] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    item: [],
    totalPage: 0,
  });

  const importExcel = () => {
    if (exFile == null) {
      alert("Please Select File");
    } else {
      setLoading(true);
      readExcel(exFile);
    }
  };
  useEffect(() => {
    setItem((_) =>
      pagination.item
        .slice(
          (pagination.page - 1) * pagination.size,
          pagination.page * pagination.size
        )
        .map((d, index) => {
          d.id = (pagination.page - 1) * pagination.size + index + 1;
          return d;
        })
    );
  }, [pagination.page, pagination.item]);
  const readExcel = async (file) => {
    let aa = file;
    const promise = new Promise((resolve, reject) => {
      const filReader = new FileReader();
      filReader.readAsArrayBuffer(file);
      filReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer", cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { raw: false });
        resolve(data);
      };
      filReader.onerror = (error) => {
        reject(error);
      };
    });
    const data = await promise;
    setPagination((p) => ({
      ...p,
      page: 1,
      item: data.map((d, index) => toLowerKeys(d, index)),
      totalPage: Math.ceil(data.length / p.size),
    }));
    setLoading(false);
  };
  function toLowerKeys(obj, id) {
    return Object.keys(obj).reduce((accumulator, key) => {
      accumulator.created_at = Date.now();
      accumulator[key.toLowerCase().split(" ").join("_")] = obj[key];
      accumulator.delet_id = id;
      return accumulator;
    }, {});
  }

  const handelSubmit = async () => {
    try {
      setLoading(true);
      let obj = {
        validItem: [],
        invalidItem: [],
      };
      pagination.item.forEach((data) => {
        data.delivery_date = deliveryData;
        data.order_date = new Date(data.order_date);
        if (
          err?.delivery_date?.includes(data?.order_date) ||
          data?.order_date == undefined ||
          data?.order_date == ""
        ) {
          obj.invalidItem.push(data);
        } else if (
          err?.duplicate_tracking_id?.includes(data?.tracking_id) ||
          data?.tracking_id == undefined ||
          data?.tracking_id == ""
        ) {
          obj.invalidItem.push(data);
        } else if (
          err?.duplicate_order_id_found?.includes(data?.order_id) ||
          data?.order_id == undefined ||
          data?.order_id == ""
        ) {
          obj.invalidItem.push(data);
        } else if (err?.no_orders?.includes(data?.order_id)) {
          obj.invalidItem.push(data);
        } else if (
          err?.item_does_not_exist?.includes(data?.item_id) ||
          data?.item_id == undefined ||
          data?.item_id == ""
        ) {
          obj.invalidItem.push(data);
        } else if (
          err?.location_does_not_exist?.includes(data?.partner_shop) ||
          data?.partner_shop == undefined ||
          data?.partner_shop == ""
        ) {
          obj.invalidItem.push(data);
        } else {
          obj.validItem.push(data);
        }
      });

      let res = await axiosMisUser.post("/importDelivery", obj);
      if (res.status == 200) {
        alert(res.data.message);
        setLoading(false);
        navigate("/delivery");
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelValidation = async () => {
    try {
      if (deliveryData == "") {
        alert("Please Select The Date");
      } else {
        setLoading(true);
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let obj = {
            item: pagination.item,
            location: location,
          };

          let res = await axiosMisUser.post("/bulkValidationDelivery", obj);
          if (res.status == 200) {
            alert(res.data.message);
            setLoading(false);
            setValidate(true);
          }
        }
      }
    } catch (error) {
      if (error.response.status == 400) {
        setErr(error.response.data.data);
        alert("Please Check Errors");
        setLoading(false);
        setValidate(true);
      }
    }
  };
  // ----------------------------------------------------------------------------------------------------------------------------
  const updateFieldChanged = (delet_id) => (e) => {
    setValidate(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.map((data, i) => {
        if (data.delet_id === delet_id) {
          return { ...data, [e.target.name]: e.target.value };
        } else {
          return data;
        }
      }),
    }));
  };
  // DATA DELETE FROM ARRAY
  const handelDelete = (delet_id) => {
    setValidate(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.filter((item) => item.delet_id != delet_id),
    }));
  };

  return (
    <>
      <Container maxWidth="xs">
        <Box
          sx={{
            m: 4,
            mt: 6,
            boxShadow: 5,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
          noValidate
          autoComplete="off"
          style={{ marginTop: "89px" }}
        >
          <Box sx={{ m: 5 }}>
            <TextField
              id="filled-select-currency"
              type="file"
              sx={{ mt: 3, mb: 1 }}
              inputProps={{ accept: ".csv,.xlsx,.xls" }}
              helperText="Please upload excel sheet"
              variant="filled"
              onChange={(e) => {
                setExfile(e.target.files[0]);
              }}
            />
            <TextField
              id="filled-select-currency"
              type="Date"
              fullWidth
              onChange={(e) => {
                setDeliveryDate(e.target.value);
              }}
              inputProps={{
                max: moment().format("YYYY-MM-DD"),
              }}
              sx={{ mt: 3, mb: 1 }}
              helperText="Please Select Deliverd Date"
              variant="filled"
            />
            {item.length == 0 ? (
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 3, mb: 1 }}
                style={{ backgroundColor: "#206CE2" }}
                onClick={(e) => {
                  importExcel();
                }}
              >
                Import
              </Button>
            ) : validate ? (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 1 }}
                disabled={loading}
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
                disabled={loading}
                style={{ backgroundColor: "#206CE2" }}
                onClick={(e) => {
                  handelValidation(e);
                }}
              >
                Validate Data
              </Button>
            )}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 1 }}
              style={{ backgroundColor: "#206CE2" }}
              type="button"
              href={process.env.PUBLIC_URL + "/bulk-delivery-sheet-sample.xlsx"}
              download
            >
              Download Sample Sheet
            </Button>
          </Box>
        </Box>
      </Container>
      {item.length !== 0 && loading != true ? (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 510 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>S.NO</TableCell>
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
                    <TableCell>{data.id}</TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.delet_id)}
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
                      {err?.duplicate_tracking_id?.includes(data.tracking_id) ||
                      (Object.keys(err).length != 0 &&
                        data.tracking_id == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data.tracking_id == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}
                      {err?.duplicate_tracking_id?.includes(
                        data.tracking_id
                      ) ? (
                        <p style={{ color: "red" }}>Duplicate Tracking ID</p>
                      ) : (Object.keys(err).length != 0 &&
                          data.tracking_id == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data.tracking_id == "") ? (
                        <p style={{ color: "red" }}>
                          Tracking Id Does Not Exist
                        </p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.delet_id)}
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
                      {err?.duplicate_order_id_found?.includes(data.order_id) ||
                      err?.no_orders?.includes(data.order_id) ||
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
                        data.order_id
                      ) ? (
                        <p style={{ color: "red" }}>Duplicate Order Id Found</p>
                      ) : (Object.keys(err).length != 0 &&
                          data?.order_id == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data.order_id == "") ? (
                        <p style={{ color: "red" }}>Order Id Does Not Exist</p>
                      ) : err?.no_orders?.includes(data.order_id) ? (
                        <p style={{ color: "red" }}>Order not found</p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.delet_id)}
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
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.delet_id)}
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
                      {err?.item_does_not_exist?.includes(data.item_id) ||
                      (Object.keys(err).length != 0 &&
                        data?.item_id == undefined) ||
                      (Object.keys(err).length != 0 && data?.item_id == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}
                      {err?.item_does_not_exist?.includes(data.item_id) ? (
                        <p style={{ color: "red" }}>Item Does Not Exist</p>
                      ) : (Object.keys(err).length != 0 &&
                          data?.item_id == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data?.item_id == "") ? (
                        <p style={{ color: "red" }}>Item Does Not Exist</p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.delet_id)}
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
                        onChange={updateFieldChanged(data.delet_id)}
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
                        onChange={updateFieldChanged(data.delet_id)}
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
                        onChange={updateFieldChanged(data.delet_id)}
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
                        data.partner_shop
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
                        data.partner_shop
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
                        onChange={updateFieldChanged(data.delet_id)}
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
                        onChange={updateFieldChanged(data.delet_id)}
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
                        onChange={updateFieldChanged(data.delet_id)}
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
                        onChange={updateFieldChanged(data.delet_id)}
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
                        onChange={updateFieldChanged(data.delet_id)}
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
                      {(Object.keys(err).length != 0 &&
                        data?.tracking_id == "") ||
                      err?.no_orders?.includes(data.order_id) ||
                      (Object.keys(err).length != 0 && data?.order_id == "") ||
                      (Object.keys(err).length != 0 && data?.item_id == "") ||
                      (Object.keys(err).length != 0 &&
                        data?.partner_shop == "") ||
                      err?.duplicate_tracking_id?.includes(data.tracking_id) ==
                        true ||
                      (Object.keys(err).length != 0 &&
                        data?.tracking_id == undefined) ||
                      err?.duplicate_order_id_found?.includes(data.order_id) ==
                        true ||
                      (Object.keys(err).length != 0 &&
                        data?.order_id == undefined) ||
                      err?.item_does_not_exist?.includes(data.item_id) ==
                        true ||
                      (Object.keys(err).length != 0 &&
                        data.item_id == undefined) ||
                      err?.location_does_not_exist?.includes(
                        data.partner_shop
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
                              handelDelete(data.delet_id);
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
      ) : item.length != 0 ? (
        <Container>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <CircularProgress />
            <p style={{ paddingTop: "10px" }}>Please wait...</p>
          </Box>
        </Container>
      ) : null}
      {pagination.item.length && loading != true ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            mt: 1,
            mr: 3,
            ml: 3,
          }}
        >
          <Button
            variant="contained"
            sx={{ m: 1 }}
            disabled={pagination.page === 1}
            style={{ backgroundColor: "#206CE2" }}
            onClick={(e) => setPagination((p) => ({ ...p, page: --p.page }))}
          >
            Previous
          </Button>

          <h6 style={{ marginTop: "10px" }}>
            {pagination.page}/{pagination.totalPage}
          </h6>
          <Button
            variant="contained"
            sx={{ m: 1 }}
            disabled={pagination.page === pagination.totalPage}
            style={{ backgroundColor: "#206CE2" }}
            onClick={(e) => setPagination((p) => ({ ...p, page: ++p.page }))}
          >
            Next
          </Button>
        </Box>
      ) : null}
    </>
  );
}
