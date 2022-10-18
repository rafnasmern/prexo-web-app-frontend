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
  const handelSearch = (e) => {
    e.preventDefault();
    navigate("/search");
  };
  const handelScan = (e) => {
    e.preventDefault();
    navigate("/stock-in-warehouse");
  };
  const handelBagIssue = (e) => {
    e.preventDefault();
    navigate("/bag-issue-request");
  };
  const handelTrayCloseRequest = (e) => {
    e.preventDefault();
    navigate("/tray-close-request");
  };
  const handelBagCloseRequest = (e) => {
    e.preventDefault();
    navigate("/bot-tray-close");
  };
  const handelPicklist = (e) => {
    e.preventDefault();
    navigate("/picklist-request");
  };
  const handelWhtTray = (e) => {
    e.preventDefault();
    navigate("/wht-tray");
  };
  const handelCreatedPickList = (e) => {
    e.preventDefault();
    navigate("/all-pick-list");
  };
  const handelInUseWhtTray = (e) => {
    e.preventDefault();
    navigate("/inuse-wht-tray");
  };
  const handelBotRelease = (e) => {
    e.preventDefault();
    navigate("/bot-release");
  };
  const handelChargingRequest = (e) => {
    e.preventDefault();
    navigate("/charging-request");
  };
  const handelTraysInCharging = (e) => {
    e.preventDefault();
    navigate("/trays-in-charging");
  };
  const handelTrayReturnFromCharging = (e) => {
    e.preventDefault();
    navigate("/tray-return-from-charging");
  };
  const handelBqcRequest = (e) => {
    e.preventDefault();
    navigate("/bqc-request");
  };
  return (
    <div>
      <h4 style={{ marginTop: "100px", marginLeft: "22px", color: "#495057" }}>
        Hi Warehouse Welcome to Prexo Dashboard
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
            height: "500px",
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
                  handelSearch(e);
                }}
              >
                Search
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
                  handelScan(e);
                }}
              >
                Scan
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
                  handelBagIssue(e);
                }}
              >
                Bag issue request
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
                  handelTrayCloseRequest(e);
                }}
              >
                Tray close request
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
                  handelBagCloseRequest(e);
                }}
              >
                Bag close request
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
                  handelWhtTray(e);
                }}
              >
                Wht tray
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
                  handelPicklist(e);
                }}
              >
                Bot to wht
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
                  handelCreatedPickList(e);
                }}
              >
                Picklist
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
            height: "374px",
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
                  handelInUseWhtTray(e);
                }}
              >
                Inuse wht
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
                  handelBotRelease(e);
                }}
              >
                Bot to release
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
                  handelChargingRequest(e);
                }}
              >
                Charging Request Received
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
                  handelTraysInCharging(e);
                }}
              >
                Trays in Charging
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
                  handelTrayReturnFromCharging(e);
                }}
              >
                Return from Charging
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
                  handelBqcRequest(e);
                }}
              >
                BQC Request Received
              </Link>
            </Box>
            <hr />
          </div>
        </Box>
      </Box>
    </div>
  );
}
