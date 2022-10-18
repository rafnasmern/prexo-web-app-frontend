import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
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
import {
  axiosMisUser,
  axiosSuperAdminPrexo,
  axiosWarehouseIn,
} from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
export default function StickyHeadTable({ props }) {
  const [charginRequest, setChargingRequest] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosWarehouseIn.post("/request-for-assign/" + "send_for_bqc");
        if (res.status == 200) {
          setChargingRequest(res.data.data);
          dataTableFun();
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //api for delete a employee

 
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelDetailPage = (e, trayId) => {
    e.preventDefault();
    navigate("/request-approve/" + trayId);
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
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Qunatity</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {charginRequest.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.issued_user_name}</TableCell>
                      <TableCell>{data.warehouse}</TableCell>
                      <TableCell>{data.brand}</TableCell>
                      <TableCell>{data.model}</TableCell>
                      <TableCell>
                        {data?.items?.length}/{data.limit}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#206CE2" }}
                          onClick={(e) => {
                            handelDetailPage(e, data.code);
                          }}
                        >
                          Approve
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
