import React, { useEffect, useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import {
  axiosMisUser,
  axiosSuperAdminPrexo,
  axiosWarehouseIn,
} from "../../../axios";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import Checkbox from "@mui/material/Checkbox";
//Datatable Modules
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

/******************************************************************************* */
export default function StickyHeadTable({ props }) {
  const [whtTray, setWhtTray] = useState([]);
  const [brand, setbrand] = useState([]);
  const [model, setModel] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [selectBut, setSelectBut] = useState(false);
  const [readyForMerge, setReadyForMerge] = useState(true);
  const [afterSelectDis, setAfterSelectDis] = useState(false);
  const [search, setSearch] = useState({
    brand: "",
    model: "",
    location: "",
  });
  /******************************************************************************* */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let admin = localStorage.getItem("prexo-authentication");
        if (admin) {
          setLoading(false);
          let { location } = jwt_decode(admin);
          let response = await axiosWarehouseIn.post(
            "/wht-tray/" + "Inuse/" + location
          );
          if (response.status === 200) {
            setWhtTray(response.data.data);
            setLoading(true);
            dataTableFun();
          }
          let brandRes = await axiosSuperAdminPrexo.post("/getBrands");
          if (brandRes.status == 200) {
            setbrand(brandRes.data.data);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReadyForMerge(true);
        setAfterSelectDis(false);
        if (isCheck.length == 2) {
          let res = await axiosMisUser.post("/check-ready-for-merge", isCheck);
          if (res.status == 200) {
            setReadyForMerge(false);
            setAfterSelectDis(true);
          }
        }
      } catch (error) {
        if (error.response.status === 403) {
          alert(error.response.data.message);
        }
      }
    };
    fetchData();
  }, [isCheck]);

  /******************************************************************************* */

  const handelViewItem = (id) => {
    navigate("/wht-tray-item/" + id);
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  /******************************************************************************* */
  /* GET MODEL NAME */
  const getModel = async (e, brandName) => {
    e.preventDefault();
    try {
      let res = await axiosSuperAdminPrexo.post(
        "/get-product-model/" + brandName
      );
      if (res.status == 200) {
        setModel(res.data.data);
      }
    } catch (error) {
      alert(error);
    }
  };
  /*********************************************GET WHT TRAY BASED ON THE BRAND AND MODEL********************************** */
  const handelGetWhtTray = async () => {
    try {
      let admin = localStorage.getItem("prexo-authentication");
      setLoading(false);
      setSelectBut(false);
      if (admin) {
        let { location } = jwt_decode(admin);
        let obj = {
          brand: search.brand,
          model: search.model,
          location: location,
        };
        let res = await axiosMisUser.post("/sort-wht-tray-brand-model", obj);
        $("#example").DataTable().destroy();
        if (res.status === 200) {
          setWhtTray(res.data.data);
          setSelectBut(true);
          setLoading(true);
          dataTableFun();
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  /************************************SELECT TRAY********************************* */
  // const handleSelectAll = (e) => {
  //   setIsCheckAll(!isCheckAll);
  //   setIsCheck(whtTray?.[0]?.delivery?.map((li, index) => index.toString()));
  //   if (isCheckAll) {
  //     setIsCheck([]);
  //   }
  // };
  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  /***********************************FUNCTION FOR CHECK READY FOR MERGE**************************************************** */
  // const checkReadyforMerge = async (e) => {
  //   try {
  //     if (isCheck.length == 2) {
  //       e.preventDefault();
  //       let res = await axiosMisUser.post("/check-ready-for-merge", isCheck);
  //       if (res.status == 200) {
  //       }
  //     }
  //   } catch (error) {
  //     if (error.response.status === 403) {
  //       alert(error.response.data.message);
  //     }
  //   }
  // };

  const tableData = useMemo(() => {
    return (
      <TableContainer>
        <Table id="example" style={{ width: "100%" }} aria-label="sticky table">
          <TableHead>
            <TableRow>
              {selectBut === true ? <TableCell>Select</TableCell> : null}
              <TableCell>Record.NO</TableCell>
              <TableCell>Tray Id</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Tray Category</TableCell>
              <TableCell>Tray Brand</TableCell>
              <TableCell>Tray Model</TableCell>
              <TableCell>Tray Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Tray Display</TableCell>
              <TableCell>status</TableCell>
              <TableCell>Creation Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {whtTray.map((data, index) => (
              <TableRow hover role="checkbox" tabIndex={-1}>
                {selectBut === true ? (
                  <TableCell>
                    {" "}
                    <Checkbox
                      {...label}
                      onClick={(e) => {
                        handleClick(e);
                      }}
                      id={data.code}
                      key={data.code}
                      checked={isCheck.includes(data.code)}
                      disabled={afterSelectDis}
                    />
                  </TableCell>
                ) : null}
                <TableCell>{index + 1}</TableCell>
                <TableCell>{data.code}</TableCell>
                <TableCell>{data.warehouse}</TableCell>
                <TableCell>{data.type_taxanomy}</TableCell>
                <TableCell>{data.brand}</TableCell>
                <TableCell>{data.model}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell>
                  {" "}
                  {data.items.length == 0
                    ? data.actual_items.length
                    : data.items.length}
                  /{data.limit}
                </TableCell>
                <TableCell>{data.display}</TableCell>
                <TableCell>{data.sort_id}</TableCell>
                <TableCell>
                  {new Date(data.created_at).toLocaleString("en-GB", {
                    hour12: true,
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    sx={{
                      m: 1,
                    }}
                    variant="contained"
                    onClick={() => handelViewItem(data.code)}
                    style={{ backgroundColor: "green" }}
                    component="span"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [whtTray, isCheck, selectBut, afterSelectDis]);
  /******************************************************************************* */
  return (
    <>
      <Box
        sx={{
          top: { sm: 60, xs: 20 },
          left: { sm: 250 },
          m: 3,
          mt: 11,
        }}
      >
        <Box
          sx={{
            float: "left",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "start",
            }}
          >
            <FormControl sx={{ mt: 1, minWidth: 150 }} fullWidth>
              <InputLabel s id="demo-simple-select-label">
                Brand
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                label="Select search field"
                onChange={(e) => {
                  setSearch((p) => ({ ...p, brand: e.target.value }));
                }}
              >
                {brand.map((data) => (
                  <MenuItem
                    value={data.brand_name}
                    onClick={(e) => {
                      getModel(e, data.brand_name);
                    }}
                  >
                    {data.brand_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ mt: 1, ml: 2, minWidth: 150 }} fullWidth>
              <InputLabel sx={{ pl: 1 }} id="demo-simple-select-label">
                Model
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                disabled={search.brand == "" ? true : false}
                label="Select search field"
                onChange={(e) => {
                  setSearch((p) => ({ ...p, model: e.target.value }));
                }}
              >
                {model.map((data) => (
                  <MenuItem value={data.model_name}>{data.model_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              sx={{
                m: 1,
                ml: 3,
                mt: 2,
              }}
              variant="contained"
              style={{ backgroundColor: "#206CE2" }}
              component="span"
              fullWidth
              disabled={search.model == "" ? true : false}
              onClick={(e) => {
                handelGetWhtTray(e);
              }}
            >
              Sort
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            float: "right",
          }}
        >
          <Button
            sx={{
              mt: 2,
              height: "48px",
              width: "200px",
            }}
            variant="contained"
            style={{ backgroundColor: "green" }}
            component="span"
            disabled={readyForMerge}
            // onClick={(e) => {
            //   handelAssignForSorting(e);
            // }}
          >
            Assign For Sorting
          </Button>
        </Box>
        <Box
          sx={{
            mt: 12,
            mb: 2,
          }}
        >
          {loading === false ? (
            <Container>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  pt: 30,
                }}
              >
                <CircularProgress />
                <p style={{ paddingTop: "10px" }}>Loading...</p>
              </Box>
            </Container>
          ) : (
            <Paper sx={{ width: "100%", overflow: "auto" }}>{tableData}</Paper>
          )}
        </Box>
      </Box>
    </>
  );
}
