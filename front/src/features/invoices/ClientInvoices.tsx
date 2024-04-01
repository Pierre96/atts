import React, { useCallback, useEffect } from "react";
import {
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { IInvoice } from "../../lib/interfaces/IInvoice";
import {
  selectInvoices,
  selectInvoicesError,
  selectInvoicesStatus,
  selectInvoicesFilters,
  selectInvoicesPagination,
  selectInvoicesSort,
  fetchInvoices,
  selectInvoicesStatusFilter,
} from "./invoiceSlice";
import {
  FetchStatus,
} from "../../lib/constants/utilsConstants";
import { toast } from "react-toastify";
import PageTitle from "../../components/utils/Typography/PageTitle";
import {
  InvoiceConstants as IC,
  InvoiceStatus,
} from "../../lib/constants/InvoiceConstants";
import InvoiceList, { InvoiceListItem } from "../../components/InvoiceComponents/InvoiceList";

function ClientInvoices() {
  const dispatch: ThunkDispatch<any, void, any> = useDispatch();
  const invoices: IInvoice[] = useSelector(selectInvoices);
  const error = useSelector(selectInvoicesError);
  const filters = useSelector(selectInvoicesFilters);
  const pagination = useSelector(selectInvoicesPagination);
  const sort = useSelector(selectInvoicesSort);
  const invoiceStatusFilter = useSelector(selectInvoicesStatusFilter);

  

  const getInvoices = useCallback(() => {
    dispatch(
      fetchInvoices({
        pageSize: pagination.pageSize,
        pageNumber: pagination.page,
        criteria: filters,
        sort: sort,
        status: InvoiceStatus.SHARED,
      })
    );
  }, [dispatch, pagination, filters, sort, invoiceStatusFilter]);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  const formatInvoices = useCallback((): InvoiceListItem[] => {
    return invoices.map((invoice) => ({
      id: invoice.invoiceNumber, 
      name: `Facture ${invoice.invoiceNumber}` 
    }));
  }, [invoices]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 7,
          }}
        >
          <Grid item flex={1} mb={1}>
            <PageTitle title="Mes factures" />
          </Grid>
        </Grid>
          <Divider />
        <Grid mt={2}>
          <InvoiceList invoices={formatInvoices()} />
        </Grid>
      </Box>
    </Box>
  );
}

export default ClientInvoices;
