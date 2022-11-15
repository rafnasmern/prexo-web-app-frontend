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
} from "@mui/material";
import PropTypes from "prop-types";
import "yup-phone";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import Table from "./view-tary";
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
  const [brandCount, setBrandCount] = useState(0);
  const [warehouse, setWarehouse] = useState([]);
  const navigate = useNavigate();
  const [trayData, setTrayData] = useState([]);
  const [allBrand, setAllBrand] = useState([]);
  const [allModel, setAllModel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cpc, setCpc] = useState([]);


  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosSuperAdminPrexo.post("/getBrands");
        if (res.status == 200) {
          setAllBrand(res.data.data);
        }
      };
      const fetchCpc = async () => {
        let response = await axiosSuperAdminPrexo.get("/getCpc");
        if (response.status == 200) {
          setCpc(response.data.data.data);
        }
      };
      fetchData();
      fetchCpc();
    } catch (error) {
      alert(error);
    }
  }, []);
  const fetchTypeWiseId = async (e, type) => {
    e.preventDefault();
    try {
      let res = await axiosSuperAdminPrexo.post("/trayIdGenrate/" + type);
      if (res.status == 200) {
        setBrandCount(type + res.data.data);
        if (type == "BOT" && res.data.data > "2251") {
          alert("BOT Tray Maximum ID NO 2251");
          handleClose();
        } else if (type == "MMT" && res.data.data > "8051") {
          alert("MMT Tray Maximum ID NO 8051");
          handleClose();
        } else if (type == "WHT" && res.data.data > "1501") {
          alert("WHT Tray Maximum ID NO  1501");
          handleClose();
        } else if (type == "PMT" && res.data.data > "8151") {
          alert("PMT Tray Maximum ID NO  8151");
          handleClose();
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosSuperAdminPrexo.post("/getWarehouse");
        if (res.status == 200) {
          setWarehouse(res.data.data);
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);

  const handleClickOpen = () => {
    reset({
      // brand_id: null,
      // brand_name: null,
    });

    setOpen(true);
  };
  const handelBulk = (e) => {
    e.preventDefault();
    navigate("/bulk-tray");
  };
  const handleClose = () => {
    setOpen(false);
    setEditCall(false);
    setBrandCount(0);
  };
  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid name")
      .max(100)
      .nullable(),
    type_taxanomy: Yup.string().required("Required*").nullable(),
    warehouse: Yup.string().required("Required*").nullable(),
    limit:  Yup
    .number("Must be number")
    .required("Required*")
    .positive()
    .integer()
    .min(1, "Minimum is 1")
    .nullable(),
    brand: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid brand")
      .max(100)
      .nullable(),
    model: Yup.string().required("Required*").max(100).nullable(),
    display: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid display name")
      .max(100)
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
    setLoading(true);
    data.prefix = "tray-master";
    data.sort_id = "Open";
    data.created_at = Date.now();
    data.code = brandCount;
    try {
      let response = await axiosSuperAdminPrexo.post("/createMasters", data);
      if (response.status == 200) {
        setLoading(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Successfully Created",
          showConfirmButton: false,
        });
        const timer = setTimeout(() => {
          window.location.reload(false);
        }, 2000);
        setRefresh((refresh) => !refresh);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status == 400) {
        handleClose()
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Tray Already Exists",
          showConfirmButton: false,
        });
      } else {
        alert(error);
      }
    }
  };
  const editTray = async (masterId) => {
    try {
      let response = await axiosSuperAdminPrexo.get(
        "/getOneMaster/" + masterId
      );
      reset({
        code: response.data.data.code,
        type_taxanomy: response.data.data.type_taxanomy,
        name: response.data.data.name,
        limit: response.data.data.limit,
        display: response.data.data.name,
        model: response.data.data.model,
        brand: response.data.data.brand,
        warehouse: response.data.data.warehouse,
        cpc:response.data.data.cpc
      });
      setId(response.data.data._id);
      setEditCall(true);
      setOpen(true);
    } catch (error) {
      if (error.response.status == 400) {
        alert("You can't Edit This Tray");
      } else {
        alert(error);
      }
    }
  };
  // Get Cpc data from server
  async function getCpcData(data) {
    try {
      let obj = {
        name: data,
      };
      let response = await axiosSuperAdminPrexo.post(
        "/getWarehouseByLocation",
        obj
      );
      if (response.status == 200) {
        setWarehouse(response.data.data.warehouse);
      }
    } catch (error) {}
  }
  const handelEdit = async (data) => {
    data._id = id;
    try {
      let response = await axiosSuperAdminPrexo.put("/editMaster", data);
      if (response.status == 200) {
        setOpen(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Successfully Updated",
          showConfirmButton: false,
        });
        const timer = setTimeout(() => {
          window.location.reload(false);
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
  /* Fetch model */
  const fetchModel = async (e, brandName) => {
    e.preventDefault();
    try {
      let res = await axiosSuperAdminPrexo.post(
        "/get-product-model/" + brandName
      );
      if (res.status == 200) {
        setAllModel(res.data.data);
      }
    } catch (error) {
      alert(error);
    }
  };
  const tabelData = useMemo(() => {
    return (
      <Table
        props={{
          editTray,
          setRefresh,
          refresh,
          trayData,
          setTrayData,
        }}
      />
    );
  }, [trayData]);
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
            Edit Tray
          </BootstrapDialogTitle>
        ) : (
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Add new Tray
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
              label="Tray ID"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              value={
                getValues("code") == null
                  ? brandCount === 0
                    ? ""
                    : brandCount
                  : getValues("code")
              }
            />
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                CPC
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Cpc"
                fullWidth
                {...register("cpc")}
                defaultValue={getValues("cpc")}
                error={errors.cpc ? true : false}
                helperText={errors.cpc?.message}
                sx={{ mt: 2 }}
              >
                {cpc.map((data) => (
                  <MenuItem
                    value={data.code}
                    onClick={() => getCpcData(data.name)}
                  >
                    {data.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Warehouse
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Warehouse"
                fullWidth
                defaultValue={getValues("warehouse")}
                {...register("warehouse")}
                error={errors.warehouse ? true : false}
                helperText={errors.warehouse?.message}
                sx={{ mt: 2 }}
              >
                {warehouse.map((data) => (
                  <MenuItem value={data.name}>{data.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                Tray Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Bag Category"
                fullWidth
                {...register("type_taxanomy")}
                defaultValue={getValues("type_taxanomy")}
                error={errors.type_taxanomy ? true : false}
                helperText={errors.type_taxanomy?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem
                  value="BOT"
                  onClick={(e) => {
                    fetchTypeWiseId(e, "BOT");
                  }}
                >
                  BOT
                </MenuItem>
                <MenuItem
                  value="PMT"
                  onClick={(e) => {
                    fetchTypeWiseId(e, "PMT");
                  }}
                >
                  PMT
                </MenuItem>
                <MenuItem
                  value="MMT"
                  onClick={(e) => {
                    fetchTypeWiseId(e, "MMT");
                  }}
                >
                  MMT
                </MenuItem>
                <MenuItem
                  value="WHT"
                  onClick={(e) => {
                    fetchTypeWiseId(e, "WHT");
                  }}
                >
                  WHT
                </MenuItem>
              </Select>
            </FormControl>
            {getValues("type_taxanomy") == "WHT" ? (
              <>
                <FormControl fullWidth>
                  <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                    Select Brand
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="Bag Category"
                    fullWidth
                    {...register("brand")}
                    error={errors.brand ? true : false}
                    helperText={errors.brand ? errors.brand.message : ""}
                    sx={{ mt: 2 }}
                  >
                    {allBrand.map((brandData) => (
                      <MenuItem
                        value={brandData.brand_name}
                        onClick={(e) => {
                          fetchModel(e, brandData.brand_name);
                        }}
                      >
                        {brandData.brand_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ pt: 2 }} id="demo-simple-select-label">
                    Select Model
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label="Bag Category"
                    fullWidth
                    {...register("model")}
                    error={errors.model ? true : false}
                    helperText={errors.model ? errors.model.message : ""}
                    sx={{ mt: 2 }}
                  >
                    {allModel.map((modelData) => (
                      <MenuItem value={modelData.model_name}>
                        {modelData.model_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <TextField
                  label="Brand"
                  variant="outlined"
                  fullWidth
                  {...register("brand")}
                  error={errors.brand ? true : false}
                  helperText={errors.brand ? errors.brand.message : ""}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Model"
                  variant="outlined"
                  fullWidth
                  {...register("model")}
                  error={errors.model ? true : false}
                  helperText={errors.model ? errors.model.message : ""}
                  sx={{ mt: 2 }}
                />
              </>
            )}

            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              {...register("name")}
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name.message : ""}
              sx={{ mt: 2 }}
            />

            <TextField
              label="Limit"
              variant="outlined"
              fullWidth
              inputProps={{ maxLength: 2 }}
              onPaste={(e) => {
                e.preventDefault();
                return false;
              }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              {...register("limit")}
              error={errors.limit ? true : false}
              helperText={errors.limit ? errors.limit.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Display Name"
              variant="outlined"
              fullWidth
              {...register("display")}
              error={errors.display ? true : false}
              helperText={errors.display ? errors.display.message : ""}
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
            <LoadingButton
              type="submit"
              loadingPosition="end"
              loading={loading}
              variant="contained"
              style={{ backgroundColor: "#206CE2" }}
              onClick={handleSubmit(onSubmit)}
            >
              Add
            </LoadingButton>
          )}
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
            sx={{ mr: 2 }}
            variant="contained"
            style={{ backgroundColor: "#206CE2" }}
            onClick={(e) => handelBulk(e)}
          >
            Bulk ADD Tray
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "green" }}
            onClick={handleClickOpen}
          >
            Add Tray
          </Button>
        </Box>
      </Box>
      {tabelData}
    </>
  );
}
