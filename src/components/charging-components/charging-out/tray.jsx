import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import "yup-phone";
import { useNavigate } from "react-router-dom";
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { axiosCharging, axiosWarehouseIn } from "../../../axios";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
export default function DialogBox() {
  const navigate = useNavigate();
  const [trayData, setTrayData] = useState([]);
  const { trayId } = useParams();
  /**************************************************************************** */
  const [uic, setUic] = useState("");
  const [description, setDescription] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [resDataUic, setResDataUic] = useState({});
  const [bodyDamage, setBodyDamage] = useState(false);
  const [charge, setCharge] = useState("");
  const handleClose = () => {
    setOpen(false);
  };
  /************************************************************************** */
  const schema = Yup.object().shape({
    battery_status: Yup.string().required("Required*").nullable(),
    charge_percentage: Yup.string()
      .when("battery_status", (battery_status, schema) => {
        if (battery_status == "Charge" || battery_status == "Heat problem") {
          return schema.required("Required");
        }
      })
      .nullable(),
    body_condition: Yup.string().required("Required*").nullable(),
    display_condition: Yup.string().required("Required*").nullable(),
    lock_status: Yup.string().required("Required*").nullable(),
    charging_jack_type: Yup.string().required("Required*").nullable(),
    cimei_1: Yup.string().required("Required*").min(15).nullable(),
    cimei_2: Yup.string().required("Required*").min(15).nullable(),
    boady_part_missing: Yup.string().required("Required*").nullable(),
    part_name: Yup.string()
      .when("boady_part_missing", (boady_part_missing, schema) => {
        if (boady_part_missing == "YES") {
          return schema.required("Required");
        }
      })
      .nullable(),
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  /*********************************************************** */
  let admin = localStorage.getItem("prexo-authentication");
  let user_name1;
  if (admin) {
    let { user_name } = jwt_decode(admin);
    user_name1 = user_name;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosWarehouseIn.post("/getWhtTrayItem/" + trayId);
        if (response.status === 200) {
          setTrayData(response.data.data);
          //   dataTableFun()
        } else {
          navigate("/bag-issue-request");
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, [refresh]);

  const handelUic = async (e) => {
    if (e.target.value.length === 11) {
      try {
        let obj = {
          uic: e.target.value,
          trayId: trayId,
        };
        let res = await axiosWarehouseIn.post("/check-uic", obj);
        if (res?.status == 200) {
          setResDataUic(res.data.data);
          handleClickOpen();
        }
      } catch (error) {
        if (error.response.status == 403) {
          setUic("");
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      }
    }
  };
  const onSubmit = async (values) => {
    values.charging_person = user_name1;
    if (trayData.limit <= trayData?.actual_items?.length) {
      alert("All Items Scanned");
    } else {
      try {
        let objData = {
          trayId: trayId,
          item: resDataUic,
        };
        objData.item.charging = values;
        let res = await axiosWarehouseIn.post("/wht-add-actual-item", objData);
        if (res.status == 200) {
          setUic("");
          setRefresh((refresh) => !refresh);
          handleClose();
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  /************************************************************************** */
  const addActualitem = async () => {
    if (trayData.limit <= trayData?.actual_items?.length) {
      alert("All Items Scanned");
    } else {
      resDataUic.remark = description;
      try {
        let objData = {
          trayId: trayId,
          item: resDataUic,
        };
        let res = await axiosWarehouseIn.post("/wht-add-actual-item", objData);
        if (res.status == 200) {
          setUic("");
          setRefresh((refresh) => !refresh);
          handleClose();
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  /************************************************************************** */
  const handelIssue = async (e) => {
    try {
      if (description == "") {
        alert("Please Add Description");
      } else if (trayData?.actual_items?.length == trayData?.items?.length) {
        let obj = {
          trayId: trayId,
          description: description,
        };

        let res = await axiosCharging.post("/charging-done", obj);
        if (res.status == 200) {
          alert(res.data.message);
          navigate("/view-assigned-tray-charging");
        }
      } else {
        alert("Please Verify Actual Data");
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelDelete = async (id) => {
    try {
      let obj = {
        trayId: trayId,
        id: id,
      };
      let data = await axiosWarehouseIn.put("/actualBagItem", obj);
      if (data.status == 200) {
        alert(data.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };
  const handleClickOpen = () => {
    reset({});
    setBodyDamage(false);
    setOpen(true);
  };
  /*********************************TRAY ASSIGNEMENT********************************** */

  /***************************************************************************************** */
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="xs"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          ADD
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              p: 1,
              m: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Battery Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                label="Battery Status"
                value={getValues("battery_status")}
                {...register("battery_status")}
                error={errors.battery_status ? true : false}
                helperText={errors.battery_status?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Charge failed" onClick={(e) => setCharge("")}>
                  Charge failed
                </MenuItem>
                <MenuItem value="Charge" onClick={(e) => setCharge("Charge")}>
                  Charge
                </MenuItem>
                <MenuItem
                  value="Heat Problem"
                  onClick={(e) => setCharge("Heat Problem")}
                >
                  Heat Problem
                </MenuItem>
                <MenuItem
                  value="Battery Bulging"
                  onClick={(e) => setCharge("")}
                >
                  Battery Bulging
                </MenuItem>
                <MenuItem value="No-battery" onClick={(e) => setCharge("")}>
                  No-battery
                </MenuItem>
              </Select>
            </FormControl>
            {charge == "Charge" || charge == "Heat Problem" ? (
              <FormControl fullWidth>
                <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                  Charge Percentage
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  fullWidth
                  label="Charge Percentage"
                  value={getValues("charge_percentage")}
                  {...register("charge_percentage")}
                  error={errors.charge_percentage ? true : false}
                  helperText={errors.charge_percentage?.message}
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="1-10% Charged">1-10% Charged</MenuItem>
                  <MenuItem value="10-50% Charged">10-50% Charged</MenuItem>
                  <MenuItem value="50-80% Charged">50-80% Charged</MenuItem>
                  <MenuItem value="80%+ Charged">80%+ Charged</MenuItem>
                </Select>
              </FormControl>
            ) : null}

            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Body Condition
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                label="Body Condition"
                value={getValues("body_condition")}
                {...register("body_condition")}
                error={errors.body_condition ? true : false}
                helperText={errors.body_condition?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Body Condition Ok">Body Condition Ok</MenuItem>
                <MenuItem value="Body Broken">Body Broken</MenuItem>
                <MenuItem value="Body with minor scratches">
                  Body with minor scratches
                </MenuItem>
                <MenuItem value="Body with major scratches">
                  Body with major scratches
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Display Condition
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                label="Display Condition"
                value={getValues("display_condition")}
                {...register("display_condition")}
                error={errors.display_condition ? true : false}
                helperText={errors.display_condition?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Display Condition Ok">
                  Display Condition Ok
                </MenuItem>
                <MenuItem value="Display Broken">Display Broken</MenuItem>
                <MenuItem value="Display with minor scratches">
                  Display with minor scratches
                </MenuItem>
                <MenuItem value="Display with major scratches">
                  Display with major scratches
                </MenuItem>
                <MenuItem value="Charge failed">Charge failed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Lock Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                label="Lock Status"
                value={getValues("lock_status")}
                {...register("lock_status")}
                error={errors.lock_status ? true : false}
                helperText={errors.lock_status?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Unlocked">Unlocked</MenuItem>
                <MenuItem value="Pin/Pattern Lock">Pin/Pattern Lock</MenuItem>
                <MenuItem value="Google Locked">Google Locked</MenuItem>
                <MenuItem value="iCloud Locked">iCloud Locked</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Charging Jack type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                label="Charging Jack type"
                value={getValues("charging_jack_type")}
                {...register("charging_jack_type")}
                error={errors.charging_jack_type ? true : false}
                helperText={errors.charging_jack_type?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Micro USB">Micro USB</MenuItem>
                <MenuItem value="Type C">Type C</MenuItem>
                <MenuItem value="lightning">lightning</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label" sx={{ mt: 2 }}>
                Any Body Part missing
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="NO"
                name="boady_part_missing"
              >
                <Box>
                  <FormControlLabel
                    value="YES"
                    {...register("boady_part_missing")}
                    onClick={(e) => setBodyDamage(true)}
                    control={<Radio />}
                    label="YES"
                  />
                  <FormControlLabel
                    onClick={(e) => setBodyDamage(false)}
                    {...register("boady_part_missing")}
                    value="NO"
                    control={<Radio />}
                    label="NO"
                  />
                </Box>
              </RadioGroup>
            </FormControl>
            {bodyDamage == true ? (
              <TextField
                label="Missing Part Name"
                variant="outlined"
                type="text"
                {...register("part_name")}
                error={errors.part_name ? true : false}
                helperText={errors.part_name?.message}
                fullWidth
                sx={{ mt: 2 }}
              />
            ) : null}
            <TextField
              label="CIMEI-1"
              variant="outlined"
              type="text"
              {...register("cimei_1")}
              inputProps={{ maxLength: 15 }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              error={errors.cimei_1 ? true : false}
              helperText={errors.cimei_1?.message}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="CIMEI-2"
              variant="outlined"
              type="text"
              {...register("cimei_2")}
              inputProps={{ maxLength: 15 }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              error={errors.cimei_2 ? true : false}
              helperText={errors.cimei_2?.message}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Supervisor name"
              variant="outlined"
              type="text"
              value={user_name1}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              ml: 2,
            }}
            fullwidth
            variant="contained"
            style={{ backgroundColor: "green" }}
            component="span"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Add
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          mt: 11,
          height: 70,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            float: "left",
          }}
        >
          <h6 style={{ marginLeft: "13px" }}>TRAY ID - {trayId}</h6>
          <h6 style={{ marginLeft: "13px" }}>
            AGENT NAME - {trayData?.issued_user_name}
          </h6>
        </Box>
        <Box
          sx={{
            float: "right",
          }}
        >
          <h6 style={{ marginRight: "13px" }}>Brand -- {trayData?.brand}</h6>
          <h6 style={{ marginRight: "13px" }}>Model -- {trayData?.model}</h6>
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Paper sx={{ width: "95%", overflow: "hidden", m: 1 }}>
            <Box sx={{}}>
              <Box
                sx={{
                  float: "left",
                  ml: 2,
                }}
              >
                <h6>Expected</h6>
              </Box>
              <Box
                sx={{
                  float: "right",
                  mr: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Total</h5>
                  <p style={{ paddingLeft: "5px", fontSize: "22px" }}>
                    {
                      trayData?.items?.filter(function (item) {
                        return item.status != "Duplicate";
                      }).length
                    }
                    /{trayData?.limit}
                  </p>
                </Box>
              </Box>
            </Box>
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
                    <TableCell>UIC</TableCell>
                    <TableCell>MUIC</TableCell>
                    <TableCell>BOT Tray</TableCell>
                    <TableCell>BOT Agent</TableCell>
                    {/* <TableCell>Tracking Number</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trayData?.items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.uic}</TableCell>
                      <TableCell>{data?.muic}</TableCell>
                      <TableCell>{data?.tray_id}</TableCell>
                      <TableCell>{data?.bot_agent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ width: "98%", overflow: "hidden", m: 1 }}>
            <Box sx={{}}>
              <Box
                sx={{
                  float: "left",
                  ml: 2,
                }}
              >
                <h6>ACTUAL</h6>
                <TextField
                  sx={{ mt: 1 }}
                  id="outlined-password-input"
                  type="text"
                  name="doorsteps_diagnostics"
                  label="Please Enter UIC"
                  value={uic}
                  // onChange={(e) => setAwbn(e.target.value)}
                  onChange={(e) => {
                    setUic(e.target.value);
                    handelUic(e);
                  }}
                  inputProps={{
                    style: {
                      width: "auto",
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  float: "right",
                  mr: 2,
                }}
              >
                <Box sx={{}}>
                  <h5>Total</h5>
                  <p style={{ marginLeft: "5px", fontSize: "24px" }}>
                    {
                      trayData.actual_items?.filter(function (item) {
                        return item.status != "Duplicate";
                      }).length
                    }
                    /{trayData?.limit}
                  </p>
                </Box>
              </Box>
            </Box>
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
                    <TableCell>UIC</TableCell>
                    <TableCell>MUIC</TableCell>
                    <TableCell>BOT Tray</TableCell>
                    <TableCell>BOT Agent</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {trayData?.actual_items?.map((data, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data?.uic}</TableCell>
                      <TableCell>{data?.muic}</TableCell>
                      <TableCell>{data?.tray_id}</TableCell>
                      <TableCell>{data?.bot_agent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ float: "right" }}>
        <textarea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          style={{ width: "400px" }}
          placeholder="Description"
        ></textarea>
        <Button
          sx={{ m: 3, mb: 9 }}
          variant="contained"
          style={{ backgroundColor: "green" }}
          onClick={() => {
            if (window.confirm("You Want send to warehouse?")) {
              handelIssue();
            }
          }}
        >
          Charging Done
        </Button>
      </Box>
    </>
  );
}
