import React, { useEffect, useState } from "react";
import { FormLabel, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosMisUser } from "../../../axios";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const handelOrders = (e) => {
    e.preventDefault();
    navigate("/orders");
  };
  const handelDelivery = (e) => {
    e.preventDefault();
    navigate("/delivery");
  };
  const handelReconSheet = (e) => {
    e.preventDefault();
    navigate("/recon-sheet");
  };
  const handelUicDownload = (e) => {
    e.preventDefault();
    navigate("/uic-download");
  };
  const handelAssignBot = (e) => {
    e.preventDefault();
    navigate("/assign-to-bot");
  };
  const handelTrackDeliveredItem = (e) => {
    e.preventDefault();
    navigate("/track-delivered-item");
  };
  const handelAssignToCharging = (e) => {
    e.preventDefault();
    navigate("/assign-to-charging");
  };
  const handelPickupList = (e) => {
    e.preventDefault();
    navigate("/create-pickup-list");
  };
  return (
    <div>
      <h4 style={{ marginTop: "100px", marginLeft: "27px", color: "#495057" }}>
        Hi MIS! Welcome to Prexo Dashboard
      </h4>
      <Box
        sx={{
          cursor: "pointer",
          m: 3,
          width: 300,
          boxShadow: 2,
          height: "489px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div style={{ background: "#495057", height: "52px" }}>
          <h5 style={{ color: "#FFFFFF", textAlign: "center", paddingTop: "2px" }}>Dashboard</h5>
        </div>
        <div style={{ margin: "12px" }}>
          <Box style={{ marginBottom: "12px", marginTop: "20" }}  sx={{ display: "flex", flexDirection: "start" }}>
            <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelOrders(e);
              }}
            >
              Orders
            </Link>
          </Box>
          <hr />
          <Box style={{ marginBottom: "12px", marginTop: "20" }} sx={{ display: "flex", flexDirection: "start" }}>
          <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelDelivery(e);
              }}
            >
              Delivery
            </Link>
          </Box>
          <hr />
          <Box style={{ marginBottom: "12px", marginTop: "20" }} sx={{ display: "flex", flexDirection: "start" }}>
          <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelReconSheet(e);
              }}
            >
              Recon Sheet
            </Link>
          </Box>
          <hr />
          <Box style={{ marginBottom: "12px", marginTop: "20" }} sx={{ display: "flex", flexDirection: "start" }}>
          <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelUicDownload(e);
              }}
            >
              UIC Download
            </Link>
          </Box>
          <hr />
          <Box style={{ marginBottom: "12px", marginTop: "20" }} sx={{ display: "flex", flexDirection: "start" }}>
          <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelAssignBot(e);
              }}
            >
              Assign To BOT
            </Link>
          </Box>
          <hr />
          <Box style={{ marginBottom: "12px", marginTop: "20" }} sx={{ display: "flex", flexDirection: "start" }}>
          <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelAssignToCharging(e);
              }}
            >
              Assign For Charging
            </Link>
          </Box>
          <hr />
          <Box style={{ marginBottom: "12px", marginTop: "20" }} sx={{ display: "flex", flexDirection: "start" }}>
          <ArrowRightIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelTrackDeliveredItem(e);
              }}
            >
              Track Item
            </Link>
          </Box>
          <hr />
        </div>
      </Box>
    </div>
  );
}
