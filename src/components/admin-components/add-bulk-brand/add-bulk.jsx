import React, { useState, useEffect } from "react";
import { Box, Container, TextField } from "@mui/material";
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
  FormHelperText,
} from "@mui/material";
import { axiosSuperAdminPrexo } from "../../../axios";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
  const [validateState, setValidateState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({});
  const navigate = useNavigate();
  const [brandCount, setBrandCount] = useState(0);
  const [item, setItem] = useState([]);
  const [exFile, setExfile] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    item: [],
    totalPage: 0,
  });
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosSuperAdminPrexo.post("/getBrandIdHighest");
        if (res.status == 200) {
          setBrandCount(res.data.data);
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
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
      item: data.map((d, index) => toLowerKeys(d, brandCount, index)),
      totalPage: Math.ceil(data.length / p.size),
    }));
    setLoading(false);
  };
  function toLowerKeys(obj, count, id) {
    return Object.keys(obj).reduce((accumulator, key) => {
      accumulator.brand_id = "brand-0" + (count + id);
      accumulator[key.toLowerCase().split("-").join("_")] = obj[key];
      return accumulator;
    }, {});
  }
  const validateData = async (e) => {
    try {
        setLoading(true);
        let res = await axiosSuperAdminPrexo.post(
        "/bulkValidationBrands",
        pagination.item
      );
      if (res.status == 200) {
        setValidateState(true);
        setLoading(false);
        alert(res.data.message);
      }
    } catch (error) {
      if (error.response.status == 400) {
        setLoading(false);
        setErr(error.response.data.data);
        alert(error.response.data.message);
      }
    }
  };
  const handelSubmit = async (e) => {
    try {
      setLoading(true);
      let res = await axiosSuperAdminPrexo.post(
        "/createBrands",
        pagination.item
      );
      if (res.status == 200) {
        alert(res.data.message);
        setLoading(false);
        navigate("/brands");
      }
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
    }
  };
  // ----------------------------------------------------------------------------------------------------------------------------
  const updateFieldChanged = (brand_id) => (e) => {
    setValidateState(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.map((data, i) => {
        if (data.brand_id === brand_id) {
          return { ...data, [e.target.name]: e.target.value };
        } else {
          return data;
        }
      }),
    }));
  };
  // DATA DELETE FROM ARRAY
  const handelDelete = (brand_id) => {
    setValidateState(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.filter((item) => item.brand_id != brand_id),
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
              inputProps={{ accept: ".csv,.xlsx,.xls" }}
              helperText="Please upload excel sheet"
              variant="filled"
              onChange={(e) => {
                setExfile(e.target.files[0]);
              }}
            />
            {item.length == 0 ? (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 1 }}
                disabled={loading}
                style={{ backgroundColor: "#206CE2" }}
                onClick={(e) => {
                  importExcel();
                }}
              >
                Import
              </Button>
            ) : validateState ? (
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 3, mb: 1 }}
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
                disabled={loading}
                style={{ backgroundColor: "#206CE2" }}
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
              href={process.env.PUBLIC_URL + "/bulk-brand-sheet-sample.xlsx"}
              download
            >
              Download Sample Sheet
            </Button>
          </Box>
        </Box>
      </Container>
      {item.length != 0  && loading != true ? (
        <Paper
          sx={{ width: "100%", alignContent: "center", overflow: "hidden" }}
        >
          <TableContainer sx={{ maxHeight: 510 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>S.NO</TableCell>
                  {/* <TableCell>Brand Id</TableCell> */}
                  <TableCell>Brand Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {item.map((data, index) => (
                  <TableRow tabIndex={-1}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.brand_id)}
                        id="outlined-password-input"
                        type="text"
                        name="brand_name"
                        value={data.brand_name?.toString()}
                      />
                      {err?.duplicate_brand_name?.includes(data.brand_name) ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.duplicate_brand_name?.includes(data.brand_name) ? (
                        <p style={{ color: "red" }}>Duplicate Brand Name</p>
                      ) : (
                        ""
                      )}
                    </TableCell>

                    <TableCell>
                      {err?.duplicate_brand_name?.includes(data.brand_name) ==
                      true ? (
                        <Button
                          sx={{
                            ml: 2,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          component="span"
                          onClick={() => {
                            if (window.confirm("You Want to Remove?")) {
                                handelDelete(data.brand_id);
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
      ) :item.length != 0 ? (
        <Container>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <CircularProgress />
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
