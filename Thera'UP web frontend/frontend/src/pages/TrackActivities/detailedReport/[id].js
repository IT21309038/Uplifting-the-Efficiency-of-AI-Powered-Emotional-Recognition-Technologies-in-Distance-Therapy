import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import apiDefinitions from "@/api/apiDefinitions";

// Mock API call (replace with your actual API)
const getProgressByPatientId = async (patientId) => {
  // Replace with your API call
  const response = await apiDefinitions.getProgressByPatientId(patientId);

  if (response.data.statusCode === 200) {
    return response.data.data;
  }
};

export default function PatientReport() {
  const router = useRouter();
  const { id } = router.query;
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    if (id) {
      getProgressByPatientId(id).then((data) => setProgressData(data));
    }
  }, [id]);

  if (!progressData) {
    return (
      <Box sx={{ padding: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  const {
    patient_id,
    totalActivities,
    completedActivities,
    progressStatus,
    totalTimeAssigned,
    totalTimeRemaining,
    activityProgressList,
  } = progressData;

  return (
    <Box sx={{ padding: 3 }}>
      {/* Patient Header */}
      <Typography variant="h4" gutterBottom>
        Detailed Report for Patient ID: {patient_id}
      </Typography>

      {/* Progress Status */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Progress Status
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {progressStatus === "FULL" ? "Fully Completed" : "In Progress"}
        </Typography>
        <Divider sx={{ margin: "10px 0" }} />
        <Typography variant="body1">
          {completedActivities} of {totalActivities} activities completed.
        </Typography>
        <Typography variant="body1">
          Total Time Assigned: {totalTimeAssigned} minutes
        </Typography>
        <Typography variant="body1">
          Time Remaining: {totalTimeRemaining} minutes
        </Typography>
      </Paper>

      {/* Activity Progress List */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Activity Progress
        </Typography>
        <List>
          {activityProgressList.map((activity, index) => (
            <ListItem key={activity.activity_id}>
              <ListItemText
                primary={`${activity.activity_name} (${activity.completion_percentage}% completed)`}
                secondary={`Completion Percentage: ${activity.completion_percentage}%`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Overall Improvement Section */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overall Improvement
        </Typography>
        <Typography variant="body1">
          Based on the completed activities and the progress status, we can
          conclude that the patient has shown{" "}
          {progressStatus === "FULL" ? "full" : "partial"} improvement.
        </Typography>
      </Paper>
    </Box>
  );
}
