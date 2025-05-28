import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  LinearProgress,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import apiDefinitions from "@/api/apiDefinitions";
import { styled } from "@mui/material/styles";

// Custom styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  marginTop: theme.spacing(3),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    transition: "background-color 0.2s",
  },
}));

const StatusChip = styled(Box)(({ theme, percentage }) => ({
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "0.8rem",
  backgroundColor:
    percentage >= 75
      ? theme.palette.success.light
      : percentage >= 50
      ? theme.palette.warning.light
      : theme.palette.error.light,
  color:
    percentage >= 75
      ? theme.palette.success.dark
      : percentage >= 50
      ? theme.palette.warning.dark
      : theme.palette.error.dark,
}));

const StyledLinearProgress = styled(LinearProgress)(
  ({ theme, percentage }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.grey[200],
    "& .MuiLinearProgress-bar": {
      borderRadius: 4,
      background:
        percentage >= 75
          ? theme.palette.success.main
          : percentage >= 50
          ? theme.palette.warning.main
          : theme.palette.error.main,
    },
  })
);

const patientNameMapping = {
  1: "Shadhir Ameen",
  2: "Thanish Ahmed",
  3: "Kavija Sapukotana",
  4: "Ashen Pradeep",
  5: "Ashan Nirmal",
  6: "Jawiz Ahmed",
  7: "Shashika Weerakoon",
  8: "Minula Deneth",
  9: "Eraji Hegoda",
  10: "Ravisara Samaranayake",
  11: "Pasan Samarawickrama",
  12: "Ravisara Samaranayake",
  13: "Nethum Vishwadinu",
  14: "Auththara Wasala Divarathna",
  15: "Sahanjani",
  16: "Sahasrika",
  17: "Kivindu Sachintha",
  18: "Hirudaka",
  19: "Nadun Bhagya",
  20: "Razer",
};

export default function PatientList() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiDefinitions.allPatientProgress();
        if (response.data.statusCode === 200) {
          let mappedPatients = response.data.data.patients.map((patient) => ({
            id: patient.patientId,
            // Use the patient name mapping instead of `Patient ${patient.patientId}`
            name:
              patientNameMapping[patient.patientId] ||
              `Patient ${patient.patientId}`,
            assignedActivities: patient.totalAssignedActivities,
            completedActivities: patient.completedActivities,
            timeForCompletion: `${patient.totalTimeRemaining} mins`,
            completionPercentage: patient.progressPercentage,
          }));

          setPatients(mappedPatients);
        }
      } catch (error) {
        console.error("Error fetching patients: ", error);
      }
    };

    fetchPatients();
  }, []);

  const handleViewReport = (patientId) => {
    router.push(`/TrackActivities/detailedReport/${patientId}`);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
      <Card
        sx={{
          mb: 4,
          background: "linear-gradient(to right, #f5f7fa, #e4e7eb)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#1a3c34",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="span" sx={{ color: "#2196F3" }}>
              Patients Overview
            </Box>{" "}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitor patient progress and activity completion status
          </Typography>
        </CardContent>
      </Card>

      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="patients table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Patient
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Assigned
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Completed
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Time Left
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Progress
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <StyledTableRow key={patient.id}>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {patient.name}
                  </Typography>
                </TableCell>
                <TableCell>{patient.assignedActivities}</TableCell>
                <TableCell>{patient.completedActivities}</TableCell>
                <TableCell>
                  <Typography
                    color={
                      parseInt(patient.timeForCompletion) < 60
                        ? "error.main"
                        : "text.primary"
                    }
                  >
                    {patient.timeForCompletion}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <StyledLinearProgress
                      variant="determinate"
                      value={patient.completionPercentage}
                      percentage={patient.completionPercentage} // Pass the percentage as a prop
                      sx={{ width: "100px" }}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <Tooltip title="View Detailed Report">
                    <IconButton
                      onClick={() => handleViewReport(patient.id)}
                      sx={{
                        color: "#2196F3",
                        "&:hover": {
                          color: "#1976D2",
                          backgroundColor: "#e3f2fd",
                        },
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
}
