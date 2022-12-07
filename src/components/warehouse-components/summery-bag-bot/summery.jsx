import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Dialog,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate, useParams } from "react-router-dom";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function StickyHeadTable({ props }) {
  const [bot, setBot] = useState([]);
  const navigate = useNavigate();
  const { bagId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
    try {
        let botTray = await axiosWarehouseIn.post(
          "/summeryBotTrayBag/" + bagId
        );
        if (botTray.status == 200) {
          setBot(botTray.data.data);
          dataTableFun();
        }
      } catch (error) {
        if (error.response.status === 403) {
          alert(error.response.data.message);
          navigate(-1);
        } else {
          alert(error);
        }
      }
    };
    fetchData();
  }, []);

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

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
                    <TableCell>S.NO</TableCell>
                    <TableCell>UIC</TableCell>
                    <TableCell>Tracking Id</TableCell>
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Tray Type</TableCell>
                    <TableCell>Tray Status</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bot?.[0]?.delivery?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.uic_code?.code}</TableCell>
                      <TableCell>{data?.tracking_id}</TableCell>
                      <TableCell>{data.tray_id}</TableCell>
                      <TableCell>{data.tray_type}</TableCell>
                      <TableCell>{data.tray_status}</TableCell>
                      <TableCell>{bot?.[0]?.description}</TableCell>
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
