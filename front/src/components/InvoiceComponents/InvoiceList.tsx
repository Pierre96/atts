import React from "react";
import { Grid, Box, Typography, styled } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt"; // Using Receipt as a generic invoice icon
import { Link } from "react-router-dom";

const linkColor = "#A3AED0"; // Centralize link color for consistency

const CustomLink = styled(Link)(({ theme }) => ({
  color: linkColor,
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.primary.main,
  },
  "& svg": {
    color: linkColor,
  },
  "&:hover svg": {
    color: theme.palette.primary.main,
  },
  "&:hover p": {
    color: theme.palette.primary.main,
  },
}));

export interface InvoiceListItem {
  id: number;
  name: string;
  icon?: React.ReactElement; // Optional if you want different icons per invoice
}

interface InvoiceListProps {
  invoices: InvoiceListItem[];
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  return (
    <Grid container spacing={2}>
      {invoices.map((invoice) => (
        <Grid item key={invoice.id} xs={12} sm={5} md={3} lg={1}>
          <CustomLink to={`/invoice/${invoice.id}`}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ color: "black" }}
            >
              <Box sx={{ "& svg": { fontSize: 60, color: linkColor } }}>
                {invoice.icon || <ReceiptIcon />}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: 'inherit'
                }}
              >
                {invoice.name}
              </Typography>
            </Box>
          </CustomLink>
        </Grid>
      ))}
    </Grid>
  );
};

export default InvoiceList;
