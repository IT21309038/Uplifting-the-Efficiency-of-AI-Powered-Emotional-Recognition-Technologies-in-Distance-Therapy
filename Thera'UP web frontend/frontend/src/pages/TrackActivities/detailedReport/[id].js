import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Chip,
  LinearProgress,
  Container,
  Button, // Import the Button component
} from "@mui/material";
import { styled } from "@mui/material/styles";
import apiDefinitions from "@/api/apiDefinitions";
import Toaster from "react-hot-toast";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

export default function PatientReport() {
  const router = useRouter();
  const { id } = router.query;
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const getProgressByPatientId = async (patientId) => {
    const response = await apiDefinitions.getProgressByPatientId(patientId);
    if (response.data.statusCode === 200) {
      return response.data.data;
    }
  };

  useEffect(() => {
    if (id) {
      getProgressByPatientId(id).then((data) => setProgressData(data));
    }
  }, [id, refresh]);

  if (!progressData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={60} />
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

  const getAlertColor = (alertLevel) => {
    switch (alertLevel) {
      case "Good":
        return "success";
      case "Moderate":
        return "warning";
      case "Critical":
        return "error";
      default:
        return "default";
    }
  };

  const completionPercentage = Math.round(
    (completedActivities / totalActivities) * 100
  );

  const handleDeleteActivity = async (activityId) => {
    // Show confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    // If user confirmed the deletion
    if (result.isConfirmed) {
      try {
        setLoading(true); // Show loading state
        const response = await apiDefinitions.deleteActivityAssigned(
          patient_id,
          activityId
        );

        if (response.data.statusCode === 200) {
          Toaster.success("Activity deleted successfully!");
          setRefresh(!refresh); // Trigger refresh of data
        } else {
          Toaster.error("Failed to delete activity.");
        }
      } catch (error) {
        Toaster.error("Failed to delete activity.");
        console.error("Error deleting activity: ", error);
      } finally {
        setLoading(false); // Hide loading state
      }
    } else {
      // If user canceled, show a message
      Swal.fire({
        title: "Canceled",
        text: "The activity was not deleted.",
        icon: "error",
      });
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Patient Header */}
      <HeaderPaper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Patient Report: ID {patient_id}
        </Typography>
        <Typography variant="subtitle1">
          Progress Overview -{" "}
          {progressStatus === "FULL" ? "Completed" : "In Progress"}
        </Typography>
      </HeaderPaper>

      {/* Progress Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }} elevation={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary">
              Progress
            </Typography>
            <Typography variant="body1">
              {completedActivities} / {totalActivities} Activities
            </Typography>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{ mt: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption">
              {completionPercentage}% Complete
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary">
              Time Assigned
            </Typography>
            <Typography variant="body1">{totalTimeAssigned} minutes</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary">
              Time Remaining
            </Typography>
            <Typography variant="body1">
              {totalTimeRemaining} minutes
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Activity Cards */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Activity Progress
      </Typography>
      <Grid container spacing={3}>
        {activityProgressList.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.activity_id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {activity.activity_name}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={activity.completion_percentage}
                  sx={{ mb: 2, height: 6, borderRadius: 3 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Completion: {activity.completion_percentage}%
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                <Chip
                  label={activity.alertLevel}
                  color={getAlertColor(activity.alertLevel)}
                  size="small"
                />
                {/* Delete Button */}
                <Button
                  color="error"
                  size="small"
                  onClick={() => handleDeleteActivity(activity.activity_id)}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Overall Improvement */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }} elevation={2}>
        <Typography variant="h5" gutterBottom>
          Overall Improvement
        </Typography>
        <Typography variant="body1">
          Based on the completed activities, the patient has shown{" "}
          <strong>{progressStatus === "FULL" ? "full" : "Zero"}</strong>{" "}
          improvement in their assigned tasks.
        </Typography>
      </Paper>
    </Container>
  );
}
