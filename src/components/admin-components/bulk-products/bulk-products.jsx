import React, { useState, useEffect } from "react";
import { Box, Container, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { axiosSuperAdminPrexo } from "../../../axios";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { LoadingButton } from "@mui/lab";
import CircularProgress from "@mui/material/CircularProgress";
import $ from "jquery";
import "datatables.net";
/***********************************************************************************************************************************************/
export default function Home() {
  const [validateState, setValidateState] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    item: [],
    totalPage: 0,
  });
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState([]);
  const [exFile, setExfile] = useState(null);

  const navigate = useNavigate();
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
  const importExcel = () => {
    if (exFile == null) {
      alert("Please Select File");
    } else {
      setLoading(true);
      readExcel(exFile);
    }
  };
  // READ EXCEL FILLE
  const readExcel = async (file) => {
    const promise = new Promise((resolve, reject) => {
      const filReader = new FileReader();
      filReader.readAsArrayBuffer(file);
      filReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
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
      item: data.map((d, index) => toLowerKeys(d)),
      totalPage: Math.ceil(data.length / p.size),
    }));
    setLoading(false);
  };
  // EXCEL FILE HEADER CONVERT TO LOWERCASE AND GENERATE MUIC CODE
  function toLowerKeys(obj) {
    return Object.keys(obj).reduce((accumulator, key, index) => {
      let muis_code = "";
      let alphebet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let numbers = "123456789";
      for (var i = 0; i < 2; i++) {
        muis_code += alphebet.charAt(
          Math.floor(Math.random() * alphebet.length)
        );
      }
      for (var i = 0; i < 3; i++) {
        muis_code += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      accumulator.muic = muis_code;
      accumulator.created_at = Date.now();
      accumulator[key.toLowerCase().split("-").join("_")] = obj[key];
      return accumulator;
    }, {});
  }
  // API FOR VALIDATE THE DATA
  const validateData = async (e) => {
    try {
      setLoading(true);
      let res = await axiosSuperAdminPrexo.post(
        "/bulkValidationProduct",
        pagination.item
      );
      if (res.status == 200) {
        setValidateState(true);
        setLoading(false);
        alert(res.data.message);
      }
    } catch (error) {
      if (error.response.status == 400) {
        setErr(error.response.data.data);
        setLoading(false);
        alert("Please Check Errors");
      }
    }
  };
  // CREATE PRODUCTS API
  const handelSubmit = async (e) => {
    try {
      setLoading(true);
      let res = await axiosSuperAdminPrexo.post(
        "/createproducts",
        pagination.item
      );
      if (res.status == 200) {
        alert(res.data.message);
        setLoading(false);
        navigate("/products");
      }
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
    }
  };
  // FUNCATION FOR DATATABLE
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  // ----------------------------------------------------------------------------------------------------------------------------
  //IF ANY VALUE CHANGE ONCHANGE FUNCTION
  const updateFieldChanged = (index) => (e) => {
    setValidateState(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.map((data, i) => {
        if (index === data.muic) {
          return { ...data, [e.target.name]: e.target.value };
        } else {
          return data;
        }
      }),
    }));
  };
  // DATA DELETE FROM ARRAY
  const handelDelete = (muic) => {
    setValidateState(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.filter((item) => item.muic != muic),
    }));
  };
  // ----------------------------------------------------------------------------------------------------------------------------
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
              helperText="Please upload excel sheet"
              variant="filled"
              inputProps={{ accept: ".csv,.xlsx,.xls" }}
              onChange={(e) => {
                setExfile(e.target.files[0]);
              }}
            />

            {item.length == 0 ? (
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 3, mb: 1 }}
                onClick={(e) => {
                  importExcel(e);
                }}
              >
                Import
              </Button>
            ) : validateState ? (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 1 }}
                disabled={loading}
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
                disabled={loading}
                sx={{ mt: 3, mb: 1 }}
                onClick={(e) => {
                  validateData(e);
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
              href={process.env.PUBLIC_URL + "/bulk -product-sheet-sample.xlsx"}
              download
            >
              Download Sample Sheet
            </Button>
          </Box>
        </Box>
      </Container>
      {item.length != 0 && loading != true ? (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.NO</TableCell>
                  <TableCell>Vendor SKU ID</TableCell>
                  <TableCell>Brand Name</TableCell>
                  <TableCell>Model Name</TableCell>
                  <TableCell>Vendor Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {item.map((data, index) => (
                  <TableRow key={data.muic} tabIndex={-1}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.muic)}
                        type="text"
                        name="vendor_sku_id"
                        value={data.vendor_sku_id?.toString()}
                      />
                      {err?.duplicate_vendor_iD?.includes(
                        data.vendor_sku_id
                      ) ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.duplicate_vendor_iD?.includes(
                        data.vendor_sku_id
                      ) ? (
                        <p style={{ color: "red" }}>Duplicate Vendor Sku Id</p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.muic)}
                        type="text"
                        name="brand_name"
                        value={data.brand_name?.toString()}
                      />
                      {err?.brand_name?.includes(data.brand_name) ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.brand_name?.includes(data.brand_name) ? (
                        <p style={{ color: "red" }}>
                          Brand Name Does Not Exist
                        </p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.muic)}
                        type="text"
                        name="model_name"
                        value={data.model_name?.toString()}
                      />
                      {err?.model_name?.includes(data.model_name) ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.model_name?.includes(data.model_name) ? (
                        <p style={{ color: "red" }}>Duplicate Model Name</p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.muic)}
                        type="text"
                        name="vendor_name"
                        value={data.vendor_name?.toString()}
                      />
                    </TableCell>
                    <TableCell>
                      {err?.duplicate_vendor_iD?.includes(data.vendor_sku_id) ==
                        true ||
                      err?.brand_name?.includes(data.brand_name) == true ||
                      err?.model_name?.includes(data.model_name) == true ? (
                        <Button
                          sx={{
                            ml: 2,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          component="span"
                          onClick={() => {
                            if (window.confirm("You Want to Remove?")) {
                              handelDelete(data.muic);
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
            <p style={{paddingTop:"10px"}}>Please wait...</p>
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
