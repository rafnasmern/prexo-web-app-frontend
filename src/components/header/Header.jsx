import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../../src/images/prexo-logo.png";
import { useLocation } from "react-router-dom";
import {
  Link,
  MenuItem,
  Tooltip,
  Button,
  Avatar,
  Container,
  Menu,
  Typography,
  IconButton,
  Toolbar,
  Box,
  AppBar,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import EmailIcon from "@mui/icons-material/Email";
import HandshakeIcon from "@mui/icons-material/Handshake";
import KeyIcon from "@mui/icons-material/Key";
import { axiosSuperAdminPrexo } from "../../axios";

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [anchorE3, setAnchorE3] = useState(null);
  const [anchorE4, setAnchorE4] = useState(null);
  const [anchorE5, setAnchorE5] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const open = Boolean(anchorE4);

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      const fetchData = async () => {
        try {
          let { user_name, user_type } = jwt_decode(admin);
          if (user_type !== "super-admin") {
            let res = await axiosSuperAdminPrexo.post(
              "/check-user-status/" + user_name
            );
            if (res.status === 200) {
            }
          }
        } catch (error) {
          if (error.response.status === 403) {
            alert(error.response.data.message);
            localStorage.removeItem("prexo-authentication");
            navigate("/");
          }
        }
      };
      fetchData();
    } else {
      navigate("/");
    }
  });
  const handleClose = () => {
    setAnchorE4(null);
  };
  function handleClick(event) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }
  function handelBagOpening(event) {
    if (anchorE5 !== event.currentTarget) {
      setAnchorE5(event.currentTarget);
    }
  }
  function handelMisDrop(e) {
    if (anchorE2 !== e.currentTarget) {
      setAnchorE2(e.currentTarget);
    }
  }
  function handelWarehouseDrop(e) {
    if (anchorE3 !== e.currentTarget) {
      setAnchorE3(e.currentTarget);
    }
  }
  function handelProfile(e) {
    if (anchorE4 !== e.currentTarget) {
      setAnchorE4(e.currentTarget);
    }
  }
  function handleClosea1() {
    setAnchorEl(null);
  }
  function handleClosea2() {
    setAnchorE2(null);
  }
  function handleClosea3() {
    setAnchorE3(null);
  }
  function handleClosea4() {
    setAnchorE4(null);
  }
  function handleClosea5() {
    setAnchorE5(null);
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handelLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  const handelHome = (e) => {
    e.preventDefault();
    navigate("/admin");
  };
  const handelMisUserDashboard = (e) => {
    e.preventDefault();
    navigate("/mis-user-dashboard");
  };
  const handelWarehouseInDashboard = (e) => {
    e.preventDefault();
    navigate("/warehouse-in-dashboard");
  };
  const handelBot = (e) => {
    e.preventDefault();
    navigate("/bot-dashboard");
  };
  const handelLogout = () => {
    localStorage.removeItem("prexo-authentication");
    navigate("/");
  };
  const handelSearch = (e) => {
    e.preventDefault();
    navigate("/search");
  };
  const handelChangePassword = (e) => {
    e.preventDefault();
    navigate("/change-password");
  };
  const handelCharging = (e) => {
    e.preventDefault();
    navigate("/charging-dashboard");
  };
  const handelBQC = (e) => {
    e.preventDefault();
    navigate("/bqc-dashboard");
  };
  const handelSortingAgent = (e) => {
    e.preventDefault();
    navigate("/sorting-agent-dashboard");
  };

  /************************************************************************* */
  const handelUsers = (e) => {
    e.preventDefault();
    navigate("/users");
  };
  const handelLocation = (e) => {
    e.preventDefault();
    navigate("/location");
  };
  const handelWarehouse = (e) => {
    e.preventDefault();
    navigate("/warehouse");
  };
  const handelBrands = (e) => {
    e.preventDefault();
    navigate("/brands");
  };
  const handelProducts = (e) => {
    e.preventDefault();
    navigate("/products");
  };
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
  /******************************************************************************** */
  const styles = {
    button: {
      // main styles,
      "&:focus": {
        color: "red",
      },
    },
  };
  let token = localStorage.getItem("prexo-authentication");
  let user_type1, email1, name1;
  if (token) {
    const { user_type, email, name } = jwt_decode(token);
    user_type1 = user_type;
    email1 = email;
    name1 = name;
  }

  // useEffect(() => {
  //   let token = localStorage.getItem("prexo-authentication");
  //   const {user_type}=jwt_decode(token)
  // }, []);

  return (
    <AppBar position="fixed" style={{ backgroundColor: "#228C23" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <img src={Logo} width="77px" height="61px" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={handelHome}>
                <Link href="/login">Users</Link>
              </MenuItem>
              <MenuItem onClick={handelMisUserDashboard}>
                <Link href="/login">MiS User</Link>
              </MenuItem>
              <MenuItem onClick={handelWarehouseInDashboard}>
                <Link href="/login">Infra</Link>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <img src={Logo} width="50vw" height="50vh" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {user_type1 == "super-admin" ? (
              <>
                <Button
                  aria-owns={anchorEl ? "simple-menu" : undefined}
                  aria-haspopup="true"
                  onClick={(e) => {
                    handleClick(e);
                    handelHome(e);
                  }}
                  sx={{ my: 3, color: "white" }}
                  style={{
                    backgroundColor:
                      location.pathname == "/admin" ? "#495057" : "",
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Admin
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClosea1}
                  MenuListProps={{ onMouseLeave: handleClosea1 }}
                >
                  <MenuItem>
                    {" "}
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      target="_blank"
                      href="/users"
                    >
                      Users
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    {" "}
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      target="_blank"
                      href="/location"
                    >
                      Location
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      target="_blank"
                      href="/warehouse"
                    >
                      Warehouse
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    {" "}
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      target="_blank"
                      href="/brands"
                    >
                      Brands
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      target="_blank"
                      href="/products"
                    >
                      Products
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      target="_blank"
                      href="/bag-master"
                    >
                      Bags
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    {" "}
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      target="_blank"
                      href="/tray-master"
                    >
                      Tray
                    </Link>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              ""
            )}
            {user_type1 == "MIS" ? (
              <div>
                <Button
                  aria-owns={anchorE2 ? "simple-menu2" : undefined}
                  aria-haspopup="true"
                  onClick={(e) => {
                    handelMisDrop(e);
                    handelMisUserDashboard(e);
                  }}
                  sx={{ my: 3, color: "white" }}
                  style={{
                    backgroundColor:
                      location.pathname == "/mis-user-dashboard"
                        ? "#495057"
                        : "",
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  MIS User
                </Button>
                <Menu
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                  id="simple-menu2"
                  anchorEl={anchorE2}
                  open={Boolean(anchorE2)}
                  onClose={handleClosea2}
                  MenuListProps={{ onMouseLeave: handleClosea2 }}
                >
                  <MenuItem
                    onClick={(e) => {
                      handelOrders(e);
                    }}
                  >
                    Orders
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handelDelivery(e);
                    }}
                  >
                    Delivery
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handelReconSheet(e);
                    }}
                  >
                    Recon Sheet
                  </MenuItem>
                  <MenuItem>UIC Download</MenuItem>
                </Menu>
              </div>
            ) : (
              ""
            )}
            {user_type1 == "Warehouse" ? (
              <>
                <Button
                  aria-owns={anchorE2 ? "simple-menu3" : undefined}
                  aria-haspopup="true"
                  onClick={(e) => {
                    handelWarehouseDrop(e);
                    handelWarehouseInDashboard(e);
                  }}
                  sx={{ my: 3, color: "white" }}
                  style={{
                    backgroundColor:
                      location.pathname == "/warehouse-in-dashboard"
                        ? "#495057"
                        : "",
                  }}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Warehouse
                </Button>
                <Menu
                  id="simple-menu3"
                  anchorEl={anchorE3}
                  open={Boolean(anchorE3)}
                  onClose={handleClosea3}
                  MenuListProps={{ onMouseLeave: handleClosea3 }}
                >
                  <MenuItem>Scan</MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      handelSearch(e);
                    }}
                  >
                    Search
                  </MenuItem>
                </Menu>
              </>
            ) : (
              ""
            )}
            {user_type1 == "Bag Opening" ? (
              <>
                <Button
                  // onClick={(e)=>{handelWarehouseDashboard(e)}}
                  // sx={{ my: 2, color: "white", display: "block" }}
                  endIcon={<KeyboardArrowDownIcon />}
                  aria-owns={anchorE5 ? "simple-menu5" : undefined}
                  aria-haspopup="true"
                  onClick={(e) => {
                    handelBagOpening(e);
                    handelBot(e);
                  }}
                  sx={{ my: 3, color: "white" }}
                  style={{
                    backgroundColor:
                      location.pathname == "/Bag Opening" ? "#495057" : "",
                  }}
                >
                  Bag Opening
                </Button>
                <Menu
                  id="simple-menu5"
                  anchorEl={anchorE5}
                  open={Boolean(anchorE5)}
                  onClose={handleClosea5}
                  MenuListProps={{ onMouseLeave: handleClosea5 }}
                >
                  <MenuItem>Bags</MenuItem>
                </Menu>
              </>
            ) : (
              ""
            )}
            {user_type1 == "Charging" ? (
              <>
                <Button
                  endIcon={<KeyboardArrowDownIcon />}
                  aria-owns={anchorE5 ? "simple-menu5" : undefined}
                  aria-haspopup="true"
                  onClick={(e) => {
                    handelCharging(e);
                    // handelBot(e);
                  }}
                  sx={{ my: 3, color: "white" }}
                  style={{
                    backgroundColor:
                      location.pathname == "/charging-dashboard"
                        ? "#495057"
                        : "",
                  }}
                >
                  Charging
                </Button>
                <Menu
                  id="simple-menu5"
                  anchorEl={anchorE5}
                  open={Boolean(anchorE5)}
                  onClose={handleClosea5}
                  MenuListProps={{ onMouseLeave: handleClosea5 }}
                >
                  {/* <MenuItem>Bags</MenuItem> */}
                </Menu>
              </>
            ) : (
              ""
            )}
            {user_type1 == "BQC" ? (
              <>
                <Button
                  endIcon={<KeyboardArrowDownIcon />}
                  aria-owns={anchorE5 ? "simple-menu5" : undefined}
                  aria-haspopup="true"
                  onClick={(e) => {
                    handelBQC(e);
                    // handelBot(e);
                  }}
                  sx={{ my: 3, color: "white" }}
                  style={{
                    backgroundColor:
                      location.pathname == "/bqc-dashboard" ? "#495057" : "",
                  }}
                >
                  BQC
                </Button>
                <Menu
                  id="simple-menu5"
                  anchorEl={anchorE5}
                  open={Boolean(anchorE5)}
                  onClose={handleClosea5}
                  // MenuListProps={{ onMouseLeave: handleClosea5 }}
                >
                  {/* <MenuItem>Bags</MenuItem> */}
                </Menu>
              </>
            ) : (
              ""
            )}
            {user_type1 == "Sorting Agent" ? (
              <>
                <Button
                  endIcon={<KeyboardArrowDownIcon />}
                  aria-owns={anchorE5 ? "simple-menu5" : undefined}
                  aria-haspopup="true"
                  onClick={(e) => {
                    handelSortingAgent(e);
                  }}
                  sx={{ my: 3, color: "white" }}
                  style={{
                    backgroundColor:
                      location.pathname == "/sorting-agent-dashboard"
                        ? "#495057"
                        : "",
                  }}
                >
                  Sorting Agent
                </Button>
                <Menu
                  id="simple-menu5"
                  anchorEl={anchorE5}
                  open={Boolean(anchorE5)}
                  onClose={handleClosea5}
                  // MenuListProps={{ onMouseLeave: handleClosea5 }}
                >
                  {/* <MenuItem>Bags</MenuItem> */}
                </Menu>
              </>
            ) : (
              ""
            )}
            {/* <Button
              // onClick={(e)=>{handelWarehouseDashboard(e)}}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Segregation
            </Button> */}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            {/* <Button
              onClick={handelLogout}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Logout
            </Button> */}
            <h6 style={{ marginTop: "8px", marginRight: "8px" }}>{name1}</h6>
            <AccountCircleIcon
              style={{ fontSize: "45px" }}
              aria-haspopup="true"
            />
            {/* <Menu
                id="simple-menu4"
                anchorEl={anchorE4}
                open={Boolean(anchorE4)}
                onClose={handleClosea4}
                MenuListProps={{ onMouseLeave: handleClosea4 }}
              >
                <MenuItem >Partner ID - 1613633867</MenuItem>
                <MenuItem >Change Password</MenuItem>
                <MenuItem onClick={handelLogout} >Logout</MenuItem>
              </Menu> */}
            <Menu
              anchorEl={anchorE4}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <ListItemIcon>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                {email1}
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <HandshakeIcon fontSize="small" />
                </ListItemIcon>
                1613633867
              </MenuItem>
              <Divider />
              {user_type1 != "super-admin" ? (
                <MenuItem
                  onClick={(e) => {
                    handelChangePassword(e);
                  }}
                >
                  <ListItemIcon>
                    <KeyIcon fontSize="small" />
                  </ListItemIcon>
                  Change Password
                </MenuItem>
              ) : (
                ""
              )}
              <MenuItem onClick={handelLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
            <ExpandMoreIcon
              style={{ cursor: "pointer", marginTop: "18px", fontSize: "23px" }}
              aria-owns={anchorE4 ? "simple-menu4" : undefined}
              onClick={(e) => {
                handelProfile(e);
              }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
