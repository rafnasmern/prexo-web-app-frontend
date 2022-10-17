import React, { useState, useEffect } from "react";
import { Box, Container, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { axiosMisUser, axiosSuperAdminPrexo } from "../../axios";
//Datatable Modules
import $ from "jquery";
import "datatables.net";

export default function Home() {
  let { userType } = useParams();
  const [page, setPage] = React.useState(0);
  const [item, setItem] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await axiosSuperAdminPrexo.post("/itemTracking");
        if (res.status == 200) {
          setItem(res.data.data);
          dataTableFun();
        }
      };
      fetchData();
    } catch (error) {
      alert(error);
    }
  }, []);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handelOrders = (e) => {
    e.preventDefault();
    navigate("/orders-import");
  };
  function dataTableFun() {
    $("#example").DataTable({
      destroy: true,
      scrollX: true,
    });
  }
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden", mt: 11 }}>
        <TableContainer>
          <Table id="example">
            <TableHead>
              <TableRow>
                <TableCell>Record.NO</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Order TimeStamp</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Buyback Category</TableCell>
                <TableCell>Partner ID</TableCell>
                <TableCell>Partner Email</TableCell>
                <TableCell>Partner Shop</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>Old Item Details</TableCell>
                <TableCell>IMEI</TableCell>
                <TableCell>GEP Order</TableCell>
                <TableCell>Base Disscount</TableCell>
                <TableCell>Diganostic</TableCell>
                <TableCell>Partner Purchase Price</TableCell>
                <TableCell>Tracking ID</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Order ID Replaced</TableCell>
                <TableCell>Deliverd With OTP</TableCell>
                <TableCell>Deliverd With Bag Exception</TableCell>
                <TableCell>GC Amount Redeemed</TableCell>
                <TableCell>GC Amount Refund</TableCell>
                <TableCell>GC Redeem Time</TableCell>
                <TableCell>GC Amount Refund Time</TableCell>
                <TableCell>Diagonstic Status</TableCell>
                <TableCell>VC Eligible</TableCell>
                <TableCell>
                  Customer Declaration Physical Defect Present
                </TableCell>
                <TableCell>Customer Declaration Physical Defect Type</TableCell>
                <TableCell>Partner Price No Defect</TableCell>
                <TableCell>Revised Partner Price</TableCell>
                <TableCell>Delivery Fee</TableCell>
                <TableCell>Exchange Facilitation Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item.map((data, index) => (
                <TableRow tabIndex={-1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.order_id?.toString()}</TableCell>
                  <TableCell>{data.order_date?.toString()}</TableCell>
                  <TableCell>{data.order_timestamp?.toString()}</TableCell>
                  <TableCell>{data.order_status?.toString()}</TableCell>
                  <TableCell>{data.buyback_category?.toString()}</TableCell>
                  <TableCell>{data.partner_id?.toString()}</TableCell>
                  <TableCell>{data.partner_email?.toString()}</TableCell>
                  <TableCell>{data.partner_shop?.toString()}</TableCell>
                  <TableCell>{data.item_id?.toString()}</TableCell>
                  <TableCell>{data.old_item_details?.toString()}</TableCell>
                  <TableCell>{data.imei?.toString()}</TableCell>
                  <TableCell>{data.gep_order?.toString()}</TableCell>
                  <TableCell>{data.base_discount?.toString()}</TableCell>
                  <TableCell>{data.diagnostic}</TableCell>
                  <TableCell>{data.partner_purchase_price}</TableCell>
                  <TableCell>{data.tracking_id}</TableCell>
                  <TableCell>{data.delivery_date?.toString()}</TableCell>
                  <TableCell>{data.order_id_replaced}</TableCell>
                  <TableCell>{data.deliverd_with_otp}</TableCell>
                  <TableCell>{data.deliverd_with_bag_exception}</TableCell>
                  <TableCell>{data.gc_amount_redeemed?.toString()}</TableCell>
                  <TableCell>{data.gc_amount_refund?.toString()}</TableCell>
                  <TableCell>{data.gc_redeem_time?.toString()}</TableCell>
                  <TableCell>
                    {data.gc_amount_refund_time?.toString()}
                  </TableCell>
                  <TableCell>{data.diagnstic_status?.toString()}</TableCell>
                  <TableCell>{data.vc_eligible?.toString()}</TableCell>
                  <TableCell>
                    {data.customer_declaration_physical_defect_present?.toString()}
                  </TableCell>
                  <TableCell>
                    {data.customer_declaration_physical_defect_type?.toString()}
                  </TableCell>
                  <TableCell>
                    {data.partner_price_no_defect?.toString()}
                  </TableCell>
                  <TableCell>
                    {data.revised_partner_price?.toString()}
                  </TableCell>
                  <TableCell>{data.delivery_fee?.toString()}</TableCell>
                  <TableCell>
                    {data.exchange_facilitation_fee?.toString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
