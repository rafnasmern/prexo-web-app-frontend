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
import Table from "./view-bag";
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
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState([]);
  const [bagData, setBagData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cpc, setCpc] = useState([]);

  useEffect(() => {
    try {
      // const fetchData = async () => {
      //   let res = await axiosSuperAdminPrexo.post(
      //     "/getMasterHighest/" + "bag-master"
      //   );
      //   if (res.status == 200) {
      //     setBrandCount(res.data.data);
      //   }
      // };
      const fetchCpc = async () => {
        let response = await axiosSuperAdminPrexo.get("/getCpc");
        if (response.status == 200) {
          setCpc(response.data.data.data);
        }
      };
      // fetchData();
      fetchCpc();
    } catch (error) {
      alert(error);
    }
  }, [refresh]);
  // Get Cpc data from server
  async function getCpcData(data, cpc) {
    try {
      if (cpc == "Gurgaon_122016") {
        let res = await axiosSuperAdminPrexo.post("/getMasterHighest/" + cpc);
        if (res.status == 200) {
          setBrandCount("DDB-GGN-" + res.data.data);
        }
      } else if (cpc == "Bangalore_560067") {
        let res = await axiosSuperAdminPrexo.post("/getMasterHighest/" + cpc);
        if (res.status == 200) {
          setBrandCount("DDB-BLR-" + res.data.data);
        }
      }
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
    } catch (error) {
      alert(error);
    }
  }
  const handleClickOpen = () => {

    reset({});
    setOpen(true);
  };
  const handelBulk = (e) => {
    e.preventDefault();
    navigate("/bulk-bag");
  };
  const handleClose = () => {
    setOpen(false);
    setEditCall(false);
    setBrandCount(0);
  };
  const schema = Yup.object().shape({
    cpc: Yup.string().required("Required*").nullable(),
    name: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid name")
      .max(100)
      .nullable(),
    type_taxanomy: Yup.string()
      .required("Required*")
      .matches(/^.*((?=.*[aA-zZ\s]){1}).*$/, "Please enter valid category")
      .max(100)
      .nullable(),
    limit: Yup.number("Must be number")
      .required("Required*")
      .positive()
      .integer()
      .min(1, "Minimum is 1")
      .nullable(),
    warehouse: Yup.string().required("Required*").nullable(),
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
    data.prefix = "bag-master";
    data.sort_id = "No Status";
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
        setOpen(false);
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Bag Already Exists",
          showConfirmButton: false,
        });
      } else {
        alert(error);
      }
    }
  };
  const editbag = async (masterId) => {
    try {
      let response = await axiosSuperAdminPrexo.get(
        "/getOneMaster/" + masterId
      );
      reset({
        code: response.data.data.code,
        type_taxanomy: response.data.data.type_taxanomy,
        name: response.data.data.name,
        limit: response.data.data.limit,
        display: response.data.data.display,
        warehouse: response.data.data.warehouse,
        cpc: response.data.data.cpc,
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
  const tabelData = useMemo(() => {
    return (
      <Table
        props={{
          editbag,
          setRefresh,
          refresh,
          bagData,
          setBagData,
        }}
      />
    );
  }, [bagData]);
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
            Edit Bag
          </BootstrapDialogTitle>
        ) : (
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Add new Bag
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
              label="Bag ID"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
              value={
                getValues("code") == null
                  ? brandCount === 0
                    ? null
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
                defaultValue={getValues("cpc")}
                {...register("cpc")}
                error={errors.cpc ? true : false}
                helperText={errors.cpc?.message}
                sx={{ mt: 2 }}
              >
                {cpc.map((data) => (
                  <MenuItem
                    value={data.code}
                    onClick={() => getCpcData(data.name, data.code)}
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
                Bag Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Bag Category"
                fullWidth
                defaultValue={getValues("type_taxanomy")}
                {...register("type_taxanomy")}
                error={errors.type_taxanomy ? true : false}
                helperText={errors.type_taxanomy?.message}
                sx={{ mt: 2 }}
              >
                <MenuItem value="BOT">BOT</MenuItem>
                {/* <MenuItem value="PMT">PMT</MenuItem>
                <MenuItem value="MMT">MMT</MenuItem>
                <MenuItem value="WHT">WHT</MenuItem> */}
              </Select>
            </FormControl>
            <TextField
              label="Bag Display Name"
              variant="outlined"
              fullWidth
              {...register("name")}
              error={errors.name ? true : false}
              helperText={errors.name ? errors.name.message : ""}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Bag Limit"
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
              label="Bag Display"
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
            onClick={(e) => {
              handelBulk(e);
            }}
          >
            Bulk ADD Bag
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#206CE2" }}
            onClick={handleClickOpen}
          >
            Add Bag
          </Button>
        </Box>
      </Box>
      {tabelData}
    </>
  );
}
