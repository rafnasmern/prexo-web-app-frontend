import React from "react";
import { Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function Dashboard() {
  const navigate = useNavigate();

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
    navigate("/wht-tray/" + "all-wht-tray");
  };
  const handelWhtTrayIssuedSorting = (e) => {
    e.preventDefault();
    navigate("/wht-tray/" + "issued-to-sorting");
  };
  const handelViewSortingRequests = (e) => {
    e.preventDefault();
    navigate("/sorting-requests");
  };
  const handelCreatedPickList = (e) => {
    e.preventDefault();
    navigate("/all-pick-list");
  };
  const handelInUseWhtTray = (e) => {
    e.preventDefault();
    navigate("/inuse-wht-tray");
  };
  const handelReturnFromSorting = (e) => {
    e.preventDefault();
    navigate("/return-from-sorting");
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
  const handelReturnFromBqc = (e) => {
    e.preventDefault();
    navigate("/return-from-bqc");
  };
  const handelViewInuseMmtAndPmt = (e) => {
    e.preventDefault();
    navigate("/inuse-mmt-pmt");
  };
  const handelPmtReport = (e) => {
    e.preventDefault();
    navigate("/pmt-report");
  };
  const handelMmtReport = (e) => {
    e.preventDefault();
    navigate("/mmt-report");
  };
  return (
    <div style={{ marginBottom: "20px" }}>
      <h4 style={{ marginTop: "100px", marginLeft: "22px", color: "#495057" }}>
        Hi Warehouse Welcome to Prexo Dashboard
      </h4>
      <Box
        style={{
          background: "#495057",
          height: "52px",
          marginLeft: "23px",
          width: "918px",
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
                Bag issue Request
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
                Tray close Request
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
                Bag close Request
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
                  handelPicklist(e);
                }}
              >
                Bot to wht
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
                  handelViewSortingRequests(e);
                }}
              >
                Sorting Request
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
                  handelCreatedPickList(e);
                }}
              >
                WHT's Issued
              </Link>
            </Box>
            <hr /> */}
          </div>
        </Box>
        <Box
          sx={{
            cursor: "pointer",
            ml: 1,
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
                  handelWhtTrayIssuedSorting(e);
                }}
              >
                In-charging WHT
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
                  handelReturnFromSorting(e);
                }}
              >
                Return from Sorting
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
                Bot to Release
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
                  handelReturnFromBqc(e);
                }}
              >
                Return from BQC
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
                  handelViewInuseMmtAndPmt(e);
                }}
              >
                Inuse PMT/MMT
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
                  handelPmtReport(e);
                }}
              >
                PMT Report
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
                  handelMmtReport(e);
                }}
              >
                MMT Report
              </Link>
            </Box>
            <hr />
          </div>
        </Box>
      </Box>
    </div>
  );
}
