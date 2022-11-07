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
import { axiosSuperAdminPrexo } from "../../axios";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";
/************************************************** */
export default function Home() {
  const [validateState, setValidateState] = useState(false);
  const [err, setErr] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brandCount, setBrandCount] = useState(0);
  const [countOfTray, setCountOfTray] = useState({});
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    item: [],
    totalPage: 0,
  });
  const [item, setItem] = useState([]);
  const [exFile, setExfile] = useState(null);
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
          "/trayIdGenrate/" + "tray-master"
        );
        if (res.status == 200) {
          setCountOfTray(res.data.data);
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
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
      item: data.map((d, index) => toLowerKeys(d, index)),
      totalPage: Math.ceil(data.length / p.size),
    }));
    setLoading(false);
  };
  function toLowerKeys(obj, id) {
    return Object.keys(obj).reduce((accumulator, key) => {
      accumulator.created_at = Date.now();
      accumulator.prefix = "tray-master";
      accumulator.sort_id = "Open";
      accumulator[key.toLowerCase().split("-").join("_")] = obj[key];
      return accumulator;
    }, {});
  }
  const validateData = async (e) => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let count4 = 0;
    let check = true;
    try {
      for (let x of pagination.item) {
        if (x.tray_id == undefined) {
          if (x.tray_category == "BOT") {
            x.tray_id = "BOT" + (countOfTray.BOT + count1);
            count1++;
          } else if (x.tray_category == "MMT") {
            x.tray_id = "MMT" + (countOfTray.MMT + count2);
            count2++;
          } else if (x.tray_category == "PMT") {
            x.tray_id = "PMT" + (countOfTray.PMT + count3);
            count3++;
          } else if (x.tray_category == "WHT") {
            x.tray_id = "WHT" + (countOfTray.WHT + count4);
            count4++;
          }
        } else {
          check = false;
          break;
        }
      }
      if (check) {
        setCountOfTray((p) => ({
          ...p,
          BOT: p.BOT + count1,
          MMT: p.MMT + count2,
          PMT: p.PMT + count3,
          WHT: p.WHT + count4,
        }));
      }
      setLoading(true);
      let res = await axiosSuperAdminPrexo.post(
        "/bulkValidationTray",
        pagination.item
      );
      if (res.status == 200) {
        setLoading(false);
        alert(res.data.message);
        setValidateState(true);
      }
      // }
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

      let obj = {
        allCount: countOfTray,
        item: pagination.item,
      };
      let res = await axiosSuperAdminPrexo.post("/createBulkTray", obj);
      if (res.status == 200) {
        alert(res.data.message);
        setLoading(false);
        navigate("/tray-master");
      }
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
    }
  };
  // ----------------------------------------------------------------------------------------------------------------------------
  const updateFieldChanged = (id) => (e) => {
    setValidateState(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.map((data, i) => {
        if (data.id === id) {
          return { ...data, [e.target.name]: e.target.value };
        } else {
          return data;
        }
      }),
    }));
  };
  // DATA DELETE FROM ARRAY
  const handelDelete = (tray_id, trayType) => {
    setValidateState(false);
    setPagination((p) => ({
      ...p,
      item: pagination.item.filter((item) => item.tray_id != tray_id),
    }));
    if (trayType == "BOT") {
      setCountOfTray((p) => ({
        ...p,
        BOT: p.BOT - 1,
      }));
    } else if (trayType == "MMT") {
      setCountOfTray((p) => ({
        ...p,
        MMT: p.MMT - 1,
      }));
    } else if (trayType == "PMT") {
      setCountOfTray((p) => ({
        ...p,
        PMT: p.PMT - 1,
      }));
    } else if (trayType == "WHT") {
      setCountOfTray((p) => ({
        ...p,
        WHT: p.WHT - 1,
      }));
    }
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
              href={process.env.PUBLIC_URL + "/bulk-tray-sheet-sample.xlsx"}
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
                  {err?.tray_id?.length !== 0 &&
                  Object.keys(err).length !== 0 ? (
                    <TableCell>Tray ID</TableCell>
                  ) : (
                    ""
                  )}
                  <TableCell>CPC</TableCell>
                  <TableCell>Warehouse</TableCell>
                  <TableCell>Tray Category</TableCell>
                  <TableCell>Tray Brand</TableCell>
                  <TableCell>Tray Model</TableCell>
                  <TableCell>Tray Name</TableCell>
                  <TableCell>Tray Limit</TableCell>
                  <TableCell>Tray Display</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {item.map((data, index) => (
                  <TableRow tabIndex={-1}>
                    <TableCell>{data.id}</TableCell>
                    {err?.tray_id?.length != 0 &&
                    Object.keys(err).length !== 0 ? (
                      <TableCell>
                        {" "}
                        <TextField
                          id="outlined-password-input"
                          type="text"
                          value={data.tray_id}
                        />
                        {err?.tray_id?.includes(data.tray_id) ? (
                          <ClearIcon style={{ color: "red" }} />
                        ) : Object.keys(err).length != 0 ? (
                          <DoneIcon style={{ color: "green" }} />
                        ) : (
                          ""
                        )}
                        {err?.tray_id?.includes(data.tray_id) ? (
                          <p style={{ color: "red" }}>
                            {data.tray_category + " "} maximum count exceeded
                          </p>
                        ) : null}
                      </TableCell>
                    ) : (
                      ""
                    )}
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
                        value={data.warehouse?.toString()}
                      />
                      {err?.warehouse_does_not_exist?.includes(data.tray_id) ||
                      (Object.keys(err).length != 0 &&
                        data.warehouse == undefined) ||
                      (Object.keys(err).length != 0 && data.warehouse == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.warehouse_does_not_exist?.includes(data.tray_id) ? (
                        <p style={{ color: "red" }}>Warehouse Does Not Exist</p>
                      ) : (Object.keys(err).length != 0 &&
                          data.warehouse == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data.warehouse == "") ? (
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
                        name="tray_category"
                        value={data.tray_category?.toString()}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="tray_brand"
                        value={data.tray_brand?.toString()}
                      />
                      {err?.brand?.includes(data.tray_brand) ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : (
                        <DoneIcon style={{ color: "green" }} />
                      )}
                      {err?.brand?.includes(data.tray_brand) ? (
                        <p style={{ color: "red" }}>Brand name not exists</p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="tray_model"
                        value={data.tray_model?.toString()}
                      />
                      {err?.model?.includes(data.tray_model) ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : (
                        <DoneIcon style={{ color: "green" }} />
                      )}
                      {err?.model?.includes(data.tray_model) ? (
                        <p style={{ color: "red" }}>Model name not exists</p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <TextField
                        onChange={updateFieldChanged(data.id)}
                        id="outlined-password-input"
                        type="text"
                        name="tray_name"
                        value={data.tray_name?.toString()}
                      />
                      {err?.tray_display_name_duplicate?.includes(
                        data.tray_name
                      ) ||
                      (Object.keys(err).length != 0 &&
                        data.tray_name == undefined) ||
                      (Object.keys(err).length != 0 && data.tray_name == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.tray_display_name_duplicate?.includes(
                        data.tray_name
                      ) ? (
                        <p style={{ color: "red" }}>Duplicate Tray Name</p>
                      ) : (Object.keys(err).length != 0 &&
                          data.tray_name == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data.tray_name == "") ? (
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
                        name="tray_limit"
                        value={data.tray_limit?.toString()}
                      />
                      {err?.trayLimit?.includes(data.tray_id) ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : null}
                      {err?.trayLimit?.includes(data.tray_id) ? (
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
                        name="tray_display"
                        value={data.tray_display?.toString()}
                      />
                      {err?.tray_display_is_duplicate?.includes(
                        data.tray_display
                      ) ||
                      (Object.keys(err).length != 0 &&
                        data.tray_display == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data.tray_display == "") ? (
                        <ClearIcon style={{ color: "red" }} />
                      ) : Object.keys(err).length != 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        ""
                      )}

                      {err?.tray_display_is_duplicate?.includes(
                        data.tray_display
                      ) ? (
                        <p style={{ color: "red" }}>
                          Duplicate Tray Display Name
                        </p>
                      ) : (Object.keys(err).length != 0 &&
                          data.tray_display == undefined) ||
                        (Object.keys(err).length != 0 &&
                          data.tray_display == "") ? (
                        <p style={{ color: "red" }}>Required*</p>
                      ) : (
                        ""
                      )}
                    </TableCell>

                    <TableCell>
                      {(Object.keys(err).length != 0 &&
                        data.cpc == undefined) ||
                      err?.trayLimit?.includes(data.tray_id) ||
                      (Object.keys(err).length != 0 && data.cpc == "") ||
                      err?.cpc?.includes(data.cpc) == true ||
                      (Object.keys(err).length != 0 &&
                        data.tray_id == undefined) ||
                      err?.model?.includes(data.tray_model) ||
                      err?.model?.includes(data.tray_brand) ||
                      err?.tray_id?.includes(data.tray_id) ||
                      (Object.keys(err).length != 0 && data.tray_id == "") ||
                      (Object.keys(err).length != 0 &&
                        data.warehouse == undefined) ||
                      (Object.keys(err).length != 0 && data.warehouse == "") ||
                      (Object.keys(err).length != 0 &&
                        data.tray_name == undefined) ||
                      (Object.keys(err).length != 0 && data.tray_name == "") ||
                      (Object.keys(err).length != 0 &&
                        data.tray_display == undefined) ||
                      (Object.keys(err).length != 0 &&
                        data.tray_display == "") ||
                      err?.warehouse_does_not_exist?.includes(data.tray_id) ||
                      err?.trya_id_is_duplicate?.includes(data.tray_display) ==
                        true ||
                      err?.tray_display_name_duplicate?.includes(
                        data.tray_name
                      ) == true ||
                      err?.tray_display_is_duplicate?.includes(
                        data.tray_display
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
                              handelDelete(data.tray_id, data.tray_category);
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
