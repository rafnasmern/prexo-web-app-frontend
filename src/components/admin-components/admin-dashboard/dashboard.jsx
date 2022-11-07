import React, { useState, useEffect } from "react";
import { FormLabel, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosSuperAdminPrexo } from "../../../axios";
import GroupIcon from "@mui/icons-material/Group";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ShoppingBagSharpIcon from "@mui/icons-material/ShoppingBagSharp";
import LuggageIcon from "@mui/icons-material/Luggage";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
export default function Dashboard() {
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
    } else {
      navigate("/");
    }
  }, []);
  const [dashboardData, setDashboardData] = useState({});
  const navigate = useNavigate();
  const handelTray = (e) => {
    e.preventDefault();
    navigate("/tray-master");
  };
  const handelBag = (e) => {
    e.preventDefault();
    navigate("/bag-master");
  };
  const handelProducts = (e) => {
    e.preventDefault();
    navigate("/products");
  };
  const handelBrands = (e) => {
    e.preventDefault();
    navigate("/brands");
  };
  const handelWarehouse = (e) => {
    e.preventDefault();
    navigate("/warehouse");
  };
  const handelLocation = (e) => {
    e.preventDefault();
    navigate("/location");
  };

  const handelUsers = (e) => {
    e.preventDefault();
    navigate("/users");
  };
  const handelTrack = (e) => {
    e.preventDefault();
    navigate("/track-item");
  };

  return (
    <Box>
      <h4 style={{ marginTop: "100px", marginLeft: "27px", color: "#495057" }}>
        Hi Admin! Welcome to Prexo Dashboard
      </h4>

      <Box
        sx={{
          cursor: "pointer",
          ml: 3,
          mt: 2,
          width: 300,
          boxShadow: 2,
          height: "554px",
          backgroundColor: "#FFFF",
          mb: 2,
        }}
      >
        <Box style={{ background: "#495057", height: "52px" }}>
          <h5
            style={{ color: "#FFFFFF", textAlign: "center", paddingTop: "2px" }}
          >
            Dashboard
          </h5>
        </Box>
        <div style={{ margin: "12px" }}>
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <GroupIcon sx={{ marginTop: "4px" }} />
            <Link
              onClick={(e) => {
                handelUsers(e);
              }}
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
            >
              Users
            </Link>
          </Box>
          <hr />
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <LocationOnIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelLocation(e);
              }}
            >
              Location
            </Link>
          </Box>
          <hr />
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <WarehouseIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelWarehouse(e);
              }}
            >
              Warehouse
            </Link>
          </Box>
          <hr />
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <BrandingWatermarkIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelBrands(e);
              }}
            >
              Brands
            </Link>
          </Box>
          <hr />
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <ProductionQuantityLimitsIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelProducts(e);
              }}
            >
              Products
            </Link>
          </Box>
          <hr />
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <ShoppingBagSharpIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelBag(e);
              }}
            >
              Bags
            </Link>
          </Box>
          <hr />
          <Box
            style={{ marginBottom: "12px", marginTop: "20" }}
            sx={{ display: "flex", flexDirection: "start" }}
          >
            <LuggageIcon sx={{ marginTop: "4px" }} />
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
              Tray
            </Link>
          </Box>
          <hr />
          <Box style={{ marginBottom: "12px", marginTop: "20" }}>
            <TrendingFlatIcon sx={{ marginTop: "4px" }} />
            <Link
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "20px",
                marginLeft: "5px",
              }}
              onClick={(e) => {
                handelTrack(e);
              }}
            >
              Track Item
            </Link>
          </Box>
          <hr />
        </div>
      </Box>
    </Box>
  );
}
