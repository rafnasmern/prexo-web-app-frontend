import React, { useState, useEffect } from "react";
import {
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { axiosWarehouseIn, axiosMisUser } from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function CustomizedMenus() {
  const [item, setItem] = useState({});
  const navigate = useNavigate();
  const { muic,trayId } = useParams();
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const fetchData = async () => {
        try {
          let res = await axiosMisUser.post(
            "/view-bot-clubed-data-model/" + muic + "/" + trayId
          );
          if (res.status === 200) {
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

  return (
    <div style={{ marginTop: "100px", marginLeft: "20px",marginRight:"20px" }}>
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
                <TableCell>UIC</TableCell>
                <TableCell>IMEI</TableCell>
                <TableCell>MUIC</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Bag Id</TableCell>
                <TableCell>BOT Agent</TableCell>
                <TableCell>BOT Tray</TableCell>
                <TableCell>Added Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item[0]?.item?.map((data, index) => (
                <TableRow tabIndex={-1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data?.uic}</TableCell>
                  <TableCell>{data?.imei}</TableCell>
                  <TableCell>{item[0].muic}</TableCell>
                  <TableCell>{item[0].brand}</TableCell>
                  <TableCell>{item[0].model}</TableCell>
                  <TableCell>{data?.bag_id}</TableCell>
                  <TableCell>{data?.user_name}</TableCell>
                  <TableCell>{data?.tray_id}</TableCell>
                  <TableCell>
                    {new Date(data?.added_time).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
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
