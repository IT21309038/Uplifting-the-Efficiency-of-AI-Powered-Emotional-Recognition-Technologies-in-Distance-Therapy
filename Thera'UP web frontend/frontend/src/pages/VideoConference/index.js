import {
  Box,
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

const mockData = [
  {
    id: 1,
    session_id: "S001",
    patient: { id: 1, patient_name: "John Doe" },
    doctor: { id: 1, doctor_name: "Dr. Smith" },
    date: "2025-03-15",
    time: "12:10 PM",
    duration: "30 mins",
    status: "pending",
  },
  {
    id: 2,
    session_id: "S002",
    patient: { id: 2, patient_name: "Jane Smith" },
    doctor: { id: 2, doctor_name: "Dr. Adams" },
    date: "2025-03-16",
    time: "6:45 PM",
    duration: "145 mins",
    status: "pending",
  },
  {
    id: 3,
    session_id: "S003",
    patient: { id: 3, patient_name: "Robert Brown" },
    doctor: { id: 3, doctor_name: "Dr. Wilson" },
    date: "2025-03-17",
    time: "12:50 PM",
    duration: "60 mins",
    status: "pending",
  },
  {
    id: 4,
    session_id: "S004",
    patient: { id: 4, patient_name: "Emily Davis" },
    doctor: { id: 4, doctor_name: "Dr. Johnson" },
    date: "2025-03-18",
    time: "1:00 PM",
    duration: "40 mins",
    status: "pending",
  },
  {
    id: 5,
    session_id: "S005",
    patient: { id: 5, patient_name: "Michael Scott" },
    doctor: { id: 5, doctor_name: "Dr. Martinez" },
    date: "2025-03-19",
    time: "2:00 PM",
    duration: "50 mins",
    status: "pending",
  },
  {
    id: 6,
    session_id: "S006",
    patient: { id: 6, patient_name: "Sarah Connor" },
    doctor: { id: 6, doctor_name: "Dr. Lee" },
    date: "2025-03-20",
    time: "3:00 PM",
    duration: "35 mins",
    status: "pending",
  },
  {
    id: 7,
    session_id: "S007",
    patient: { id: 7, patient_name: "David Miller" },
    doctor: { id: 7, doctor_name: "Dr. Clark" },
    date: "2025-03-21",
    time: "4:00 PM",
    duration: "55 mins",
    status: "pending",
  },
];

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

  //set rows to mock data using useEffect
  useEffect(() => {
    setRows(mockData);
    setRecordCount(mockData.length);
  }, [tableRefresh]);

  const openVideoConference = (session_id, patient_name) => {
    console.log("Opening Video Conference for Session ID: ", session_id);
    console.log("Patient Name: ", patient_name);

    // Redirect to Video Conference page with session_id and patient_name as query params
    route.push({
      pathname: "/VideoConference/conference",
      query: { session_id, patient_name },
    });
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
            {params?.row?.patient?.patient_name || "N/A"}
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
            {params?.row?.duration || "N/A"}
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
                height: 473,
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
                getRowHeight={() => "auto"}
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

export default Sessions;
