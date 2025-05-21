import { Box, Card, CardContent, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Image } from "antd";
import apiDefinitions from "@/api/apiDefinitions";

const Reports = () => {
  const route = useRouter();
  const { data: session } = useSession();

  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [recordCount, setRecordCount] = useState(0);
  const [tableRefresh, setTableRefresh] = useState(false);
  const doctorId = session?.user?.id;

  useEffect(() => {
    apiDefinitions
      .getReports(paginationModel.page, paginationModel.pageSize, 0, doctorId)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setRows(res.data?.data?.data);
          setRecordCount(res.data?.data?.totalCount);
          toast.success("Data fetched successfully", res.data.message);
        } else {
          throw new Error(res.data.message || "Failed to fetch data");
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message, {
          toastId: "DoctorError",
        });
        setRows([]);
        setRecordCount(0);
      });
  }, [tableRefresh, doctorId, paginationModel]);

  const columns = [
    {
      field: "report",
      headerName: "Report",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Image
            src={params?.row?.report_url}
            alt="Report"
            width={100}
            height={60}
            style={{ borderRadius: "10px" }}
          />
        );
      },
    },
    {
      field: "doctor_name",
      headerName: "Doctor Name",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.doctor?.full_name || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "patient_name",
      headerName: "Patient Name",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.patient?.full_name || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "session_date",
      headerName: "Session Date",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.session_date || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "session_time",
      headerName: "Session Time",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.session_time || "N/A"}
          </Typography>
        );
      },
    },
  ];

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 item size={12}>
          <Card>
            <CardContent>
              <Grid2 container spacing={2}>
                <Grid2 item size={6}>
                  <Typography variant="h5" fontWeight={600}>
                    Welcome Dr. {session?.user?.full_name || "N/A"}
                  </Typography>
                </Grid2>
                <Grid2 item size={6}>
                  <Typography variant="h5" fontWeight={600}>
                    You may access reports of your patients here.
                  </Typography>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item size={12}>
          <Card sx={{ boxShadow: 2 }}>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                "& .actions": {
                  color: "text.secondary",
                },
                "& .textPrimary": {
                  color: "text.primary",
                },
              }}
            >
              <DataGrid
                getRowId={(row) => row.id}
                getRowHeight={() => "auto"}
                autoHeight={true}
                rows={rows}
                rowCount={recordCount}
                columns={columns}
                pageSizeOptions={[3, 5, 10, 25, 50, 100]}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
                disableColumnSorting
                disableColumnFilter
                sx={{
                  "& .MuiDataGrid-row:hover": {
                    cursor: "pointer",
                  },
                }}
              />
            </Box>
          </Card>
        </Grid2>
      </Grid2>
    </>
  );
};

export default Reports;
