import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  Dialog,
  TableContainer,
  TableHead,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TablePagination,
  TableRow,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { axiosSuperAdminPrexo } from "../../../axios";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [whtTray, setWhtTray] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        $("#example").DataTable().destroy();
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let response = await axiosSuperAdminPrexo.post("/getInuseWht");
          if (response.status === 200) {
            setWhtTray(response.data.data);
            dataTableFun();
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

  const handelViewItem = (id) => {
    navigate("/wht-tray-item/" + id);
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /***************************************SELECT CHECKBOX******************************************/
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(whtTray.map((li, index) => li.code));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };
  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  /* READY FOR CHARGING */
  const handelReadyForCharging = async () => {
    try {
      let obj = {
        ischeck: isCheck,
      };
      let res = await axiosSuperAdminPrexo.post("/ready-for-charging", obj);
      if (res.status === 200) {
        alert(res.data.message);
        window.location.reload(false);
      }
    } catch (error) {
      if (error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };
  /***************************************CHECKBOX LABEL****************************************** */
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  /******************************************************************************************* */
  /*****************************************ASSING TO CHARGING REQUEST WILL GO TO MIS PANEL****** */

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
        <Button
          variant="contained"
          // fullWidth
          sx={{ m: 1, mt: 3 }}
          disabled={isCheck.length === 0}
          style={{ backgroundColor: "#206CE2" }}
          onClick={(e) => {
            handelReadyForCharging(e);
          }}
        >
          Ready For Charging
        </Button>
      </Box>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 1,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "auto" }}>
            <TableContainer>
              <Table
                id="example"
                style={{ width: "100%" }}
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Record.NO</TableCell>
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Tray Category</TableCell>
                    <TableCell>Tray Brand</TableCell>
                    <TableCell>Tray Model</TableCell>
                    <TableCell>Tray Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Tray Display</TableCell>
                    <TableCell>status</TableCell>
                    <TableCell>Creation Time</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {whtTray.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>
                        {" "}
                        <Checkbox
                          {...label}
                          onClick={(e) => {
                            handleClick(e);
                          }}
                          id={data.code}
                          key={data.code}
                          checked={isCheck.includes(data.code)}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.warehouse}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>{data.brand}</TableCell>
                      <TableCell>{data.model}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>
                        {" "}
                        {data.items.length}/{data.limit}
                      </TableCell>
                      <TableCell>{data.display}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>
                        {new Date(data.created_at).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          sx={{
                            m: 1,
                          }}
                          variant="contained"
                          onClick={() => handelViewItem(data.code)}
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
        </Box>
      </Box>
    </>
  );
}
