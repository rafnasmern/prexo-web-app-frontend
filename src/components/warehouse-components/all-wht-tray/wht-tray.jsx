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
} from "@mui/material";
import { axiosSuperAdminPrexo, axiosWarehouseIn } from "../../../axios";
import Swal from "sweetalert2";
import Checkbox from "@mui/material/Checkbox";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [whtTray, setWhtTray] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post("/whtTray");
        if (response.status === 200) {
          setWhtTray(response.data.data);
          dataTableFun();
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  const handelViewItem = (id) => {
    navigate("/wht-tray-item/" + id);
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  
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
          <Paper sx={{ width: "100%", overflow: "auto" }}>
            <TableContainer>
              <Table
                id="example"
                style={{ width: "100%" }}
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                   
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