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
import { axiosMisUser, axiosWarehouseIn } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate, useParams } from "react-router-dom";
export default function StickyHeadTable({ props }) {
  const [botTray, setBotTray] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { botTrayId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          let { location } = jwt_decode(admin);
          let response = await axiosWarehouseIn.post(
            "/get-tray-sorting-requests/" + botTrayId
          );
          if (response.status === 200) {
            setBotTray(response.data.data);
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
      for (let x of botTray) {
        if (x.items.length !== x.actual_items.length) {
          flag = true;
          break;
        }
      }
      if (flag == false) {
        let obj = {
          allTray: botTray,
          type: type,
          username: botTray[0]?.issued_user_name,
        };
        let res = await axiosWarehouseIn.post(
          "/assign-to-sorting-confirm",
          obj
        );
        if (res.status == 200) {
          alert(res.data.message);
          setLoading(false);
          navigate("/sorting-requests");
        }
      } else {
        setLoading(false);
        alert("Please Issue all Tray");
      }
    } catch (error) {
      alert(error);
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
            {new Date(botTray[0]?.status_change_time).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </h6>
          <h6>Agent Name- {botTray[0]?.issued_user_name}</h6>
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
                  {botTray.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.type_taxanomy}</TableCell>
                      <TableCell>
                        {data.items.length}/{data.limit}
                      </TableCell>
                      <TableCell>
                        {data.sort_id ==
                          "Sorting Request Sent To Warehouse" &&
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
                        {data.type_taxanomy == "BOT" ||
                        (data.type_taxanomy == "WHT" &&
                          data.items.length !== 0) ? (
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
                              : " Issue Now"}
                          </Button>
                        ) : null}
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
            {botTray?.[0]?.sort_id == "Assigned to sorting agent" ? (
              <Button
                sx={{ m: 3, mb: 9 }}
                variant="contained"
                disabled={
                  botTray?.[0]?.items.length !==
                  botTray?.[0]?.actual_items.length
                    ? true
                    : loading == true
                    ? true
                    : false
                }
                style={{ backgroundColor: "green" }}
                onClick={(e) => {
                  handelIssue(e, "Issued to sorting agent");
                }}
              >
                Handover Done
              </Button>
            ) : botTray?.[0]?.sort_id !== "Issued to sorting agent" ? (
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
            ) : null}
          </Box>
        </div>
      </Box>
    </>
  );
}
