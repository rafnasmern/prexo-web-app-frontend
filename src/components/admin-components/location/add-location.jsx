import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import "yup-phone";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import Table from "./location";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { axiosSuperAdminPrexo } from "../../../axios";
import Swal from "sweetalert2";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

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
  const [serachData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      navigate("/location");
    } else {
      navigate("/");
    }
  }, [refresh]);

  const handleClickOpen = () => {
    reset({
      name: null,
      code: null,
      address: null,
      city: null,
      country: null,
      state: null,
      pincode: null,
    });
    setImage(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditCall(false);
  };
  const schema = Yup.object().shape({
    name: Yup.string()
      .max(40, "Please Enter Below 40")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid name")
      .max(40)
      .required("Required*")
      .nullable(),
    code: Yup.string()
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid code")
      .max(40)
      .required("Required*")
      .nullable(),
    address: Yup.string()
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid address")
      .max(40)
      .required("Required*")
      .nullable(),
    city: Yup.string()
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid city")
      .max(40)
      .required("Required*")
      .nullable(),
    state: Yup.string()
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid state")
      .max(40)
      .required("Required*")
      .nullable(),
    country: Yup.string()
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid country")
      .max(40)
      .required("Required*")
      .nullable(),
    pincode: Yup.string()
      .min(6, "Please Enter valid Pincode")
      .required("Required*")
      .nullable(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    data.type_taxanomy = "CPC";
    try {
      setLoading(true);
      let response = await axiosSuperAdminPrexo.post("/addLocation", data);
      if (response.status == 200) {
        setLoading(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Successfully Added",
          showConfirmButton: false,
        });
        const timer = setTimeout(() => {
          window.location.reload(false);
        }, 2000);
        setOpen(false);
      }
    } catch (error) {
      if (error.response.status == 400) {
        setOpen(false);
        setLoading(false);
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: false,
        });
      } else {
        alert(error);
      }
    }
  };
  const editUser = async (empId) => {
    try {
      let response = await axiosSuperAdminPrexo.get("/getInfra/" + empId);
      setImage(response.data.data.profile_picture);
      reset({
        name: response.data.data.name,
        code: response.data.data.code,
        address: response.data.data.address,
        city: response.data.data.city,
        state: response.data.data.state,
        country: response.data.data.country,
        pincode: response.data.data.pincode,
      });
      setId(response.data.data._id);
      setEditCall(true);
      setOpen(true);
    } catch (error) {
      alert(error);
    }
  };
  const handelEdit = async (data) => {
    data.imageOne = image;
    data._id = id;
    try {
      let response = await axiosSuperAdminPrexo.put("/editInfra", data);
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
        setRefresh(true);
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <>
      <BootstrapDialog
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
            Edit form
          </BootstrapDialogTitle>
        ) : (
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Add new Location
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
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              {...register("name")}
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name?.message : ""}
            />
            <TextField
              label="Code"
              variant="outlined"
              fullWidth
              {...register("code")}
              error={errors.code ? true : false}
              helperText={errors.code ? errors.code?.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              {...register("address")}
              error={errors.address ? true : false}
              helperText={errors.address ? errors.address?.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Country"
              variant="outlined"
              fullWidth
              {...register("country")}
              error={errors.country ? true : false}
              helperText={errors.country ? errors.country?.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="State"
              variant="outlined"
              fullWidth
              {...register("state")}
              error={errors.state ? true : false}
              helperText={errors.state ? errors.state?.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              {...register("city")}
              error={errors.city ? true : false}
              helperText={errors.city ? errors.city?.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Pincode"
              variant="outlined"
              fullWidth
              inputProps={{ maxLength: 6 }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              {...register("pincode")}
              error={errors.pincode ? true : false}
              helperText={errors.pincode ? errors.pincode?.message : ""}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            type="submit"
            loadingPosition="end"
            loading={loading}
            variant="contained"
            style={{ backgroundColor: "#206CE2", width: "100px" }}
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
            Add Location
          </Button>
        </Box>
      </Box>

      <Table props={{ editUser, setRefresh, refresh, serachData }} />
    </>
  );
}
