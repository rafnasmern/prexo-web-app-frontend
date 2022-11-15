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
} from "@mui/material";
import PropTypes from "prop-types";
import "yup-phone";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Table from "./view-brands";
import LoadingButton from "@mui/lab/LoadingButton";
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
  const [refresh, setRefresh] = useState(false);
  const [editCall, setEditCall] = useState(false);
  const [id, setId] = useState(null);
  const [brandData, setBrandData] = useState([]);
  const [brandCount, setBrandCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosSuperAdminPrexo.post("/getBrandIdHighest");
        if (res.status == 200) {
          setBrandCount(res.data.data);
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, [refresh]);

  const handleBulk = () => {
    navigate("/add-bulk-brand");
  };
  const handleClickOpen = () => {
    reset({
      // brand_id: null,
      // brand_name: null,
    });
    if (brandCount != 0) {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setEditCall(false);
  };
  const schema = Yup.object().shape({
    brand_name: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid name")
      .max(40)
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
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let response = await axiosSuperAdminPrexo.post("/createBrands", data);
      if (response.status == 200) {
        setLoading(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Successfully Created",
          showConfirmButton: false,
        });
        const timer = setTimeout(() => {
          window.location.reload(false)
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
  const editBrand = async (brandId) => {
    try {
      let response = await axiosSuperAdminPrexo.get("/getBrandOne/" + brandId);
      reset({
        brand_id: response.data.data.brand_id,
        brand_name: response.data.data.brand_name,
      });
      setId(response.data.data._id);
      setEditCall(true);
      setOpen(true);
    } catch (error) {
      if (error.response.status == 400) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };
  const handelEdit = async (data) => {
    data._id = id;
    try {
      let response = await axiosSuperAdminPrexo.put("/editBrand", data);
      if (response.status == 200) {
        setOpen(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Update Successfully",
          showConfirmButton: false,
        });
        const timer = setTimeout(() => {
          window.location.reload(false)
        }, 2000);
        setRefresh(true);
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
      } else {
        alert(error);
      }
    }
  };
  const tabelData = useMemo(() => {
    return (
      <Table
        props={{
          editBrand,
          setRefresh,
          refresh,
          brandData,
          setBrandData,
        }}
      />
    );
  }, [brandData]);
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
            Edit Brand
          </BootstrapDialogTitle>
        ) : (
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Add new Brand
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
              label="Brand ID"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              value={
                getValues("brand_id") == null
                  ? "brand-0" + brandCount
                  : getValues("brand_id")
              }
              {...register("brand_id")}
              error={errors.brand_id ? true : false}
              helperText={errors.brand_id ? errors.brand_id?.message : ""}
            />
            <TextField
              label="Brand Name"
              variant="outlined"
              fullWidth
              {...register("brand_name")}
              error={errors.brand_name ? true : false}
              helperText={errors.brand_name ? errors.brand_name?.message : ""}
              sx={{ mt: 2 }}
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
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#206CE2" }}
              onClick={handleSubmit(onSubmit)}
            >
              Add
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mt: 11,
          mr: 3,
          ml: 3,
        }}
      >
        <Box sx={{ maxHeight: "10px" }}>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            style={{ backgroundColor: "#206CE2" }}
            onClick={handleBulk}
          >
            Add Bulk
          </Button>
          <Button
            sx={{ m: 1 }}
            variant="contained"
            style={{ backgroundColor: "green" }}
            onClick={handleClickOpen}
          >
            Add Brand
          </Button>
        </Box>
      </Box>
      {tabelData}
    </>
  );
}
