import { useSession, getSession } from "next-auth/react";
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
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

// Mock data for patients
const mockPatients = [
  { id: 1, name: "John Doe", age: 35, gender: "Male", stressLevel: 7 },
  { id: 2, name: "Jane Smith", age: 29, gender: "Female", stressLevel: 5 },
  { id: 3, name: "Alice Johnson", age: 42, gender: "Female", stressLevel: 8 },
];

export default function PatientList() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <Typography>Loading...</Typography>;

  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"; // Redirect to login
    }
    return null;
  }

  const handleAssignClick = (patientId) => {
    router.push(`/activities/assign`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, Dr. Wimalasooriya
      </Typography>

      <Typography variant="h5" gutterBottom>
        Patients for Today
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Stress Level</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.stressLevel}/10</TableCell>
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
    </Box>
  );
}

// Server-side rendering protection
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
