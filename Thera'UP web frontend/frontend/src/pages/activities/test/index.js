import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import apiDefinitions from "@/api/apiDefinitions";

export default function PatientList() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiDefinitions.getPatientListCompleted();
        console.log(response.data.statusCode);
        if (response.data.statusCode === 200) {
          setPatients(response.data.data);
        } else {
          setError(response.message || "Failed to retrieve patient list.");
        }
      } catch (err) {
        setError("An error occurred while fetching patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (status === "loading" || loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    return null;
  }

  const doctorName = session?.user?.full_name || "Doctor";

  const handleAssignClick = (patientId) => {
    router.push(`/activities/assign/${patientId}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, Dr. {doctorName}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Patients for Today
      </Typography>

      {patients.length === 0 ? (
        <Typography>No patients found for today.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.full_name}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>
                    {new Date(patient.dob).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleAssignClick(patient.id)}
                    >
                      <AssignmentIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
