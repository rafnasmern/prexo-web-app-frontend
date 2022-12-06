import axios from "axios";
export const axiosSuperAdminPrexo = axios.create({
  baseURL: "https://prexo-v1-dev-api.dealsdray.com/api/v1/superAdmin",
  headers: { "x-access-token": localStorage.getItem("prexo-authentication") },
});
export const axiosMisUser = axios.create({
  baseURL: "https://prexo-v1-dev-api.dealsdray.com/api/v1/mis",
  headers: { "x-access-token": localStorage.getItem("prexo-authentication") },
});
export const axiosWarehouseIn = axios.create({
  baseURL: "https://prexo-v1-dev-api.dealsdray.com/api/v1/warehouseIn",
  headers: { "x-access-token": localStorage.getItem("prexo-authentication") },
});
export const axiosBot = axios.create({
  baseURL: "https://prexo-v1-dev-api.dealsdray.com/api/v1/bot",
  headers: { "x-access-token": localStorage.getItem("prexo-authentication") },
});
export const axiosCharging = axios.create({
  baseURL: "https://prexo-v1-dev-api.dealsdray.com/api/v1/charging",
  headers: { "x-access-token": localStorage.getItem("prexo-authentication") },
});
export const axiosBqc = axios.create({
  baseURL: "https://prexo-v1-dev-api.dealsdray.com/api/v1/bqc",
  headers: { "x-access-token": localStorage.getItem("prexo-authentication") },
});
export const axiosSortingAgent = axios.create({
  baseURL: "https://prexo-v1-dev-api.dealsdray.com/api/v1/sorting-agnet",
  headers: { "x-access-token": localStorage.getItem("prexo-authentication") },
});
