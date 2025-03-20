import React from "react";
import * as d3 from "d3";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { styled } from "@mui/system";

const StressReport = () => {
  const reactionTimeData = [
    { interval: "0-5s", reactionTime: 300, stressLevel: 85 },
    { interval: "5-10s", reactionTime: 280, stressLevel: 80 },
    { interval: "10-15s", reactionTime: 320, stressLevel: 88 },
    { interval: "15-20s", reactionTime: 290, stressLevel: 75 },
    { interval: "20-25s", reactionTime: 310, stressLevel: 78 },
  ];

  React.useEffect(() => {
    drawReactionTimeGraph();
    drawStressTrendGraph();
  }, []);

  const drawReactionTimeGraph = () => {
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Clear the previous graph if it exists
    d3.select("#reactionTimeGraph").select("svg").remove();

    const svg = d3
      .select("#reactionTimeGraph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scalePoint()
      .domain(reactionTimeData.map((d) => d.interval))
      .range([0, width])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(reactionTimeData, (d) => d.reactionTime)])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line()
      .x((d) => x(d.interval))
      .y((d) => y(d.reactionTime))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(reactionTimeData)
      .attr("fill", "none")
      .attr("stroke", "#3f51b5")
      .attr("stroke-width", 3)
      .attr("d", line);

    svg
      .selectAll(".dot")
      .data(reactionTimeData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.interval))
      .attr("cy", (d) => y(d.reactionTime))
      .attr("r", 6)
      .attr("fill", "#3f51b5")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
  };

  const drawStressTrendGraph = () => {
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Clear the previous graph if it exists
    d3.select("#stressTrendGraph").select("svg").remove();

    const svg = d3
      .select("#stressTrendGraph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(reactionTimeData.map((d) => d.interval))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear().domain([0, 100]).nice().range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(reactionTimeData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.interval))
      .attr("y", (d) => y(d.stressLevel))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.stressLevel))
      .attr("fill", "#ff5722")
      .attr("opacity", 0.8);
  };

  const averageReactionTime =
    reactionTimeData.reduce((acc, cur) => acc + cur.reactionTime, 0) /
    reactionTimeData.length;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box
              sx={{
                padding: "30px",
                fontFamily: "Roboto, sans-serif",
                backgroundColor: "#f4f6f9",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  textAlign: "center",
                  color: "#3f51b5",
                  fontWeight: "bold",
                }}
              >
                Initial Diagnostic Report
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <CardHeader
                      title="Patient Information"
                      sx={{ backgroundColor: "#3f51b5", color: "#fff" }}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TableContainer component={Paper}>
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Patient Name
                                  </TableCell>
                                  <TableCell>K R Sapukotana</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Date of Birth
                                  </TableCell>
                                  <TableCell>2000/12/27</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Gender
                                  </TableCell>
                                  <TableCell>Male</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Patient ID
                                  </TableCell>
                                  <TableCell>RS-123456</TableCell>
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
                                    Status
                                  </TableCell>
                                  <TableCell>Unemployed</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Civil Status
                                  </TableCell>
                                  <TableCell>Divorced</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Living Situation
                                  </TableCell>
                                  <TableCell>Homeless</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: "bold" }}>
                                    Income Status
                                  </TableCell>
                                  <TableCell>In Debt</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Graphs Section */}
              <Grid container spacing={3} mt={4}>
                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#3f51b5" }}
                  >
                    Reaction Time Graph (5-Second Intervals)
                  </Typography>
                  <Box id="reactionTimeGraph" />
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#ff5722" }}
                  >
                    Stress Level Trends
                  </Typography>
                  <Box id="stressTrendGraph" />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardHeader
                    title="Summary"
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                  />
                  <CardContent>
                    <Typography sx={{ fontWeight: "bold" }}>
                      <b>Initial Stress Diagnostic:</b> Highly Stressed
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      <b>Average Reaction Time:</b>{" "}
                      {averageReactionTime.toFixed(2)} ms
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      <b>Maximum Stress Level:</b>{" "}
                      {Math.max(...reactionTimeData.map((d) => d.stressLevel))}%
                    </Typography>
                    <Typography sx={{ fontWeight: "bold" }}>
                      <b>Minimum Stress Level:</b>{" "}
                      {Math.min(...reactionTimeData.map((d) => d.stressLevel))}%
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
};

export default StressReport;
