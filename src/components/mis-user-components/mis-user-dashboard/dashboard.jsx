import React, { useEffect, useState } from "react";
import { FormLabel, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";

export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin == null) {
      navigate("/");
    }
  }, []);
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
  const handelAssignToBqc = (e) => {
    e.preventDefault();
    navigate("/assign-to-bqc");
  };
  const handelAssignToAudti = (e) => {
    e.preventDefault();
    navigate("/assign-to-audit");
  };
  const handelBotToWht = (e) => {
    e.preventDefault();
    navigate("/bot-to-wht");
  };
  const handelSortingRequests = (e) => {
    e.preventDefault();
    navigate("/view-sorting-requests");
  };
  const handelWhtTrayMerge = (e) => {
    e.preventDefault();
    navigate("/wht-tray-merge");
  };
  const handelBagTransfer = (e) => {
    e.preventDefault();
    navigate("/bag-transfer");
  };
  const handelReceive = (e) => {
    e.preventDefault();
    navigate("/bag-receive");
  };
  const handelMmtMerge =(e)=>{
    e.preventDefault();
    navigate("/mmt-merge");
  }
  return (
    <div style={{ marginBottom: "20px" }}>
      <h4 style={{ marginTop: "100px", marginLeft: "27px", color: "#495057" }}>
        Hi MIS! Welcome to Prexo Dashboard
      </h4>
      <Box
        style={{
          background: "#495057",
          height: "52px",
          marginLeft: "23px",
          width: "610px",
          marginTop: "19px",
        }}
      >
        <h5
          style={{ color: "#FFFFFF", textAlign: "center", paddingTop: "2px" }}
        >
          Dashboard
        </h5>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            cursor: "pointer",
            ml: 3,
            width: 300,
            boxShadow: 2,
            height: "437px",
            backgroundColor: "#FFFFFF",
          }}
        >
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
                  handelOrders(e);
                }}
              >
                Orders
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
                  handelDelivery(e);
                }}
              >
                Delivery
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
                  handelReconSheet(e);
                }}
              >
                Recon Sheet
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
                  handelUicDownload(e);
                }}
              >
                UIC Download
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
                  handelAssignBot(e);
                }}
              >
                Assign To BOT
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
                  handelBotToWht(e);
                }}
              >
                BOT to WHT
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
                  handelSortingRequests(e);
                }}
              >
                Sorting Requests
              </Link>
            </Box>
            <hr />
          </div>
        </Box>
        <Box
          sx={{
            cursor: "pointer",
            ml: 1,
            width: 300,
            boxShadow: 2,
            height: "310px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div style={{ margin: "12px" }}>
            {/* <Box
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
                  handelWhtTrayMerge(e);
                }}
              >
                WHT Merge
              </Link>
            </Box>
            <hr /> */}
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
                  handelAssignToCharging(e);
                }}
              >
                Assign For Charging
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
                  handelAssignToBqc(e);
                }}
              >
                Assign for BQC
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
                  handelAssignToAudti(e);
                }}
              >
                Assign for Audit
              </Link>
            </Box>
            <hr />
            {/* <Box
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
                  handelBagTransfer(e);
                }}
              >
                Bag Transfer
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
                  handelReceive(e);
                }}
              >
                Bag Recieve
              </Link>
            </Box>
            <hr /> */}
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
                  handelMmtMerge(e);
                }}
              >
                MMT Merge
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
                  handelTrackDeliveredItem(e);
                }}
              >
                Track Item
              </Link>
            </Box>
            <hr />
          </div>
        </Box>
      </Box>
    </div>
  );
}
