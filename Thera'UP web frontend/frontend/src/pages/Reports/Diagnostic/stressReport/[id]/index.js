import React, { useEffect, useState } from "react";
import apiDefinitions from "@/api/apiDefinitions";
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
import dynamic from "next/dynamic";

// Dynamically import GaugeComponent to avoid SSR issues
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

export default function StressReport() {
  const router = useRouter();
  const [reportData, setReportData] = useState(null);
  const { id } = router.query;

  const [avgReactionTime, setAvgReactionTime] = useState("");

  useEffect(() => {
    if (!id) return;
    if (id) {
      const fetchData = async () => {
        try {
          const response = await apiDefinitions.getAllPatientDetails(id);
          console.log(response.data);
          setReportData(response.data);
          setAvgReactionTime(
            response.data.data.latestStressScoreRecord?.averageReactionTime
              ? response.data.data.latestStressScoreRecord?.averageReactionTime
              : "N/A"
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  if (!reportData) return <Typography>Loading...</Typography>;

  const {
    patient,
    latestGeneralInfo,
    latestPhysicalInfo,
    latestSchedule,
    latestStressScoreRecord,
  } = reportData.data;
  const stressScore = latestStressScoreRecord?.stressScore || "N/A";

  // Determine stress level based on the new scale
  let stressLevel = "N/A";
  if (stressScore !== "N/A") {
    if (stressScore <= 1.23) stressLevel = "Low Stress";
    else if (stressScore <= 2.98) stressLevel = "Moderate Stress";
    else stressLevel = "High Stress";
  }

  // Map the stress score to a 0-100 gauge range
  const maxStress = 5; // Arbitrary max value above 2.98 for visualization
  const gaugeValue =
    stressScore !== "N/A" ? (stressScore / maxStress) * 100 : 0;

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

              <Grid item xs={12} mt={3}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardHeader
                    title="Stress Level"
                    sx={{ backgroundColor: "#3f51b5", color: "#fff" }}
                  />
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      {stressScore !== "N/A" && (
                        <GaugeComponent
                          id="stress-gauge"
                          type="semicircle"
                          value={gaugeValue}
                          minValue={0}
                          maxValue={100}
                          arc={{
                            width: 0.3,
                            padding: 0.02,
                            subArcs: [
                              {
                                limit: 24.6,
                                color: "#4caf50",
                                showTick: false,
                              }, // Low Stress (0–1.23 → 0–24.6%)
                              {
                                limit: 59.6,
                                color: "#ffca28",
                                showTick: false,
                              }, // Moderate Stress (1.23–2.98 → 24.6–59.6%)
                              { limit: 100, color: "#f44336", showTick: false }, // High Stress (>2.98 → 59.6–100%)
                            ],
                          }}
                          pointer={{
                            type: "needle",
                            color: "#000000",
                            length: 0.8,
                            width: 3,
                            animate: true,
                          }}
                          labels={{
                            valueLabel: {
                              hide: true, // Hide default value label as we display it below
                            },
                            tickLabels: {
                              type: "outer",
                              ticks: [
                                {
                                  value: 0,
                                  valueConfig: {
                                    formatTextValue: () => "Low",
                                  },
                                },
                                {
                                  value: 24.6,
                                  valueConfig: {
                                    formatTextValue: () => "Moderate",
                                  },
                                },
                                {
                                  value: 59.6,
                                  valueConfig: {
                                    formatTextValue: () => "High",
                                  },
                                },
                                {
                                  value: 100,
                                  valueConfig: {
                                    formatTextValue: () => "High",
                                  },
                                },
                              ],
                            },
                          }}
                          style={{ width: 400 }}
                        />
                      )}
                      {stressScore === "N/A" && (
                        <Typography variant="body1" color="error">
                          Stress score data unavailable
                        </Typography>
                      )}
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Avg. Reaction Time:{" "}
                        {avgReactionTime ? avgReactionTime : "N/A"} ms
                      </Typography>
                    </Box>
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
