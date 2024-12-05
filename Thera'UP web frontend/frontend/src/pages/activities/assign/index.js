import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

// Mock stats and activities
const mockStats = {
  stressHistory: [7, 6, 8, 5, 7],
  improvement: "Moderate",
};

const mockRecommendedActivities = [
  "Meditation",
  "Walking in Nature",
  "Journaling",
];

export default function PatientDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [recommendedActivities, setRecommendedActivities] = useState(
    mockRecommendedActivities
  );
  const [newActivity, setNewActivity] = useState("");

  const handleAddActivity = () => {
    if (newActivity.trim() !== "") {
      setRecommendedActivities([...recommendedActivities, newActivity]);
      setNewActivity("");
    }
  };

  const handleApplyActivities = () => {
    alert("Activities assigned successfully!");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Patient Details (ID: {id})
      </Typography>

      {/* Stress Stats */}
      <Box sx={{ display: "flex", gap: 3, marginBottom: 3 }}>
        <Card
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #42a5f5, #478ed1)",
            color: "white",
          }}
        >
          <CardContent>
            <Typography variant="h6">Stress History</Typography>
            <Typography variant="body1">
              {mockStats.stressHistory.join(", ")}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #66bb6a, #4caf50)",
            color: "white",
          }}
        >
          <CardContent>
            <Typography variant="h6">Improvement Level</Typography>
            <Typography variant="body1">{mockStats.improvement}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Recommended Activities */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recommended Activities
        </Typography>
        <List>
          {recommendedActivities.map((activity, index) => (
            <ListItem key={index}>
              <ListItemText primary={activity} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex", marginTop: 2, gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Add New Activity"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddActivity}
          >
            Add Activity
          </Button>
        </Box>
      </Paper>

      {/* Apply Activities */}
      <Button
        variant="contained"
        color="success"
        onClick={handleApplyActivities}
        sx={{ marginTop: 2 }}
      >
        Apply Activities
      </Button>
    </Box>
  );
}
