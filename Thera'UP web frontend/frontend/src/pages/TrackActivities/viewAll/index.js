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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Mock data for patients
const mockPatients = [
  {
    id: 1,
    name: "John Doe",
    assignedActivities: 10,
    completedActivities: 7,
    timeForCompletion: "2 days",
    completionPercentage: 70,
  },
  {
    id: 2,
    name: "Jane Smith",
    assignedActivities: 8,
    completedActivities: 6,
    timeForCompletion: "1 day",
    completionPercentage: 75,
  },
  {
    id: 3,
    name: "Alice Johnson",
    assignedActivities: 12,
    completedActivities: 10,
    timeForCompletion: "3 days",
    completionPercentage: 83,
  },
];

export default function PatientList() {
  const router = useRouter();

  const handleViewReport = (patientId) => {
    router.push(`/TrackActivities/detailedReport`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Patients Overview
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Assigned Activities</TableCell>
              <TableCell>Completed Activities</TableCell>
              <TableCell>Time for Completion</TableCell>
              <TableCell>Completion Percentage</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.assignedActivities}</TableCell>
                <TableCell>{patient.completedActivities}</TableCell>
                <TableCell>{patient.timeForCompletion}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">
                      {patient.completionPercentage}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={patient.completionPercentage}
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewReport(patient.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
