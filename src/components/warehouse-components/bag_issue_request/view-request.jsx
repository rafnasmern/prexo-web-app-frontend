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
  Button,
  Container,
  Menu,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

export default function StickyHeadTable({ props }) {
  const [infraData, setInfraData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        setLoading(false);
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosWarehouseIn.post("/getRequests/" + location);
          if (res.status == 200) {
            setInfraData(res.data.data);
            setLoading(true);
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
  const handelDetailPage = (e, bagId) => {
    e.preventDefault();
    navigate("/request-detail-page/" + bagId);
  };
  return (
    <>
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
        {loading === false ? (
          <Container>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                pt: 30,
              }}
            >
              <CircularProgress />
              <p style={{ paddingTop: "10px" }}>Loading...</p>
            </Box>
          </Container>
        ) : (
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
                    <TableCell>Bag Id</TableCell>
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Max</TableCell>
                    <TableCell>Valid</TableCell>
                    <TableCell>Invalid</TableCell>
                    <TableCell>Duplicate</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infraData.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.issued_user_name}</TableCell>
                      <TableCell>{data.warehouse}</TableCell>
                      <TableCell>{data.limit}</TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Valid";
                          }).length
                        }
                      </TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Invalid";
                          }).length
                        }
                      </TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Duplicate";
                          }).length
                        }
                      </TableCell>
                      <TableCell>{data?.items?.length}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#206CE2" }}
                          onClick={(e) => {
                            handelDetailPage(e, data.code);
                          }}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </>
  );
}
