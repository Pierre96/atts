import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { INVOICE_API_URL } from "../invoices/invoiceSlice";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { toast } from "react-toastify";
import { downloadFile } from "../../utils/utils";
import PDFDialog from "../../components/utils/PDFDialog";
import { Button } from "@mui/material";
import PDFViewer from "../../components/utils/PDFViewer";
import PageTitle from "../../components/utils/Typography/PageTitle";

//styled box Container
const StyledBoxContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFF",
  borderRadius: "0.75rem",
  padding: "1rem 0.75rem",
  border: "1px solid #EAEEF4",
}));

function ClientInvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  const goBack = () => {
    navigate("/invoices");
  };

  const generateInvoicePdf = useCallback(
    (id: number, callback: (response: any) => void): void => {
      setLoading(true);
      axiosInstance({
        url: `${INVOICE_API_URL}/pdf`,
        method: "PUT",
        data: { id },
        responseType: "blob",
      })
        .then((response) => {
          callback(response);
        })
        .catch((error) => {
          toast.error("Une erreur est survenue");
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  const visualiseInvoiceHandler = useCallback((): void => {
    const visualiseCallback = (response: any) => {
      setPdfData(response?.data);
      // get the file name from the response headers
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split(";")[1].split("=")[1]
        : `invoice_${id}.pdf`;
      setPdfFileName(fileName);
    };
    if (id) generateInvoicePdf(parseInt(id), visualiseCallback);
  }, []);

  useEffect(() => {
    if (id) visualiseInvoiceHandler();
  }, [id]);

  const downloadInvoiceHandler = useCallback((): void => {
    const downloadCallback = (response: any) => {
      // get the file name from the response headers
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split(";")[1].split("=")[1]
        : `invoice_${id}.pdf`;
      downloadFile(response?.data, fileName);
    };
    if (id) generateInvoicePdf(parseInt(id), downloadCallback);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        py: 2,
      }}
    >
      <Grid container mb={3}>
        <Grid item sm={12}>
          <StyledBoxContainer>
            <Grid container justifyContent={"space-between"}>
              <Grid item>
                <Grid container spacing={1} alignItems={"center"}>
                  <Grid item>
                    <IconButton onClick={goBack}>
                      <ArrowBackIos />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <PageTitle title={pdfFileName || ''} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
                  <Button
                    // fullWidth
                    variant="outlined"
                    startIcon={<DownloadOutlinedIcon />}
                    color={"primary"}
                    sx={{
                      borderRadius: "2rem",
                      px: "1.5rem",
                      py: "0.5rem",
                    }}
                    onClick={downloadInvoiceHandler}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        fontStyle: "normal",
                      }}
                    >
                      Télécharger
                    </Typography>
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </StyledBoxContainer>
        </Grid>
      </Grid>
      <Grid container sx={{ minHeight: "90%" }}>
        <Grid
          item
          flexGrow={1}
          sx={{
            marginRight: "1rem",
          }}
        >
          <StyledBoxContainer sx={{ minHeight: "100%" }}>
            {pdfData && <PDFViewer file={pdfData} />}
            {/* <InvoiceDetailsFormContainer invoice={invoice} /> */}
          </StyledBoxContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ClientInvoiceDetail;
