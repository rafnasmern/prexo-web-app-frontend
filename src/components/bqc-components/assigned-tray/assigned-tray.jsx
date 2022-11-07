import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  IconButton,
  TablePagination,
  TableRow,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Grid,
  CloseIcon,
} from "@mui/material";
import { axiosBqc, axiosCharging } from "../../../axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function StickyHeadTable({ props }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [infraData, setInfraData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [request, setRequest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const { user_name } = jwt_decode(token);
        const fetchData = async () => {
          let res = await axiosBqc.post("/assigned-tray/" + user_name);
          if (res.status == 200) {
            setInfraData(res.data.data);
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
  const handelBqcIn = (e, id) => {
    e.preventDefault();
    navigate("/bqc-in/" + id);
  };
  const handelBqcDone = (e, id) => {
    e.preventDefault();
    navigate("/bqc-out/" + id);
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
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Tray Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infraData.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.brand}</TableCell>
                      <TableCell>{data.model}</TableCell>
                      <TableCell>
                        {data.items.length + "/" + data.limit}
                      </TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>
                        {new Date(data.assigned_date).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {data.sort_id == "Issued to BQC" ? (
                          <Button
                            sx={{ m: 1 }}
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: "#206CE2" }}
                            onClick={(e) => {
                              handelBqcIn(e, data.code);
                            }}
                          >
                            BQC IN
                          </Button>
                        ) : (
                          <Button
                            sx={{ m: 1 }}
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: "green" }}
                            onClick={(e) => {
                              handelBqcDone(e, data.code);
                            }}
                          >
                            BQC Done
                          </Button>
                        )}
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
