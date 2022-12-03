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
  Button,
} from "@mui/material";
import { axiosSortingAgent } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
export default function StickyHeadTable({ props }) {
  const [mmtTray, setMmttray] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const { user_name } = jwt_decode(token);
        const fetchData = async () => {
          let res = await axiosSortingAgent.post(
            "/getAssignedFromTray/" + user_name
          );
          if (res.status == 200) {
            setMmttray(res.data.data);
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

  //api for delete a employee

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelApprove = (e, id) => {
    e.preventDefault();
    navigate("/start-mmt-merge/" + id);
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
            mb: 2,
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table
                style={{ width: "100%" }}
                id="example"
                P
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>S.NO</TableCell>
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Sorting Agent</TableCell>
                    <TableCell>To Tray</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mmtTray.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>
                        {data.items.length + "/" + data.limit}
                      </TableCell>
                      <TableCell>{data.issued_user_name}</TableCell>
                      <TableCell>{data.to_mmt_merge}</TableCell>
                      <TableCell>{data.sort_id}</TableCell>
                      <TableCell>
                        {new Date(data.assigned_date).toLocaleString("en-GB", {
                          hourCycle: "h12",
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          sx={{ m: 1 }}
                          type="submit"
                          variant="contained"
                          style={{ backgroundColor: "green" }}
                          onClick={(e) => {
                            handelApprove(e, data.code);
                          }}
                        >
                          Merge
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
