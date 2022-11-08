import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { axiosMisUser, axiosWarehouseIn } from "../../../axios";
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function CustomizedMenus() {
  const [item, setItem] = useState({});
  const navigate = useNavigate();
  const { trayId } = useParams();

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const { location } = jwt_decode(admin);
      const fetchData = async () => {
        try {
          let res = await axiosMisUser.post("/assign-for-sorting/" + trayId);
          if (res.status == 200) {
            setItem(res.data.data);
            dataTableFun();
          }
        } catch (error) {
          alert(error);
        }
      };
      fetchData();
    } else {
      navigate("/");
    }
  }, []);

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /******************************PICK LIST VIEW DETAIL**************************************** */
  const handelViewDetailClub = (e, muic) => {
    e.preventDefault();
    navigate("/view-club-item-bot/" + muic + "/" +  item.code);
  };
  const handelAssignWht = (e, muic) => {
    navigate("/bot-club-to-wht-assignment/" + muic +  "/" +  item.code);
  };

  return (
    <div
      style={{ marginTop: "100px", marginLeft: "20px", marginRight: "20px" }}
    >
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <TableContainer>
          <Table
            id="example"
            style={{ width: "100%" }}
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Record.NO</TableCell>

                <TableCell>MUIC</TableCell>
                <TableCell>Brand Name</TableCell>
                <TableCell>Model Name</TableCell>
                <TableCell>IN BOT</TableCell>
                {/* <TableCell>In WHT</TableCell> */}
                {/* <TableCell>IN Picklist</TableCell> */}
                <TableCell>WHT Tray</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item?.temp_array?.map((data, index) => (
                <TableRow tabIndex={-1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.muic}</TableCell>
                  <TableCell>{data.brand}</TableCell>
                  <TableCell>{data.model}</TableCell>
                  <TableCell>{data.item.length}</TableCell>
                  <TableCell>{data?.wht_tray?.toString()}</TableCell>

                  <TableCell>
                    <Button
                      sx={{
                        m: 1,
                      }}
                      variant="contained"
                      style={{ backgroundColor: "#206CE2" }}
                      onClick={(e) => {
                        handelViewDetailClub(e,data.muic);
                      }}
                    >
                      View Item
                    </Button>

                    <Button
                      sx={{
                        m: 1,
                      }}
                      variant="contained"
                      style={{ backgroundColor: "green" }}
                      onClick={(e) => {
                        handelAssignWht(e, data.muic);
                      }}
                    >
                      Assign Tray
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
