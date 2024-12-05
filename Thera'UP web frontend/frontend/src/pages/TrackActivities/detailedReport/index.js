import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

// Mock data for detailed report
const mockDetailedReport = {
  name: "John Doe",
  assignedActivities: [
    { name: "Meditation", status: "Completed", completionTime: "30 minutes" },
    { name: "Walking in Nature", status: "Pending", completionTime: null },
    { name: "Journaling", status: "Completed", completionTime: "20 minutes" },
  ],
  stressLevelHistory: [8, 7, 6, 5, 4],
  overallImprovement: "Significant",
  therapistComments:
    "Patient has shown remarkable improvement over the last few sessions. Stress levels have reduced significantly.",
};

export default function PatientReport() {
  const router = useRouter();
  const { id } = router.query;

  const {
    name,
    assignedActivities,
    stressLevelHistory,
    overallImprovement,
    therapistComments,
  } = mockDetailedReport;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Detailed Report for {name} (ID: {id})
      </Typography>

      {/* Stress Level History */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Stress Level History
        </Typography>
        <Typography variant="body1">
          {stressLevelHistory.join(" → ")} (Lower is better)
        </Typography>
      </Paper>

      {/* Assigned Activities */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Assigned Activities
        </Typography>
        <List>
          {assignedActivities.map((activity, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${activity.name} (${activity.status})`}
                secondary={
                  activity.completionTime
                    ? `Completed in ${activity.completionTime}`
                    : "Not completed yet"
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Therapist Comments */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Therapist Comments
        </Typography>
        <Typography variant="body1">{therapistComments}</Typography>
      </Paper>

      {/* Overall Improvement */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Overall Improvement
        </Typography>
        <Typography variant="body1">{overallImprovement}</Typography>
      </Paper>
    </Box>
  );
}
