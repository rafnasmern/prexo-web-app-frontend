import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
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
  MenuItem,
  Menu,
} from "@mui/material";
import {
  axiosMisUser,
  axiosSuperAdminPrexo,
  axiosWarehouseIn,
} from "../../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
export default function StickyHeadTable({ props }) {
  const [infraData, setInfraData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      if (admin) {
        let { location } = jwt_decode(admin);
        const fetchData = async () => {
          let res = await axiosWarehouseIn.post("/getRequests/" + location);
          if (res.status == 200) {
            setInfraData(res.data.data);
            dataTableFun();
          }
        };
        fetchData();
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error);
    }
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //api for delete a employee

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
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  const handelDetailPage = (e, bagId) => {
    e.preventDefault();
    navigate("/request-detail-page/" + bagId);
  };
  return (
    <>
      <Box>
        <Box
          sx={{
            top: { sm: 60, xs: 20 },
            left: { sm: 250 },
            m: 3,
            mt: 13,
            display: "flex",
            flexDirection: "cloumn",
            justifyContent: "center",
          }}
        >
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table
                style={{ width: "100%" }}
                id="example"
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>S.NO</TableCell>
                    <TableCell>Bag Id</TableCell>
                    <TableCell>Agent Name</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Max</TableCell>
                    <TableCell>Valid</TableCell>
                    <TableCell>Invalid</TableCell>
                    <TableCell>Duplicate</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infraData.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.code}</TableCell>
                      <TableCell>{data.issued_user_name}</TableCell>
                      <TableCell>{data.warehouse}</TableCell>
                      <TableCell>{data.limit}</TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Valid";
                          }).length
                        }
                      </TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Invalid";
                          }).length
                        }
                      </TableCell>
                      <TableCell>
                        {
                          infraData[index]?.items?.filter(function (item) {
                            return item.status == "Duplicate";
                          }).length
                        }
                      </TableCell>
                      <TableCell>{data?.items?.length}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#206CE2" }}
                          onClick={(e) => {
                            handelDetailPage(e, data.code);
                          }}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
