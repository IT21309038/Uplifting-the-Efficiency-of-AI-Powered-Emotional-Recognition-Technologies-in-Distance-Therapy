import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Tag } from "antd";
import { Icon } from "@iconify/react";
import apiDefinitions from "@/api/apiDefinitions";

const Sessions = () => {
  const route = useRouter();
  const { data: session } = useSession();

  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [recordCount, setRecordCount] = useState(0);
  const [tableRefresh, setTableRefresh] = useState(false);
  const doctorId = session?.user?.role.id;
  const currentMonth = new Date().toISOString().slice(0, 7);

  //get current month as 2025-03 format
  const currentMonthDate = new Date().toISOString().slice(0, 7);

  //set rows to mock data using useEffect
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/schedule/get-schedule-by-doctor/${doctorId}?sortBy=${currentMonth}`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       const data = await response.json();

  //       setRows(data.data || []);
  //       setRecordCount(data.data.length);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //     }
  //   };

  //   fetchData();
  // }, [doctorId, currentMonth, tableRefresh]);

  useEffect(() => {
    apiDefinitions
      .getSessionByDoctor(doctorId, currentMonthDate)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setRows(res.data.data);
          setRecordCount(res.data.data.length);
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
  }, [tableRefresh, doctorId, currentMonthDate]);

  const openVideoConference = (session_id, patient_name) => {
    console.log("Opening Video Conference for Session ID: ", session_id);
    console.log("Patient Name: ", patient_name);

    // Redirect to Video Conference page with session_id and patient_name as query params
    route.push({
      pathname: "/VideoConference/conference",
      query: { session_id, patient_name },
    });
  };

  const openAgoraConference = () => {
    route.push("/VideoConference/agorabuild");
  };

  const columns = [
    // ... (previous columns remain unchanged until actions) ...
    {
      field: "id",
      headerName: "ID",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      flex: 0.25,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.id || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "session_id",
      headerName: "Session ID",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      flex: 0.25,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.session_id || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "patient_name",
      headerName: "Patient Name",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      flex: 0.25,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.patient?.full_name || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      flex: 0.25,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.date || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "start_time",
      headerName: "Start Time",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      flex: 0.25,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.time || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      flex: 0.25,
      renderCell: (params) => {
        return (
          <Typography variant="caption" color="primary" fontWeight={900}>
            {params?.row?.sessionDuration || "N/A"}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      flex: 0.25,
      renderCell: (params) => {
        return (
          <Tag color="warning">{params?.row?.status || "Status Not Found"}</Tag>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      flex: 0.25,
      renderCell: (params) => {
        // Get current date and time
        const currentDateTime = new Date(); // Currently 2025-03-15 11:15 AM

        // Combine session date and time
        const sessionDateTimeStr = `${params?.row?.date} ${params?.row?.time}`;
        const sessionDateTime = new Date(sessionDateTimeStr);

        // Check if date parsing worked
        if (isNaN(sessionDateTime.getTime())) {
          console.error("Invalid date format:", sessionDateTimeStr);
          return <Box>Invalid Date</Box>;
        }

        // Calculate the enable time (10 minutes before session start)
        const enableTime = new Date(sessionDateTime.getTime() - 10 * 60000); // 10 minutes before

        // Parse duration (remove "mins" and convert to number)
        const durationMinutes = parseInt(params?.row?.duration) || 30; // Default to 30 if invalid

        // Calculate session end time
        const sessionEndTime = new Date(
          sessionDateTime.getTime() + durationMinutes * 60000
        );

        // Check if button should be enabled
        const isButtonEnabled =
          currentDateTime >= enableTime && currentDateTime <= sessionEndTime;

        // Debugging logs
        console.log({
          currentDateTime: currentDateTime.toLocaleString(),
          sessionDateTime: sessionDateTime.toLocaleString(),
          enableTime: enableTime.toLocaleString(),
          sessionEndTime: sessionEndTime.toLocaleString(),
          isButtonEnabled,
        });

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <IconButton
              color="primary"
              disabled={!isButtonEnabled}
              onClick={() => {
                if (isButtonEnabled) {
                  openVideoConference(
                    params.row.session_id,
                    params.row.patient.patient_name
                  );
                }
              }}
            >
              <Icon icon="fluent:video-32-regular" fontSize={24} />
            </IconButton>
          </Box>
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
                    List of Therapy Sessions for month of :{" "}
                    {new Date().toLocaleString("default", { month: "long" })}
                    <Button onClick={openAgoraConference}>Click</Button>
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
                getRowId={(row) => row.session_id}
                getRowHeight={() => "auto"}
                autoHeight={true}
                rows={rows}
                rowCount={recordCount}
                columns={columns}
                pageSizeOptions={[3, 5, 10, 25, 50, 100]}
                paginationMode="client"
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

export default Sessions;
