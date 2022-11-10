import React, { useEffect, useState } from "react";

import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import Logo from "../../../src/images/prexo-logo.png";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { axiosSuperAdminPrexo } from "../../axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
// // JWT
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
// import { useJwt } from "react-jwt";
import Swal from "sweetalert2";
import { color } from "@mui/system";
const theme = createTheme();
/*********************************************************************** */
export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const schema = Yup.object().shape({
    user_name: Yup.string().required("*Required"),
    password: Yup.string().required("*Required"),
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = async (data) => {
    try {
      let response = await axiosSuperAdminPrexo.post("/login", {
        user_name: data.user_name,
        password: data.password,
      });

      if (response.status == 200) {
        localStorage.setItem("prexo-authentication", response.data.data.jwt);
        if (response.data.data?.user_type == "super-admin") {
          navigate("/admin");
        } else if (response.data.data?.user_type == "MIS") {
          navigate("/mis-user-dashboard");
        } else if (response.data.data?.user_type == "Warehouse") {
          navigate("/warehouse-in-dashboard");
        } else if (response.data.data?.user_type == "Bag Opening") {
          navigate("/bot-dashboard");
        } else if (response.data.data?.user_type == "Charging") {
          navigate("/charging-dashboard");
        } else if (response.data.data?.user_type == "BQC") {
          navigate("/bqc-dashboard");
        } else if (response.data.data?.user_type == "Sorting Agent") {
          navigate("/sorting-agent-dashboard");
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          icon: "error",
          title: error.response.data.data.message,
        });
      } else {
        alert(error);
      }
    }
  };
  useEffect(() => {
    let admin = localStorage.getItem("prexo-authentication");
    if (admin) {
      let { user_type } = jwt_decode(admin);
      if (user_type == "super-admin") {
        navigate("/admin");
      } else if (user_type == "MIS") {
        navigate("/mis-user-dashboard");
      } else if (user_type == "Warehouse") {
        navigate("/warehouse-in-dashboard");
      } else if (user_type == "Bag Opening") {
        navigate("/bot-dashboard");
      } else if (user_type == "Charging") {
        navigate("/charging-dashboard");
      } else if (user_type == "BQC") {
        navigate("/bqc-dashboard");
      } else if (user_type == "Sorting Agent") {
        navigate("/sorting-agent-dashboard");
      }
    } else {
      navigate("/");
    }
  }, []);
  // PASSWORD SHOW AND HIDE
  const handleClickShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              m: 5,
            }}
          >
            <Box
              sx={{
                marginTop: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={Logo} width="60vw" height="100%" />
              <Typography component="h1" variant="h6" sx={{ mt: 1 }}>
                LOGIN
              </Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <TextField
                margin="normal"
                fullWidth
                id="user_name"
                label="Username"
                name="user_name"
                autoComplete="phone"
                {...register("user_name")}
                error={errors.user_name ? true : false}
                helperText={errors.user_name?.message}
              />

              <FormControl fullWidth sx={{ mt: 2 }} variant="outlined">
                {errors.password ? (
                  <InputLabel
                    style={{ color: "#D32F2F" }}
                    htmlFor="outlined-adornment-password"
                  >
                    Password
                  </InputLabel>
                ) : (
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                )}
                <OutlinedInput
                  {...register("password")}
                  error={errors.password ? true : false}
                  helperText={errors.password?.message}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {!!errors.password && (
                  <FormHelperText error>
                    {errors.password?.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ backgroundColor: "green" }}
              >
                LOGIN
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
