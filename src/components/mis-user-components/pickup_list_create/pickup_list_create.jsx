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
  Box,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { axiosMisUser } from "../../../axios";
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
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const { location } = jwt_decode(admin);
      const fetchData = async () => {
        try {
          let res = await axiosMisUser.post("/pickupListData");
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
  /******************************SELECT CHECKBOX**************************************** */
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(item.map((data, index) => data.tracking_id.toString()));
    console.log(isCheckAll);
    if (isCheckAll) {
      setIsCheck([]);
    }
  };
  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  /*****************************************PICKLIST CREATE********************************************** */
  // PICKLIST CREATE API
  const handelCreatePickList = async (e) => {
    e.preventDefault();
    try {
      if (isCheck.length === 0) {
        alert("Please select atleast one item");
      } else if (isCheck.length > 40) {
        alert("Maximum limit of picklist 40");
      } else {
        let data = [];
        for (let x of isCheck) {
          for (let y of item) {
            if (x.pick_list_status !== "Pending") {
              alert("Already created");
            }
          }
          data.push(
            item.filter(
              (data) =>
                data.tracking_id == x && data.pick_list_status == "Pending"
            )
          );
        }
        let res = await axiosMisUser.post("/createPickList", data);
        if (res.status == 200) {
          alert(res.data.message);
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const tableData = useMemo(() => {
    return (
      <Table
        id="example"
        style={{ width: "100%" }}
        stickyHeader
        aria-label="sticky table"
      >
        <TableHead>
          <TableRow>
            <TableCell>
              {" "}
              <Checkbox
                {...label}
                onClick={(e) => {
                  handleSelectAll();
                }}
                checked={item.length == isCheck.length ? true : false}
              />{" "}
              Select All
            </TableCell>
            <TableCell>Record.NO</TableCell>
            <TableCell>UIC</TableCell>
            <TableCell>Brand Name</TableCell>
            <TableCell>Model Name</TableCell>
            <TableCell>BOT Tray</TableCell>
            <TableCell>BOT Agent</TableCell>
            <TableCell>Closed On</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item?.map((data, index) => (
            <TableRow tabIndex={-1}>
              <TableCell>
                {" "}
                <Checkbox
                  {...label}
                  onClick={(e) => {
                    handleClick(e);
                  }}
                  id={data.tracking_id}
                  key={data.tracking_id}
                  checked={isCheck.includes(data.tracking_id.toString())}
                />
              </TableCell>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{data.uic_code.code}</TableCell>
              <TableCell>{data.product?.brand_name}</TableCell>
              <TableCell>{data.product?.model_name}</TableCell>
              <TableCell>{data.tray_id}</TableCell>
              <TableCell>{data.agent_name}</TableCell>
              <TableCell>
                {data?.warehouse_close_date != undefined
                  ? new Date(data?.warehouse_close_date).toLocaleString(
                      "en-GB",
                      {
                        hour12: true,
                      }
                    )
                  : ""}{" "}
              </TableCell>
              <TableCell
                style={
                  data.pick_list_status == "Pending"
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {data.pick_list_status}{" "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [item, isCheck]);
  return (
    <div style={{ marginTop: "100px", marginLeft: "20px" }}>
      <Box
        sx={{
          float: "right",
        }}
      >
        <Button
          variant="contained"
          // fullWidth
          sx={{ m: 1, mt: 1 }}
          style={{ backgroundColor: "#206CE2" }}
          onClick={(e) => {
            handelCreatePickList(e);
          }}
        >
          Create Picklist
        </Button>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
        <TableContainer>{tableData}</TableContainer>
      </Paper>
    </div>
  );
}
