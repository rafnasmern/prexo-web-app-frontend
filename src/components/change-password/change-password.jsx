import React, { useEffect } from "react";

import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from "@mui/material";
import Logo from "../../../src/images/prexo-logo.png";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { axiosSuperAdminPrexo } from "../../axios";
// // JWT
// import jwt from "jsonwebtoken"
import jwt_decode from "jwt-decode";
// import { useJwt } from "react-jwt";
import Swal from "sweetalert2";
const theme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const schema = Yup.object().shape({
    old_password: Yup.string().required("*Required").nullable(),
    new_password: Yup.string().required("*Required").nullable(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = async (data) => {
    try {
      let token = localStorage.getItem("prexo-authentication");
      if (token) {
        const { adminId, user_type } = jwt_decode(token);
        data._id = adminId;
        let response = await axiosSuperAdminPrexo.post("/changePassword", data);
        if (response.status == 200) {
          alert(response.data.message);
          if (user_type == "MIS") {
            navigate("/mis-user-dashboard");
          } else if (user_type == "Warehouse") {
            navigate("/warehouse-in-dashboard");
          } else if (user_type == "Bag Opening") {
            navigate("/bot-dashboard");
          }
        }
      }
    } catch (error) {
      if (error.response.status == 403) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };
  useEffect(() => {
    // let admin = localStorage.getItem("prexo-authentication");
    // if (admin) {
    //   let { user_type } = jwt_decode(admin)
    //   if (user_type == "super-admin") {
    //     navigate("/admin");
    //   }
    //   else if (user_type == "MIS") {
    //     navigate("/mis-user-dashboard");
    //   }
    //   else if (user_type == "Warehouse") {
    //     navigate("/warehouse-in-dashboard");
    //   }
    //   else if (user_type == "Bag Opening") {
    //     navigate("/bot-dashboard");
    //   }
    // }
    // else {
    //   navigate("/")
    // }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 17,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
              <Typography component="h1" variant="h6" sx={{ mt: 1 }}>
                Change Password
              </Typography>
            </Box>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <TextField
                margin="normal"
                fullWidth
                id="old_password"
                label="Old Password"
                type="password"
                name="old_password"
                {...register("old_password")}
                error={errors.old_password ? true : false}
                helperText={errors.old_password?.message}
              />
              <TextField
                margin="normal"
                {...register("new_password")}
                fullWidth
                id="new_password"
                label="New Password"
                type="password"
                name="new_password"
                error={errors.new_password ? true : false}
                helperText={errors.new_password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ backgroundColor: "green" }}
              >
                Submit
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
