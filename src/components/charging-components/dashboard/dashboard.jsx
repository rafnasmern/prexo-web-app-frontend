import React, { useEffect, useState } from "react";
import { FormLabel, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosMisUser } from "../../../axios";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const handelViewAssignedTray = (e) => {
    e.preventDefault();
    navigate("/view-assigned-tray-charging");
  };

  return (
    <div>
      <h4 style={{ marginTop: "100px", marginLeft: "27px", color: "#495057" }}>
        Hi Charging! Welcome to Prexo Dashboard
      </h4>
      <Box
        sx={{
          cursor: "pointer",
          m: 3,
          width: 300,
          boxShadow: 2,
          height: "113px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box style={{ background: "#495057", height: "52px" }}>
          <h5 style={{ color: "#FFFFFF", margin: "10px", textAlign: "center", paddingTop: "2px" }}>Dashboard</h5>
        </Box>
        <div style={{ margin: "12px" }}>
          <Box style={{ marginBottom: "12px", marginTop: "20" }}>
          <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelViewAssignedTray(e);
              }}
            >
              Tray
            </Link>
          </Box>
          <hr />
        </div>
      </Box>
    </div>
  );
}
