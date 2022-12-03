import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  Button,
} from "@mui/material";
import { axiosWarehouseIn } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate, useParams } from "react-router-dom";
export default function StickyHeadTable({ props }) {
  const [mmtTray, setMmtTray] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mmtTrayId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let response = await axiosWarehouseIn.post(
            "/viewTrayFromAndTo/" + location + "/" + mmtTrayId
          );
          if (response.status === 200) {
            setMmtTray(response.data.data);
            dataTableFun();
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  const handelExvsAt = (e, code) => {
    e.preventDefault();
    navigate("/sorting-request-item-verifiy/" + code);
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /******************************************************************************* */
  const handelIssue = async (e, type) => {
    try {
      setLoading(true);
      let flag = false;
      for (let x of mmtTray) {
        if (x.items.length !== x.actual_items.length) {
          flag = true;
          break;
        }
      }
      if (flag == false) {
        let obj = {
          fromTray: mmtTray[0].code,
          toTray: mmtTray[1].code,
          username: mmtTray[0]?.issued_user_name,
        };
        let res = await axiosWarehouseIn.post("/mmtTraySendToSorting", obj);
        if (res.status == 200) {
          alert(res.data.message);
          setLoading(false);
          navigate("/mmt-merge-request");
        }
      } else {
        setLoading(false);
        alert("Please Issue all Tray");
      }
    } catch (error) {
      if (error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          m: 3,
          mt: 13,
        }}
      >
        <Box
          sx={{
            float: "right",
          }}
        >
          <h6>
            Assigned Date -{" "}
            {new Date(mmtTray[0]?.status_change_time).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </h6>
          <h6>Agent Name- {mmtTray[0]?.issued_user_name}</h6>
        </Box>

        <Box
          sx={{
            mt: 10,
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
                    <TableCell>Tray Id</TableCell>
                    <TableCell>Tray Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mmtTray.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>
                        {data.items.length}/{data.limit}
                      </TableCell>
                      <TableCell>
                        {data.sort_id == "Sorting Request Sent To Warehouse" &&
                        data.type_taxanomy == "BOT"
                          ? "Not Issued"
                          : data.type_taxanomy == "WHT" &&
                            data.items.length !== 0
                          ? "Not Issued"
                          : data.type_taxanomy == "WHT"
                          ? "New WHT"
                          : "Issued"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          disabled={
                            data.items.length === data.actual_items.length
                              ? true
                              : false
                          }
                          onClick={(e) => handelExvsAt(e, data.code)}
                          style={{ backgroundColor: "green" }}
                          component="span"
                        >
                          {data.items.length === data.actual_items.length
                            ? "Scanned"
                            : "Issue"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
        <div style={{ float: "right" }}>
          <Box sx={{ float: "right" }}>
            <Button
              sx={{ m: 3, mb: 9 }}
              variant="contained"
              disabled={loading}
              style={{ backgroundColor: "green" }}
              onClick={(e) => {
                handelIssue(e, "Assigned to sorting agent");
              }}
            >
              Assign To Agent
            </Button>
          </Box>
        </div>
      </Box>
    </>
  );
}
