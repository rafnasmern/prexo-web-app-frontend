import React, { useEffect, useState } from "react";
import { FormLabel, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosWarehouseIn } from "../../../axios";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosWarehouseIn.get("/dashboard");
        if (res.status == 200) {
          setDashboardData(res.data.data);
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
  const handelSortingRequests = (e) => {
    e.preventDefault();
    navigate("/view-assigned-sorting-requests");
  };
  const handelTray = (e) => {
    e.preventDefault();
    navigate("/sorting-view-assigned-wht");
  };
  return (
    <div>
      <h4 style={{ marginTop: "100px", marginLeft: "27px", color: "#495057" }}>
        Hi Sorting Agent Welcome to Prexo Dashboard
      </h4>
      <Box
        sx={{
          cursor: "pointer",
          m: 3,
          width: 300,
          boxShadow: 2,
          height: "172px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div style={{ background: "#495057", height: "52px" }}>
          <h5
            style={{ color: "#FFFFFF", textAlign: "center", paddingTop: "2px" }}
          >
            Dashboard
          </h5>
        </div>
        <div style={{ margin: "12px" }}>
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelSortingRequests(e);
              }}
            >
              Sorting Requests
            </Link>
          </Box>
          <hr />
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelTray(e);
              }}
            >
              WHT Tray
            </Link>
          </Box>
          <hr />
        </div>
      </Box>
    </div>
  );
}
