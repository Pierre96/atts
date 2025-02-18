import React, { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../services/axios";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Input,
  Tooltip,
  Typography,
} from "@mui/material";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
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
  setFilters,
  setSort,
  setPagination,
  selectInvoicesStatusFilter,
  getSelectedInvoices,
  selectAllInvoices,
  deselectAllInvoices,
  selectInvoice,
  deselectInvoice,
  getIsInvoiceSelected,
  getIsAllInvoicesSelected,
  INVOICE_API_URL,
} from "./invoiceSlice";
import {
  FetchStatus,
  Filter,
  FilterType,
  ROLES,
  SortDirection,
  TableColumn,
} from "../../lib/constants/utilsConstants";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import PageTitle from "../../components/utils/Typography/PageTitle";
import MuiButton from "../../components/Form/MuiButton";
import {
  InvoiceConstants as IC,
  InvoiceStatus,
} from "../../lib/constants/InvoiceConstants";
import { ColumnType as CT } from "../../lib/constants/utilsConstants";
import StyledLink from "../../components/utils/Typography/StyledLink";
import MuiTable from "../../components/MuiTable/MuiTable";
import {
  downloadFile,
  formatNumberToEuro,
  formatTimestampToFrenchDate,
  getFiltersOptionsFromColumns,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
  hasSVAConsumptions,
} from "../../utils/utils";
import InvoiceStatusContainer from "../../components/utils/InvoiceStatusContainer";
import { Upload } from "@mui/icons-material";
import UploadInvoicesDialog from "../../components/UploadInvoicesDialog/UploadInvoicesDialog";
import FilterButton from "../../components/Filters/FilterButton";
import StatusFilterButton from "../../components/Filters/StatusFilterButton";
import ActionsListMenu, {
  ActionListItem,
} from "../../components/utils/ActionsListMenu";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import FolderZipOutlinedIcon from "@mui/icons-material/FolderZipOutlined";
import AttachEmailOutlinedIcon from "@mui/icons-material/AttachEmailOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import useRole from "../../hooks/useRole";
import ConfirmationPopup from "../../components/utils/ConfirmationPopup";
import SendInvoiceEmailModal from "../../components/InvoiceComponents/SendInvoiceEmailModal";

function Invoices() {
  const dispatch: ThunkDispatch<any, void, any> = useDispatch();
  const invoices: IInvoice[] = useSelector(selectInvoices);
  const invoicesStatus: FetchStatus = useSelector(selectInvoicesStatus);
  const error = useSelector(selectInvoicesError);
  const filters = useSelector(selectInvoicesFilters);
  const pagination = useSelector(selectInvoicesPagination);
  const sort = useSelector(selectInvoicesSort);
  const invoiceStatusFilter = useSelector(selectInvoicesStatusFilter);
  const selectedInvoices = useSelector(getSelectedInvoices);
  // const isAllInvoicesSelected = useSelector(getIsAllInvoicesSelected);
  // const isInvoiceSelected = useSelector(state => getIsInvoiceSelected());
  const isAdminAllowed = useRole([ROLES.ADMIN]);

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [openSendDialog, setOpenSendDialog] = useState(false);

  const invoicesColumns: TableColumn[] = useMemo(
    () => [
      {
        field: "checkmark",
        renderHeader: () => {
          return (
            <Checkbox
              sx={{ padding: 0 }}
              checked={isAllInvoicesSelected()}
              onChange={toggleSelectAllInvoices}
            />
          );
        },
        renderCell: (row: IInvoice) => {
          return (
            <Checkbox
              sx={{ padding: 0 }}
              checked={isInvoiceSelected(row[IC.INVOICE_NUMBER])}
              onChange={(event) =>
                selectInvoiceClickHandler(event, row[IC.INVOICE_NUMBER])
              }
            />
          );
        },
      },
      {
        field: IC.INVOICE_NUMBER,
        label: "Numéro",
        columnType: CT.NUMBER,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <StyledLink to={`/invoice/${row[IC.INVOICE_NUMBER]}`}>
              {row[IC.INVOICE_NUMBER]}
            </StyledLink>
          );
        },
      },
      {
        field: IC.INVOICE_CREATONDATE,
        label: "Date de facture",
        columnType: CT.DATE,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              {row[IC.INVOICE_CREATONDATE] &&
                formatTimestampToFrenchDate(+row[IC.INVOICE_CREATONDATE])}
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_STARTPERIOD,
        label: "Début de période",
        columnType: CT.DATE,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              {row[IC.INVOICE_STARTPERIOD] &&
                formatTimestampToFrenchDate(+row[IC.INVOICE_STARTPERIOD])}
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_ENDPERIOD,
        label: "Fin de période",
        columnType: CT.DATE,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              {row[IC.INVOICE_ENDPERIOD] &&
                formatTimestampToFrenchDate(+row[IC.INVOICE_ENDPERIOD])}
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_CLIENT,
        label: "Client",
        columnType: CT.TEXT,
        filterOperators: [
          FilterType.EQUALS,
          FilterType.CONTAINS,
          FilterType.STARTS_WITH,
          FilterType.ENDS_WITH,
        ],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <StyledLink to={`/client/${row?.client?.clientId}`}>
              <Tooltip title={row.client.name} placement="top">
                <Typography
                  variant="body1"
                  noWrap
                  sx={{
                    maxWidth: "200px",
                  }}
                >
                  {row.client.name}
                </Typography>
              </Tooltip>
            </StyledLink>
          );
        },
      },
      {
        field: IC.INVOICE_SPECIAL_NUMBERS,
        label: "Numéros spéciaux",
        columnType: CT.BOOLEAN,
        filterOperators: [FilterType.EQUALS],
        // isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              <Grid container>
                <Grid item>
                  {hasSVAConsumptions(row) ? (
                    <CheckCircleOutlineRoundedIcon color="success" />
                  ) : (
                    <HighlightOffRoundedIcon color="error" />
                  )}
                </Grid>
              </Grid>
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_TTCAMOUNT,
        label: "Montant TTC",
        columnType: CT.NUMBER,
        filterOperators: [FilterType.EQUALS, FilterType.MIN, FilterType.MAX],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <Box>
              {row[IC.INVOICE_TTCAMOUNT] &&
                formatNumberToEuro(+row[IC.INVOICE_TTCAMOUNT])}
            </Box>
          );
        },
      },
      {
        field: IC.INVOICE_STATUS,
        label: "Statut",
        // columnType: CT.TEXT,
        // filterOperators: [
        //   FilterType.EQUALS,
        //   FilterType.CONTAINS,
        //   FilterType.STARTS_WITH,
        //   FilterType.ENDS_WITH,
        // ],
        isSortable: true,
        renderCell: (row: IInvoice) => {
          return (
            <>
              <InvoiceStatusContainer
                status={getInvoiceStatusLabel(
                  row[IC.INVOICE_STATUS] as InvoiceStatus
                )}
                bgColor={
                  getInvoiceStatusColor(
                    row[IC.INVOICE_STATUS] as InvoiceStatus
                  )[0]
                }
                color={
                  getInvoiceStatusColor(
                    row[IC.INVOICE_STATUS] as InvoiceStatus
                  )[1]
                }
              />
            </>
          );
        },
      },
    ],
    [isInvoiceSelected, isAllInvoicesSelected]
  );

  const exportZipHandler = () => {
    axiosInstance
      .get(`${INVOICE_API_URL}/zip/${selectedInvoices.join(",")}`, {
        responseType: "blob",
        // params: {
        //   invoiceIds: selectedInvoices.join(",")
        // }
      })
      .then((response) => {
        downloadFile(response.data, "factures.zip");
      })
      .catch((error) => {
        console.error("Error exporting invoices:", error);
        toast.error("Erreur lors de l'export des factures");
      });
  };

  const shareSelectedInvoicesHandler = () => {
    axiosInstance
      .put(`${INVOICE_API_URL}/share/${selectedInvoices.join(",")}`)
      .then((response) => {
        console.log(response);
        toast.success("Factures partagées avec succès");
        getInvoices();
      })
      .catch((error) => {
        console.error("Error sharing invoices:", error);
        toast.error("Erreur lors du partage des factures");
      });
  };

  const deleteSelectedInvoicesHandler = () => {
    axiosInstance
      .delete(`${INVOICE_API_URL}/${selectedInvoices.join(",")}`)
      .then((response) => {
        toast.success("Factures supprimées avec succès");
        getInvoices();
      })
      .catch((error) => {
        console.error("Error deleting invoices:", error);
        toast.error("Erreur lors de la suppression des factures");
      });
  };

  const actionsListMenuItems: ActionListItem[] = [
    {
      icon: <CheckCircleOutlineOutlinedIcon />,
      label: "Partager au client",
      action: () => {
        console.log("Partager au client");
        shareSelectedInvoicesHandler();
      },
      isInDividedGroup: false,
      isAllowed: isAdminAllowed,
    },
    {
      icon: <FolderZipOutlinedIcon />,
      label: "Exporter en Zip",
      action: () => {
        console.log("Exporter en Zip");
        exportZipHandler();
      },
      isInDividedGroup: false,
      isAllowed: true,
    },
    {
      icon: <AttachEmailOutlinedIcon />,
      label: "Envoyer par email",
      action: () => {
        setOpenSendDialog(true);
      },
      isInDividedGroup: false,
      isAllowed: isAdminAllowed,
    },
    {
      icon: <DeleteOutlinedIcon />,
      label: "Supprimer",
      action: () => {
        console.log("Supprimer");
        deleteSelectedInvoicesHandler();
      },
      isInDividedGroup: true,
      isAllowed: isAdminAllowed,
    },
  ];

  function isInvoiceSelected(invoiceId: number) {
    return selectedInvoices.includes(invoiceId);
  }

  function isAllInvoicesSelected() {
    return invoices.length > 0 && selectedInvoices.length === invoices.length;
  }

  function toggleSelectAllInvoices(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      dispatch(selectAllInvoices());
    } else {
      dispatch(deselectAllInvoices());
    }
  }

  function selectInvoiceClickHandler(
    event: React.ChangeEvent<HTMLInputElement>,
    invoiceId: number
  ) {
    if (event.target.checked) {
      dispatch(selectInvoice(invoiceId));
    } else {
      dispatch(deselectInvoice(invoiceId));
    }
  }

  const filtersOptions = useMemo(
    () => getFiltersOptionsFromColumns(invoicesColumns),
    [invoicesColumns]
  );

  const applyFiltersHandler = (filters: Filter[]) => {
    dispatch(setFilters(filters));
  };

  const resetFiltersHandler = () => {
    dispatch(setFilters([]));
  };

  const onSortHandler = (sortBy: string, sortDirection: SortDirection) => {
    console.log(sortBy, sortDirection);
    dispatch(setSort({ sortBy, sortDirection }));
  };

  const onRowsPerPageChangeHandler = (rowsPerPage: number) => {
    dispatch(setPagination({ ...pagination, page: 0, pageSize: rowsPerPage }));
    dispatch(deselectAllInvoices());
  };

  const onPageChangeHandler = (page: number) => {
    dispatch(setPagination({ ...pagination, page }));
    dispatch(deselectAllInvoices());
  };

  const getInvoices = useCallback(() => {
    dispatch(
      fetchInvoices({
        pageSize: pagination.pageSize,
        pageNumber: pagination.page,
        criteria: filters,
        sort: sort,
        status: invoiceStatusFilter,
      })
    );
  }, [dispatch, pagination, filters, sort, invoiceStatusFilter]);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const deleteDraftInvoices = useCallback(() => {
    axiosInstance
      .delete(`${INVOICE_API_URL}/draft`)
      .then(() => {
        toast.success("Brouillons supprimés avec succès");
        getInvoices();
      })
      .catch((error) => {
        console.error("Error deleting draft invoices:", error);
        toast.error("Erreur lors de la suppression des brouillons");
      });
  }, [getInvoices]);

  const handleDelete = () => {
    setOpenConfirmation(true);
  };

  const handleConfirmDelete = () => {
    deleteDraftInvoices();
    setOpenConfirmation(false);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

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
          <Grid item flex={1}>
            <PageTitle title="Mes factures" />
          </Grid>
          {isAdminAllowed && (
            <>
              <Grid item>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  Importer des factures
                </Button>
              </Grid>
              <Grid item ml={1}>
                <MuiButton
                  color="error"
                  startIcon={<DeleteIcon />}
                  label="Supprimer"
                  onClick={handleDelete}
                  disabled={invoices?.length === 0}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Grid item mr={2}>
            <StatusFilterButton />
          </Grid>
          <Grid item mr={2}>
            <FilterButton
              filters={filters}
              applyFilters={applyFiltersHandler}
              resetFilters={resetFiltersHandler}
              filtersOptions={filtersOptions}
            />
          </Grid>
          <Grid item>
            <ActionsListMenu
              items={actionsListMenuItems}
              disabled={selectedInvoices.length === 0}
            />
          </Grid>
        </Grid>
        <Grid mt={2}>
          <MuiTable
            columns={invoicesColumns}
            rows={invoices}
            status={invoicesStatus}
            sort={sort || null}
            onSort={onSortHandler}
            pagination={pagination}
            onPageChange={onPageChangeHandler}
            onRowsPerPageChange={onRowsPerPageChangeHandler}
          />
        </Grid>
      </Box>
      {uploadDialogOpen && (
        <UploadInvoicesDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          getInvoices={getInvoices}
        />
      )}
      {openConfirmation && (
        <ConfirmationPopup
          open={openConfirmation}
          title="Supprimer les brouillons"
          message="Êtes-vous sûr de vouloir supprimer tous les brouillons?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseConfirmation}
        />
      )}
      {
        openSendDialog && (
          <SendInvoiceEmailModal
            open={openSendDialog}
            onClose={() => setOpenSendDialog(false)}
            invoiceIds={selectedInvoices}
          />
        )
      }
    </Box>
  );
}

export default Invoices;
