import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
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
import { useParams, useNavigate } from "react-router-dom";
import "yup-phone";
import { axiosWarehouseIn } from "../../../axios";

export default function DialogBox() {
  const navigate = useNavigate();
  const [trayData, setTrayData] = useState([]);
  const { trayId } = useParams();
  const [textDisable, setTextDisable] = useState(false);
  /**************************************************************************** */
  const [uic, setUic] = useState("");
  const [refresh, setRefresh] = useState(false);
  /*********************************************************** */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post(
          "/get-tray-sorting/" + trayId
        );
        if (response.status === 200) {
          setTrayData(response.data.data);
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [refresh]);

  const handelUic = async (e) => {
    if (e.target.value.length === 11) {
      try {
        let obj = {
          uic: e.target.value,
          trayId: trayId,
        };
        setTextDisable(true);
        let res = await axiosWarehouseIn.post("/check-uic", obj);
        if (res?.status === 200) {
          addActualitem(res.data.data);
        }
      } catch (error) {
        if (error.response.status == 403) {
          setTextDisable(false);
          setUic("");
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      }
    }
  };
  /************************************************************************** */
  const addActualitem = async (obj) => {
    if (trayData.limit <= trayData?.actual_items?.length) {
      alert("All Items Scanned");
    } else {
      setTextDisable(true);
      try {
        let objData = {
          trayId: trayId,
          item: obj,
        };
        let res = await axiosWarehouseIn.post("/wht-add-actual-item", objData);
        if (res.status === 200) {
          setUic("");
          setTextDisable(false);
          setRefresh((refresh) => !refresh);
        }
      } catch (error) {
        if (error.response.status === 403) {
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      }
    }
  };
  /************************************************************************** */
  const handelIssue = async (e) => {
    e.preventDefault();
    navigate(-1);
  };
  /************************************************************************** */
  const tableExpected = useMemo(() => {
    return (
      <Paper sx={{ width: "95%", overflow: "hidden", m: 1 }}>
        <Box sx={{}}>
          <Box
            sx={{
              float: "left",
              ml: 2,
            }}
          >
            <h6>Expected</h6>
          </Box>
          <Box
            sx={{
              float: "right",
              mr: 2,
            }}
          >
            <Box sx={{}}>
              <h5>Total</h5>
              <p style={{ paddingLeft: "5px", fontSize: "22px" }}>
                {
                  trayData?.items?.filter(function (item) {
                    return item.status != "Duplicate";
                  }).length
                }
                /{trayData?.limit}
              </p>
            </Box>
          </Box>
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
                <TableCell>UIC</TableCell>
                {trayData?.type_taxanomy === "MMT" &&
                trayData?.prefix == "tray-master" ? (
                  <TableCell>AWBN Number</TableCell>
                ) : (
                  <TableCell>MUIC</TableCell>
                )}
                {trayData?.type_taxanomy === "MMT" &&
                trayData?.prefix == "tray-master" ? (
                  <TableCell>Bag ID</TableCell>
                ) : (
                  <TableCell>BOT Tray</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {trayData?.items?.map((data, index) => (
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data?.uic}</TableCell>
                  {trayData?.type_taxanomy === "MMT" &&
                  trayData?.prefix == "tray-master" ? (
                    <TableCell>{data?.awbn_number}</TableCell>
                  ) : (
                    <TableCell>{data?.muic}</TableCell>
                  )}
                  {trayData?.type_taxanomy === "MMT" &&
                  trayData?.prefix == "tray-master" ? (
                    <TableCell>{data?.bag_id}</TableCell>
                  ) : (
                    <TableCell>{data?.tray_id}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }, [trayData?.items]);
  const tableActul = useMemo(() => {
    return (
      <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
        <Box sx={{}}>
          <Box
            sx={{
              float: "left",
              ml: 2,
            }}
          >
            <h6>ACTUAL</h6>
            <TextField
              sx={{ mt: 1 }}
              id="outlined-password-input"
              type="text"
              name="doorsteps_diagnostics"
              disabled={textDisable}
              label="Please Enter UIC"
              value={uic}
              onChange={(e) => {
                setUic(e.target.value);
                handelUic(e);
              }}
              inputProps={{
                style: {
                  width: "auto",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              float: "right",
              mr: 2,
            }}
          >
            <Box sx={{}}>
              <h5>Total</h5>
              <p style={{ marginLeft: "5px", fontSize: "24px" }}>
                {
                  trayData.actual_items?.filter(function (item) {
                    return item.status != "Duplicate";
                  }).length
                }
                /{trayData?.limit}
              </p>
            </Box>
          </Box>
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
                <TableCell>UIC</TableCell>
                {trayData?.type_taxanomy === "MMT" &&
                trayData?.prefix == "tray-master" ? (
                  <TableCell>AWBN Number</TableCell>
                ) : (
                  <TableCell>MUIC</TableCell>
                )}
                {trayData?.type_taxanomy === "MMT" &&
                trayData?.prefix == "tray-master" ? (
                  <TableCell>Bag ID</TableCell>
                ) : (
                  <TableCell>BOT Tray</TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {trayData?.actual_items?.map((data, index) => (
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data?.uic}</TableCell>
                  {trayData?.type_taxanomy === "MMT" &&
                  trayData?.prefix == "tray-master" ? (
                    <TableCell>{data?.awbn_number}</TableCell>
                  ) : (
                    <TableCell>{data?.muic}</TableCell>
                  )}
                  {trayData?.type_taxanomy === "MMT" &&
                  trayData?.prefix == "tray-master" ? (
                    <TableCell>{data?.bag_id}</TableCell>
                  ) : (
                    <TableCell>{data?.tray_id}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }, [trayData?.actual_items, textDisable]);
  return (
    <>
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
          <h6 style={{ marginLeft: "13px" }}>TRAY ID - {trayId}</h6>
          <h6 style={{ marginLeft: "13px" }}>
            AGENT NAME - {trayData?.issued_user_name}
          </h6>
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          {tableExpected}
        </Grid>
        <Grid item xs={6}>
          {tableActul}
        </Grid>
      </Grid>
      <div style={{ float: "right" }}>
        <Box sx={{ float: "right" }}>
          <Button
            sx={{ m: 3, mb: 9 }}
            variant="contained"
            style={{ backgroundColor: "green" }}
            onClick={(e) => {
              handelIssue(e);
            }}
          >
            Back to List
          </Button>
        </Box>
      </div>
    </>
  );
}
