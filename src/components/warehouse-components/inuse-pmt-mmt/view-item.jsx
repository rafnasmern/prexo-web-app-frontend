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
import { axiosBot } from "../../../axios";
import { useNavigate, useParams } from "react-router-dom";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
export default function StickyHeadTable({ props }) {
  const [infraData, setInfraData] = useState([]);
  const { trayId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const { user_name } = jwt_decode(token);
        const fetchData = async () => {
          let res = await axiosBot.post("/trayItem/" + trayId);
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
            mb:2
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
                    <TableCell>IMEI</TableCell>
                    <TableCell>BagId</TableCell>
                    <TableCell>Body Damage</TableCell>
                    <TableCell>Other Info</TableCell>

                    <TableCell>Added Date Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infraData?.items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.uic}</TableCell>
                      <TableCell>{data.imei}</TableCell>
                      <TableCell>{data.bag_id}</TableCell>
                      <TableCell>{data.body_damage}</TableCell>
                      <TableCell>
                        {data?.stickerOne +
                          "," +
                          data?.stickerTwo +
                          "," +
                          data?.stickerThree +
                          "," +
                          data?.stickerFour}
                      </TableCell>
                      <TableCell>
                        {new Date(data.added_time).toLocaleString("en-GB", {
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
