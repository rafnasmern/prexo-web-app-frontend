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
import {  axiosWarehouseIn } from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function CustomizedMenus() {
  const [item, setItem] = useState({});
  const navigate = useNavigate();
  const { pickListId } = useParams();
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const fetchData = async () => {
        try {
          let res = await axiosWarehouseIn.post("/getPickList/" + pickListId);
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
    <div style={{ marginTop: "100px", marginLeft: "20px" }}>
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
                <TableCell>BOT Tray ID</TableCell>
                <TableCell>WHT TRay ID</TableCell>
                <TableCell>UIC</TableCell>
                <TableCell>Closed Date</TableCell>
                <TableCell>VSKU ID</TableCell>
                <TableCell>MUIC</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item?.items?.map((data, index) => (
                <TableRow tabIndex={-1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data?.tray_id}</TableCell>
                  <TableCell>{data?.wht_tray}</TableCell>
                  <TableCell>{data?.uic}</TableCell>
                  <TableCell>
                    {new Date(data?.closed_time).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{data?.vendor_sku_id}</TableCell>

                  <TableCell>{data?.muic}</TableCell>
                  <TableCell>{data?.brand_name}</TableCell>
                  <TableCell>{data?.model_name}</TableCell>
                  <TableCell>{data?.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
