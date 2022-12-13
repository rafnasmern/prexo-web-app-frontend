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
import { axiosSuperAdminPrexo } from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useParams } from "react-router-dom";
/************************************************************************** */
export default function MastersHistoryTable() {
  const [mastersEditHistory, setMastersEditHistory] = useState([]);
  const { trayId } = useParams();

  useEffect(() => {
    try {
      const fetchData = async () => {
        let response = await axiosSuperAdminPrexo.post(
          "/mastersEditHistory/" + trayId
        );
        if (response.status === 200) {
          setMastersEditHistory(response.data.data);
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
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 17,
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
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Record.NO</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Tray Category</TableCell>
                    <TableCell>Tray Brand</TableCell>
                    <TableCell>Tray Model</TableCell>
                    <TableCell>Tray Name</TableCell>
                    <TableCell>Tray Limit</TableCell>
                    <TableCell>Tray Display</TableCell>
                    <TableCell>Edited Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mastersEditHistory.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.cpc}</TableCell>
                      <TableCell>{data.warehouse}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>{data.brand}</TableCell>
                      <TableCell>{data.model}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.limit}</TableCell>
                      <TableCell>{data.display}</TableCell>
                      <TableCell>
                        {new Date(data.created_at).toLocaleString("en-GB", {
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
