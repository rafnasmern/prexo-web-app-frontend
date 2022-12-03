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
import { axiosMisUser } from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [bagData, setbagData] = useState({});
  const { bagId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let response = await axiosMisUser.post(
            "/view-bag-item/" + location + "/" + bagId
          );
          if (response.status === 200) {
            setbagData(response.data.data);
            dataTableFun();
          }
        }
      } catch (error) {
        alert(error);
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
  /****************************************************************** */
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
                    <TableCell>Tracking Id</TableCell>
                    <TableCell>Order Id</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Added Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bagData?.items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.awbn_number}</TableCell>
                      <TableCell>{data.order_id}</TableCell>
                      <TableCell>
                        {new Date(data.order_date).toLocaleString("en-GB", {
                          hour12: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(data.sotckin_date).toLocaleString("en-GB", {
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
