import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FilledInput,
  FormHelperText,
} from "@mui/material";
import PropTypes from "prop-types";
import "yup-phone";
import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Table from "./usersTable";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { axiosSuperAdminPrexo } from "../../../axios";
import Swal from "sweetalert2";

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
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [editCall, setEditCall] = useState(false);
  const [id, setId] = useState(null);
  const [cpc, setCpc] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [profilePreview, setProfilePreview] = useState("");
  const [profileFile, setProfileFile] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      navigate("/users");
    } else {
      navigate("/");
    }
    const fetchCpc = async () => {
      try {
        let response = await axiosSuperAdminPrexo.get("/getCpc");
        if (response.status == 200) setCpc(response.data.data.data);
      } catch (error) {
        alert(error);
      }
    };
    fetchCpc();
  }, [refresh]);

  const handleClickOpen = () => {
    reset({
      name: null,
      email: null,
      contact: null,
      desigination: null,
      course: null,
    });
    setImage(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditCall(false);
    setProfilePreview("");
  };
  const schema = Yup.object().shape({
    name: Yup.string()
      .max(40, "Please Enter Below 40")
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid name")
      .max(40)
      .nullable(),
    contact: Yup.string().required("Required*").phone().nullable(),
    cpc: Yup.string().required("Required*").nullable(),
    user_type: Yup.string().required("Required*").nullable(),
    device_id: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid Device Id")
      .max(40)
      .nullable(),
    device_name: Yup.string()
      .max(40, "Please Enter Below 40")
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid  Device Name")
      .max(40)
      .nullable(),
    user_name: Yup.string()
      .max(40, "Please Enter Below 40")
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid username")
      .max(40)
      .nullable(),
    password: Yup.string().required("Required*").nullable(),
    Cpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .nullable(),
    email: Yup.string().email().required("Required*").nullable(),
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
  const onSubmit = async (values) => {
    try {
      let formdata = new FormData();
      formdata.append("profile", profileFile);
      for (let [key, value] of Object.entries(values)) {
        formdata.append(key, value);
      }
      setLoading(true);
      let response = await axiosSuperAdminPrexo.post("/create", formdata);
      if (response.status == 200) {
        setLoading(false);
        if (response.data.status == 1) {
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Successfully Created",
            showConfirmButton: false,
          });
          const timer = setTimeout(() => {
            window.location.reload(false);
          }, 2000);
          setRefresh(true);
          setOpen(false);
        } else {
          setOpen(false);
          Swal.fire({
            position: "top-center",
            icon: "error",
            title: "User exist,Please check username",
            showConfirmButton: false,
          });
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const editUser = async (empId) => {
    try {
      let response = await axiosSuperAdminPrexo.get("/getEditData/" + empId);
      setProfilePreview(response.data.data.profile_picture);
      reset({
        name: response.data.data.name,
        contact: response.data.data.contact,
        user_name: response.data.data.user_name,
        password: response.data.data.password,
        user_type: response.data.data.user_type,
        Cpassword: response.data.data.password,
        cpc: response.data.data.cpc,
        device_name: response.data.data.device_name,
        device_id: response.data.data.device_id,
        profile_picture: response.data.data.profile,
        email: response.data.data.email,
      });
      setId(response.data.data._id);
      setEditCall(true);
      setOpen(true);
    } catch (error) {
      alert(error);
    }
  };
  const handelEdit = async (values) => {
    try {
      let formdata = new FormData();
      formdata.append("_id", id);
      if (Object.keys(profileFile).length != 0) {
        formdata.append("profile", profileFile);
      }
      for (let [key, value] of Object.entries(values)) {
        formdata.append(key, value);
      }
      let response = await axiosSuperAdminPrexo.post(
        "/edituserDetails",
        formdata
      );

      if (response.status == 200) {
        setOpen(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Update Successfully",
          showConfirmButton: false,
        });
        const timer = setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      }
    } catch (error) {}
  };
  // Get Cpc data from server
  async function getCpcData(data) {
    try {
      let response = await axiosSuperAdminPrexo.get("/getWarehouse/" + data);
      if (response.status == 200) {
        setWarehouse(response.data.data.warehouse);
      }
    } catch (error) {}
  }
  const handelProfile = (e) => {
    setProfilePreview(URL.createObjectURL(e.target.files[0]));
  };
  const tabelData = useMemo(() => {
    return (
      <Table
        props={{
          editUser,
          setRefresh,
          refresh,
          usersData,
          setUsersData,
        }}
      />
    );
  }, [usersData]);
  return (
    <>
      <BootstrapDialog
        key="box"
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="xs"
      >
        {editCall ? (
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Edit User
          </BootstrapDialogTitle>
        ) : (
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Add new user
          </BootstrapDialogTitle>
        )}
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
            {profilePreview != "" ? (
              <img
                src={profilePreview}
                height="60px"
                width="60px"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              ""
            )}
            <FilledInput
              id="filled-adornment-weight"
              type="file"
              name="profile_picture"
              accept=".jpg,.jpeg,.png,"
              aria-describedby="filled-weight-helper-text"
              {...register("profile_picture")}
              onChange={(e) => {
                handelProfile(e);
                setProfileFile(e.target.files[0]);
              }}
              fullWidth
              error={errors.profile_picture ? true : false}
              helperText={errors.profile_picture?.message}
            />
            <FormHelperText id="filled-weight-helper-text">
              Upload Profile
            </FormHelperText>

            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              {...register("name")}
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name.message : ""}
            />
            <TextField
              label="Mobile No"
              variant="outlined"
              fullWidth
              inputProps={{ maxLength: 10 }}
              {...register("contact")}
              error={errors.contact ? true : false}
              helperText={errors.contact ? errors.contact.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              {...register("email")}
              error={errors.email ? true : false}
              helperText={errors.email ? errors.email.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              disabled={editCall}
              {...register("user_name")}
              error={errors.user_name ? true : false}
              helperText={errors.user_name?.message}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                {editCall == true ? getValues("cpc") : "Cpc"}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Cpc"
                fullWidth
                disabled={editCall}
                {...register("cpc")}
                error={errors.cpc ? true : false}
                helperText={errors.cpc?.message}
                sx={{ mt: 2 }}
              >
                {cpc.map((data) => (
                  <MenuItem
                    value={data.code}
                    onClick={() => getCpcData(data.code)}
                  >
                    {data.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                User type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                label="User Type"
                value={getValues("user_type")}
                disabled={editCall}
                {...register("user_type")}
                error={errors.user_type ? true : false}
                helperText={errors.user_type?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem value="MIS">MIS</MenuItem>
                <MenuItem value="Warehouse">Warehouse</MenuItem>
                <MenuItem value="Bag Opening">Bag Opening</MenuItem>
                <MenuItem value="Charging">Charging</MenuItem>
                <MenuItem value="BQC">BQC</MenuItem>
                <MenuItem value="Audit">Audit</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Device name"
              variant="outlined"
              fullWidth
              disabled={editCall}
              {...register("device_name")}
              error={errors.device_name ? true : false}
              helperText={errors.device_name?.message}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Device Id"
              variant="outlined"
              fullWidth
              disabled={editCall}
              {...register("device_id")}
              error={errors.device_id ? true : false}
              helperText={errors.device_id?.message}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              disabled={editCall}
              {...register("password")}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              disabled={editCall}
              {...register("Cpassword")}
              error={errors.Cpassword ? true : false}
              helperText={errors.Cpassword?.message}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loadingPosition="end"
            loading={loading}
            style={{ backgroundColor: "#206CE2" }}
            onClick={
              editCall ? handleSubmit(handelEdit) : handleSubmit(onSubmit)
            }
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: 15,
          mr: 3,
          ml: 3,
        }}
      >
        <Box sx={{ maxHeight: "10px" }}>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#206CE2" }}
            onClick={handleClickOpen}
          >
            Add user
          </Button>
        </Box>
      </Box>
      {tabelData}
    </>
  );
}
