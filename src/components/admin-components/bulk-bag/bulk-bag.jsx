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
} from "@mui/material";
import { axiosSuperAdminPrexo } from "../../../axios";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";
/******************************************************************************/
export default function Home() {
  const [validateState, setValidateState] = useState(false);
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [brandCount, setBrandCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    item: [],
    totalPage: 0,
  });
  const navigate = useNavigate();
  const [item, setItem] = useState([]);
  const [exFile, setExfile] = useState(null);
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
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosSuperAdminPrexo.post(
          "/getMasterHighest/" + "bag-master"
        );
        if (res.status == 200) {
          setBrandCount(res.data.data);
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
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
      accumulator.created_at = Date.now();
      accumulator.prefix = "bag-master";
      accumulator.sort_id = "No Status";
      accumulator[key.toLowerCase().split("-").join("_")] = obj[key];
      return accumulator;
    }, {});
  }
  const validateData = async (e) => {
    try {
      let count1 = 0;
      let count2 = 0;
      let check = true;
      setLoading(true);
      for (let x of pagination.item) {
        if (x.bag_id == undefined) {
          if (x.cpc == "Gurgaon_122016") {
            x.bag_id = "DDB-GGN-" + (brandCount.bagGurgaon + count1);
            count1++;
          } else {
            x.bag_id = "DDB-BLR-" + (brandCount.bagBanglore + count2);
            count2++;
          }
        } else {
          check = false;
          break;
        }
      }
      let res = await axiosSuperAdminPrexo.post(
        "/bulkValidationBag",
        pagination.item
      );
      if (res.status == 200) {
        setValidateState(true);
        alert(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      if (error.response.status == 400) {
        setErr(error.response.data.data);
        alert("Please Check Errors");
        setLoading(false);
      }
    }
  };
  const handelSubmit = async (e) => {
    try {
      setLoading(true);
      let res = await axiosSuperAdminPrexo.post(
        "/createBulkBag",
        pagination.item
      );
      if (res.status == 200) {
        alert(res.data.message);
        setLoading(false);
        navigate("/bag-master");
      }
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };
  // ----------------------------------------------------------------------------------------------------------------------------
  const updateFieldChanged = (bag_id) => (e) => {
    setValidateState(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.map((data, i) => {
        if (data.id === bag_id) {
          return { ...data, [e.target.name]: e.target.value };
        } else {
          return data;
        }
      }),
    }));
  };
  // DATA DELETE FROM ARRAY
  const handelDelete = (bag_id) => {
    setValidateState(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.filter((item) => item.bag_id != bag_id),
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
                disabled={loading}
                sx={{ mt: 3, mb: 1 }}
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
              href={process.env.PUBLIC_URL + "/bulk-bag-sheet-sample.xlsx"}
              download
            >
              Download Sample Sheet
            </Button>
          </Box>
        </Box>
      </Container>
      {item.length != 0 && loading != true ? (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 510 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>S.NO</TableCell>
                  <TableCell>CPC</TableCell>
                  <TableCell>Warehouse</TableCell>
                  <TableCell>Bag Category</TableCell>
                  <TableCell>Display Name</TableCell>
                  <TableCell>Bag Limit</TableCell>
                  <TableCell>Bag Display</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {item.map((data, index) => (
                  <TableRow tabIndex={-1}>
                    <TableCell>{data.id}</TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="cpc"
                        value={data.cpc}
                      />
                      {err?.cpc?.includes(data.cpc) ||
                      (Object.keys(err).length != 0 && data.cpc == undefined) ||
                      (Object.keys(err).length != 0 && data.cpc == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}
                      {err?.cpc?.includes(data.cpc) ? (
                        <p style={{ color: "red" }}>Cpc Does Not Exist</p>
                      ) : (Object.keys(err).length != 0 &&
                          data.cpc == undefined) ||
                        (Object.keys(err).length != 0 && data.cpc == "") ? (
                        <p style={{ color: "red" }}>Cpc Does Not Exist</p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="warehouse"
                        value={data.warehouse}
                      />
                      {err?.warehouse_does_not_exist?.includes(data.bag_id) ||
                      (Object.keys(err).length != 0 &&
                        data.warehouse == undefined) ||
                      (Object.keys(err).length != 0 && data.warehouse == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}
                      {err?.warehouse_does_not_exist?.includes(data.bag_id) ? (
                        <p style={{ color: "red" }}>Warehouse Does Not Exist</p>
                      ) : (Object.keys(err).length != 0 &&
                          data.warehouse == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data.warehouse == "") ? (
                        <p style={{ color: "red" }}>Warehouse Does Not Exist</p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="bag_category"
                        value={data.bag_category?.toString()}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="bag_display_name"
                        value={data.bag_display_name?.toString()}
                      />
                      {err?.bag_display_name_is_duplicate?.includes(
                        data.bag_display_name
                      ) ||
                      (Object.keys(err).length != 0 &&
                        data.bag_display_name == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data.bag_display_name == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.bag_display_name_is_duplicate?.includes(
                        data.bag_display_name
                      ) ? (
                        <p style={{ color: "red" }}>
                          {" "}
                          Duplicate Bag Display Name{" "}
                        </p>
                      ) : (Object.keys(err).length != 0 &&
                          data.bag_display_name == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data.bag_display_name == "") ? (
                        <p style={{ color: "red" }}>Required*</p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="bag_limit"
                        value={data.bag_limit}
                      />
                      {err?.limit?.includes(data.bag_id) ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : null}
                      {err?.limit?.includes(data.bag_id) ? (
                        <p style={{ color: "red" }}>Not Acceptable</p>
                      ) : (
                        ""
                      )}
                    </TableCell>

                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="bag_display"
                        value={data.bag_display}
                      />
                      {err?.bag_display_is_duplicate?.includes(
                        data.bag_display
                      ) ||
                      (Object.keys(err).length != 0 &&
                        data.bag_display == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data.bag_display == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.bag_display_is_duplicate?.includes(
                        data.bag_display
                      ) ? (
                        <p style={{ color: "red" }}> Duplicate Bag Display</p>
                      ) : (Object.keys(err).length != 0 &&
                          data.bag_display == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data.bag_display == "") ? (
                        <p style={{ color: "red" }}>Required*</p>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      {(Object.keys(err).length != 0 &&
                        data.cpc == undefined) ||
                      err?.limit?.includes(data.bag_id) ||
                      (Object.keys(err).length != 0 && data.cpc == "") ||
                      err?.cpc?.includes(data.cpc) == true ||
                      (Object.keys(err).length != 0 &&
                        data.warehouse == undefined) ||
                      (Object.keys(err).length != 0 && data.warehouse == "") ||
                      (Object.keys(err).length != 0 &&
                        data.bag_display_name == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data.bag_display_name == "") ||
                      (Object.keys(err).length != 0 &&
                        data.bag_display == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data.bag_display == "") ||
                      err?.warehouse_does_not_exist?.includes(data.bag_id) ==
                        true ||
                      err?.bag_id_is_duplicate?.includes(data.bag_id) == true ||
                      err?.bag_display_name_is_duplicate?.includes(
                        data.bag_display_name
                      ) == true ||
                      err?.bag_display_is_duplicate?.includes(
                        data.bag_display
                      ) == true ? (
                        <Button
                          sx={{
                            ml: 2,
                          }}
                          variant="contained"
                          style={{ backgroundColor: "red" }}
                          component="span"
                          onClick={() => {
                            if (window.confirm("You Want to Remove?")) {
                              handelDelete(data.bag_id);
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
