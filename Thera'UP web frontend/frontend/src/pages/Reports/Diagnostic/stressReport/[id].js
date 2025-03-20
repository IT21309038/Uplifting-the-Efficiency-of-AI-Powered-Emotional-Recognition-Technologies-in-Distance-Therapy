import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import apiDefinitions from "@/api/apiDefinitions";

export default function StressReport() {
  const router = useRouter();
  const [reportData, setReportData] = useState(null);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await apiDefinitions.getAllPatientDetails(id);
          console.log(response.data);
          setReportData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  if (!reportData) return <Typography>Loading...</Typography>;

  const { patient, latestGeneralInfo, latestPhysicalInfo, latestSchedule } =
    reportData.data;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ padding: "30px", backgroundColor: "#f4f6f9" }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  textAlign: "center",
                  color: "#3f51b5",
                  fontWeight: "bold",
                }}
              >
                Patient Report
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Name
                          </TableCell>
                          <TableCell>{patient.full_name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Date of Birth
                          </TableCell>
                          <TableCell>
                            {new Date(patient.dob).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Phone
                          </TableCell>
                          <TableCell>{patient.phone}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Email
                          </TableCell>
                          <TableCell>{patient.email}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={6}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Employment
                          </TableCell>
                          <TableCell>
                            {latestGeneralInfo
                              ? latestGeneralInfo.empStatus
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Civil Status
                          </TableCell>
                          <TableCell>
                            {latestGeneralInfo?.civilStatus || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Living Status
                          </TableCell>
                          <TableCell>
                            {latestGeneralInfo?.livingStatus || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Income
                          </TableCell>
                          <TableCell>
                            {latestGeneralInfo?.income || "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>

              <Grid item xs={12} mt={3}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardHeader
                    title="Latest Therapy Session"
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                  <CardContent>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Doctor: {latestSchedule.doctor.full_name}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Date: {new Date(latestSchedule.date).toLocaleDateString()}{" "}
                      at {latestSchedule.time}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Status: {latestSchedule.status}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Payment Status: {latestSchedule.paymentStatus}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
