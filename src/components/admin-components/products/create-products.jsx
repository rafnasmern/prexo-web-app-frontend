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
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import Table from "./view-products";
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
  const [openSecond, setOpenSecond] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editCall, setEditCall] = useState(false);
  const [id, setId] = useState(null);
  const [brands, setBrands] = useState([]);
  const [profilePreview, setProfilePreview] = useState("");
  const [profileFile, setProfileFile] = useState({});
  const [editImageData, setEditImageData] = useState({});
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosSuperAdminPrexo.post("/getBrandsAlpha");
        if (response.status === 200) {
          setBrands(response.data.data);
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchData();
  }, []);
  const handelProfile = (e) => {
    setProfilePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleClickOpen = () => {
    reset({
      name: null,
      email: null,
      contact: null,
      desigination: null,
      course: null,
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditCall(false);
    setProfilePreview("");
  };
  const handelCloseSecond = () => {
    setOpenSecond(false);
    setProfilePreview("");
  };
  const schema = Yup.object().shape({
    vendor_sku_id: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid name")
      .max(40)
      .nullable(),
    vendor_name: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid name")
      .max(40)
      .nullable(),
    model_name: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid name")
      .max(40)
      .nullable(),
    brand_name: Yup.string().required("Required"),
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
    setLoading(true);
    let muis_code = "";
    let alphebet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "123456789";
    for (var i = 0; i < 2; i++) {
      muis_code += alphebet.charAt(Math.floor(Math.random() * alphebet.length));
    }
    for (var i = 0; i < 3; i++) {
      muis_code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    try {
      data.muic = muis_code;
      data.created_at = Date.now();
      let formdata = new FormData();
      formdata.append("image", profileFile);
      for (let [key, value] of Object.entries(data)) {
        formdata.append(key, value);
      }
      let response = await axiosSuperAdminPrexo.post(
        "/createproducts",
        formdata
      );
      if (response.status == 200) {
        setLoading(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
        });
        const timer = setTimeout(() => {
          window.location.reload(false);
        }, 2000);
        setRefresh(true);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status == 400) {
        setOpen(false);
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
  const editUser = async (prdodutId) => {
    try {
      let response = await axiosSuperAdminPrexo.get(
        "/getEditProduct/" + prdodutId
      );
      reset({
        vendor_sku_id: response.data.data.vendor_sku_id,
        brand_name: response.data.data.brand_name,
        model_name: response.data.data.model_name,
        vendor_name: response.data.data.vendor_name,
      });
      setOpen(true);
      setId(response.data.data._id);
      setEditCall(true);
    } catch (error) {
      if (error.response.status == 400) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };
  const editImage = async (productId) => {
    try {
      let res = await axiosSuperAdminPrexo.post(
        "/getImageEditProdt/" + productId
      );
      if (res.status == 200) {
        setEditImageData(res.data.data);
        setProfilePreview(res.data?.data?.image);
        setOpenSecond(true);
      }
    } catch (error) {
      alert(error);
    }
  };
  const handelEdit = async (data) => {
    data._id = id;
    try {
      let response = await axiosSuperAdminPrexo.put("/editProduct", data);
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
    } catch (error) {
      if (error.response.status == 400) {
        setOpen(false);
        Swal.fire({
          position: "top-center",
          icon: "failed",
          title: error.response.data.message,
          showConfirmButton: false,
        });
      }
    }
  };
  const handelEditImage = async () => {
    if (profileFile == "") {
      alert("Please Select Image");
    } else
      try {
        let obj = {
          _id: editImageData?._id,
        };
        let formdata = new FormData();
        formdata.append("image", profileFile);
        for (let [key, value] of Object.entries(obj)) {
          formdata.append(key, value);
        }
        let response = await axiosSuperAdminPrexo.put(
          "/editProductImage",
          formdata
        );
        if (response.status == 200) {
          setOpenSecond(false);
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
      } catch (error) {
        if (error.response.status == 400) {
          setOpenSecond(false);
          Swal.fire({
            position: "top-center",
            icon: "failed",
            title: error.response.data.message,
            showConfirmButton: false,
          });
        } else {
          setOpenSecond(false);
          alert("Updation Failed");
        }
      }
    {
    }
  };
  const handleBulk = (e) => {
    e.preventDefault();
    navigate("/bulk-products");
  };
  const tabelData = useMemo(() => {
    return (
      <Table
        props={{
          editUser,
          setRefresh,
          refresh,
          editImage,
          setProductsData,
          productsData,
        }}
      />
    );
  }, [productsData]);
  return (
    <>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        key={open}
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
            Add new Product
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
            {editCall ? (
              ""
            ) : (
              <>
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
                  helperText={
                    errors.profile_picture ? errors.profile_picture.message : ""
                  }
                />
                <FormHelperText id="filled-weight-helper-text">
                  Upload Image
                </FormHelperText>
              </>
            )}
            <TextField
              label="Vendor SKU ID"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              {...register("vendor_sku_id")}
              error={errors.vendor_sku_id ? true : false}
              helperText={
                errors.vendor_sku_id ? errors.vendor_sku_id.message : ""
              }
            />
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Brand Name
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Brand Name"
                fullWidth
                {...register("brand_name")}
                error={errors.brand_name ? true : false}
                helperText={errors.brand_name ? errors.brand_name.message : ""}
                sx={{ mt: 2 }}
              >
                {brands.map((data) => (
                  <MenuItem value={data.brand_name}>{data.brand_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Model Name"
              variant="outlined"
              fullWidth
              {...register("model_name")}
              error={errors.model_name ? true : false}
              helperText={errors.model_name ? errors.model_name.message : ""}
              sx={{ mt: 1 }}
            />
            <TextField
              label="Vendor Name"
              variant="outlined"
              fullWidth
              {...register("vendor_name")}
              error={errors.vendor_name ? true : false}
              helperText={errors.vendor_name ? errors.vendor_name.message : ""}
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          {editCall ? (
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#206CE2" }}
              onClick={handleSubmit(handelEdit)}
            >
              Update
            </Button>
          ) : (
            <LoadingButton
              type="submit"
              variant="contained"
              loadingPosition="end"
              loading={loading}
              style={{ backgroundColor: "#206CE2" }}
              onClick={handleSubmit(onSubmit)}
            >
              Add
            </LoadingButton>
          )}
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={openSecond}
        fullWidth
        maxWidth="xs"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handelCloseSecond}
        >
          Edit Image
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
            <img
              src={profilePreview}
              height="60px"
              width="60px"
              style={{ borderRadius: "50%" }}
            />

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
              helperText={
                errors.profile_picture ? errors.profile_picture.message : ""
              }
            />
            <FormHelperText id="filled-weight-helper-text">
              Upload Image
            </FormHelperText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#206CE2" }}
            onClick={(e) => {
              handelEditImage(e);
            }}
          >
            Update
          </Button>
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
        <Box sx={{ maxHeight: "10px", mr: 2 }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#206CE2" }}
            onClick={handleBulk}
          >
            Bulk Add
          </Button>
        </Box>
        <Box sx={{ maxHeight: "10px" }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "green" }}
            onClick={handleClickOpen}
          >
            Add Products
          </Button>
        </Box>
      </Box>
      {tabelData}
    </>
  );
}
