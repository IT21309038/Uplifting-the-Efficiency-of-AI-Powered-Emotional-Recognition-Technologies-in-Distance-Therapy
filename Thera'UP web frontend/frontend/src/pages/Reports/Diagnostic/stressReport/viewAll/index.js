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
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import apiDefinitions from "@/api/apiDefinitions";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";

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

export default function PatientList() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiDefinitions.getPatientListPending(
          session?.user?.id
        );
        if (response.data.statusCode === 200) {
          const mappedPatients = response.data.data.map((patient) => ({
            id: patient.id,
            name: patient.full_name,
            phone: patient.phone,
            gender: patient.gender,
            joinedAt: new Date(patient.joined_at).toLocaleDateString(),
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
    router.push(`/Reports/Diagnostic/stressReport/${patientId}`);
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
              Initial Patient Overview
            </Box>{" "}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Patient information and details
          </Typography>
        </CardContent>
      </Card>

      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="patients table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Phone
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Gender
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Joined At
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <StyledTableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.joinedAt}</TableCell>
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
