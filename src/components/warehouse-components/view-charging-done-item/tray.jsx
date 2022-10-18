import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  Button,
  MenuItem,
  Menu,
} from "@mui/material";
import { axiosBot, axiosMisUser, axiosSuperAdminPrexo } from "../../../axios";
import Swal from "sweetalert2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useParams } from "react-router-dom";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
export default function StickyHeadTable({ props }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [trayData, setTrayData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [request, setRequest] = useState(false);
  const { trayId } = useParams();
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  useEffect(() => {
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const { user_name } = jwt_decode(token);
        const fetchData = async () => {
          let res = await axiosBot.post("/trayItem/" + trayId);
          if (res.status == 200) {
            setTrayData(res.data.data);
            dataTableFun();
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

  //api for delete a employee

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelViewBag = (e, id) => {
    e.preventDefault();
    navigate("/view-assigned-bag/" + id);
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 13,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                    <TableCell>IMEI</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Battery Status</TableCell>
                    <TableCell>Charge Percentage</TableCell>
                    <TableCell>Body Condiation</TableCell>
                    <TableCell>Display Condiation</TableCell>
                    <TableCell>Lock Status</TableCell>
                    <TableCell>Charging Jack Type</TableCell>
                    <TableCell>Added Date Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trayData?.actual_items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.uic}</TableCell>
                      <TableCell>{data.imei}</TableCell>
                      <TableCell>{trayData.brand}</TableCell>
                      <TableCell>{trayData.model}</TableCell>
                      <TableCell>{data.charging.battery_tatus}</TableCell>
                      <TableCell>{data.charging.charge_percentage}</TableCell>
                      <TableCell>{data.charging.body_condition}</TableCell>
                      <TableCell>{data.charging.display_condition}</TableCell>
                      <TableCell>{data.charging.lock_status}</TableCell>
                      <TableCell>{data.charging.charging_jack_type}</TableCell>
                      <TableCell>
                        {new Date(data.added_time).toLocaleString("en-GB", {
                          hour12: true,
                        })}
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
