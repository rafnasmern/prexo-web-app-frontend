import React, { useState, useEffect, useMemo } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import {
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, axiosSuperAdminPrexo } from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [item, setItem] = useState([]);
  const [deliverdBut, setDeliveredBut] = useState(false);
  const [noOrders, setNoOrders] = useState(false);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const { location } = jwt_decode(admin);
      const fetchData = async () => {
        try {
          let res = await axiosSuperAdminPrexo.post("/itemTracking");
          if (res.status == 200) {
            setItem(res.data.data);
            dataTableFun();
          }
        } catch (error) {
          alert(error);
        }
      };
      fetchData();
    } else {
      navigate("/");
    }
  }, []);

  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const tableData = useMemo(() => {
    return (
      <Table id="example">
        <TableHead>
          <TableRow>
            <TableCell>Record.NO</TableCell>
            <TableCell>Delivery Status</TableCell>
            <TableCell>Tracking ID</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Uic Status</TableCell>
            <TableCell>UIC</TableCell>
            <TableCell>IMEI</TableCell>
            <TableCell>Item ID</TableCell>
            <TableCell>Stockin Date</TableCell>
            <TableCell>Bag ID</TableCell>
            <TableCell>Stockin Status</TableCell>
            <TableCell>Bag close Date</TableCell>
            <TableCell>Agent Name</TableCell>
            <TableCell>Assigned to Agent Date</TableCell>
            <TableCell>Tray ID</TableCell>
            <TableCell>Tray Type</TableCell>
            <TableCell>Tray Status</TableCell>
            <TableCell>Tray Location</TableCell>
            <TableCell>Tray Closed Time BOT</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {item.map((data, index) => (
            <TableRow tabIndex={-1}>
              <TableCell>{index + 1}</TableCell>
              <TableCell
                style={
                  data.delivery_status == "Pending"
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {data?.delivery_status}
              </TableCell>
              <TableCell>{data.delivery.tracking_id}</TableCell>
              <TableCell>{data.delivery.order_id}</TableCell>
              <TableCell
                style={
                  data.delivery.uic_status == "Printed"
                    ? { color: "green" }
                    : data.delivery.uic_status == "Created"
                    ? { color: "orange" }
                    : { color: "red" }
                }
              >
                {data.delivery.uic_status}
              </TableCell>
              <TableCell>{data.delivery.uic_code?.code}</TableCell>
              <TableCell>{data.delivery.imei}</TableCell>

              {/* <TableCell>
                {" "}
                {
                    data.delivery.order_date != undefined ?
                new Date(data.delivery.order_date).toLocaleString("en-GB", {
                  hour12: true,
                }) : ""}
              </TableCell> */}
              {/* <TableCell>
                {" "}
                {data?.delivery_date != undefined
                  ? new Date(data?.delivery.delivery_date).toLocaleString("en-GB", {
                      hour12: true,
                    })
                  : ""}
              </TableCell> */}
              <TableCell>{data.delivery.item_id}</TableCell>
              <TableCell>
                {data?.delivery.stockin_date != undefined
                  ? new Date(data?.delivery.stockin_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.bag_id}</TableCell>
              <TableCell
                style={
                  data.delivery.stock_in_status == "Valid"
                    ? { color: "green" }
                    : { color: "red" }
                }
              >
                {data.delivery.stock_in_status}
              </TableCell>
              <TableCell>
                {data?.delivery.bag_close_date != undefined
                  ? new Date(data?.delivery.bag_close_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.agent_name}</TableCell>
              <TableCell>
                {data?.delivery.assign_to_agent != undefined
                  ? new Date(data?.delivery.assign_to_agent).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
              <TableCell>{data.delivery.tray_id}</TableCell>
              <TableCell>{data.delivery.tray_type}</TableCell>
              <TableCell>{data.delivery.tray_status}</TableCell>
              <TableCell>{data.delivery.tray_location}</TableCell>
              <TableCell>
                {data?.delivery.tray_closed_by_bot != undefined
                  ? new Date(data?.delivery.tray_closed_by_bot).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [item]);
  return (
    <div style={{ marginTop: "100px", marginLeft: "20px" }}>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <TableContainer>{tableData}</TableContainer>
      </Paper>
    </div>
  );
}
