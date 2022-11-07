import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useParams } from "react-router-dom";
export default function StickyHeadTable({ props }) {
  const [item, setItem] = useState([]);
  const { vendor_sku_id, id } = useParams();
  useEffect(() => {
    try {
      const fetchData = async () => {
        let obj = {
          listId: id,
          vendor_sku_id: vendor_sku_id,
        };
        let botTray = await axiosWarehouseIn.post("/viewModelClub/", obj);
        if (botTray.status === 200) {
          setItem(botTray.data.data);
          dataTableFun();
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: 4,
          mr: 1,
          ml: 3,
        }}
      ></Box>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 8,
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
                    <TableCell>Record.No</TableCell>
                    <TableCell>MUIC</TableCell>
                    <TableCell>Brand Name</TableCell>
                    <TableCell>Model Name</TableCell>
                    <TableCell>UIC</TableCell>
                    <TableCell>BOT Tray</TableCell>
                    <TableCell>BOT Agent</TableCell>
                    <TableCell>Closed On</TableCell>
                    <TableCell>WHT Tray</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item?.[0]?.item?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item?.[0].product?.[0]?.muic}</TableCell>
                      <TableCell>
                        {item?.[0].product?.[0]?.brand_name}
                      </TableCell>
                      <TableCell>
                        {item?.[0].product?.[0]?.model_name}
                      </TableCell>
                      <TableCell>{data.uic}</TableCell>
                      <TableCell>{data.tray_id}</TableCell>
                      <TableCell>{data.bot_agent}</TableCell>
                      <TableCell>
                        {" "}
                        {new Date(data.closed_time).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>{data.wht_tray}</TableCell>
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
