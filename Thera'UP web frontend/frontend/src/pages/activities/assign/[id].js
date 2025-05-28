import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Grid,
  Divider,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import apiDefinitions from "@/api/apiDefinitions";
import toast from "react-hot-toast";

// Styled components for enhanced visuals
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: "8px 24px",
  textTransform: "none",
  fontWeight: 600,
}));

export default function PatientDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [btnClicked, setBtnClicked] = useState(false);

  const [patientData, setPatientData] = useState({
    stressLevel: "",
    prefersIndoor: true,
    prefersPhysical: null,
    availableTimeMinutes: "",
    age: "",
    gender: "null",
    prefersCreative: null,
    energyLevel: "LOW",
  });

  const [recommendedActivities, setRecommendedActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState({});

  const fetchActivities = async () => {
    try {
      const payload = {
        stressLevel: patientData.stressLevel
          ? parseInt(patientData.stressLevel)
          : null,
        prefersIndoor: patientData.prefersIndoor,
        prefersPhysical: patientData.prefersPhysical,
        availableTimeMinutes: patientData.availableTimeMinutes
          ? parseInt(patientData.availableTimeMinutes)
          : null,
        age: patientData.age ? parseInt(patientData.age) : null,
        gender: patientData.gender === "null" ? null : patientData.gender,
        prefersCreative: patientData.prefersCreative,
        energyLevel: patientData.energyLevel,
      };

      const response = await apiDefinitions.activitySuggestion(payload);

      // Check the HTTP status code
      if (response.status === 200 && response.data.data) {
        // Success case with activities
        setRecommendedActivities(response.data.data);
        setSelectedActivities({});
      } else if (response.status === 404) {
        // No activities found
        setRecommendedActivities([]);
        setSelectedActivities({});
        toast.error("No Activities Were Found");
      } else {
        // Unexpected status code
        setRecommendedActivities([]);
        setSelectedActivities({});
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      // Handle errors, including 404, by checking error.response
      if (error.response && error.response.status === 404) {
        setRecommendedActivities([]);
        setSelectedActivities({});
        toast.error("No Activities Were Found");
      } else {
        // Other network or unexpected errors
        setRecommendedActivities([]);
        setSelectedActivities({});
        console.error("Error fetching activities:", error);
        toast.error("Failed to fetch activities");
      }
    }
  };

  useEffect(() => {
    if (btnClicked) {
      fetchActivities();
    }
  }, [btnClicked]);

  const handleInputChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setPatientData((prev) => ({
      ...prev,
      [field]: value === "null" ? null : value,
    }));
  };

  const handleActivitySelection = (activityId) => (event) => {
    setSelectedActivities((prev) => ({
      ...prev,
      [activityId]: event.target.checked,
    }));
  };

  const handleApplyActivities = async () => {
    const payload = {
      patient_id: id || "P004", // Using router id if available
      activities: recommendedActivities
        .filter((activity) => selectedActivities[activity.activityId])
        .map((activity) => ({
          activity_id: activity.activityId,
          allocated_duration: activity.defaultDurationMinutes,
        })),
    };

    console.log("Generated Payload:", payload);

    const response = await apiDefinitions.assignActivities(payload);
    if (response.data.statusCode === 201) {
      toast.success("Activities assigned successfully!");
    }
  };

  const handleSuggestActivities = () => {
    fetchActivities();
    setBtnClicked(!btnClicked);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4, px: 2 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: "primary.main",
          textAlign: "center",
        }}
      >
        Patient Profile (ID: {id})
      </Typography>

      {/* Patient Preferences Section */}
      <StyledCard sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ mb: 3, color: "text.primary", fontWeight: 600 }}
          >
            Patient Preferences
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Stress Level"
                type="number"
                value={patientData.stressLevel}
                onChange={handleInputChange("stressLevel")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">/10</InputAdornment>
                  ),
                }}
                helperText="Enter 0-10"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Available Time"
                type="number"
                value={patientData.availableTimeMinutes}
                onChange={handleInputChange("availableTimeMinutes")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">min</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Age"
                type="number"
                value={patientData.age}
                onChange={handleInputChange("age")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">years</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Select
                fullWidth
                variant="outlined"
                value={patientData.gender}
                onChange={handleInputChange("gender")}
              >
                <MenuItem value="null" disabled>
                  Select Gender
                </MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Select
                fullWidth
                variant="outlined"
                value={patientData.energyLevel}
                onChange={handleInputChange("energyLevel")}
              >
                <MenuItem value="LOW">Low Energy</MenuItem>
                <MenuItem value="MEDIUM">Medium Energy</MenuItem>
                <MenuItem value="HIGH">High Energy</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Select
                fullWidth
                variant="outlined"
                value={
                  patientData.prefersPhysical === null
                    ? "null"
                    : patientData.prefersPhysical
                }
                onChange={handleInputChange("prefersPhysical")}
              >
                <MenuItem value="null" disabled>
                  Physical Activity
                </MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Select
                fullWidth
                variant="outlined"
                value={
                  patientData.prefersCreative === null
                    ? "null"
                    : patientData.prefersCreative
                }
                onChange={handleInputChange("prefersCreative")}
              >
                <MenuItem value="null" disabled>
                  Creative Activity
                </MenuItem>
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={patientData.prefersIndoor}
                    onChange={handleInputChange("prefersIndoor")}
                    color="primary"
                  />
                }
                label="Prefers Indoor Activities"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleSuggestActivities}
              size="large"
            >
              Suggest Activities
            </StyledButton>
          </Box>
        </CardContent>
      </StyledCard>

      <StyledCard>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ mb: 3, color: "text.primary", fontWeight: 600 }}
          >
            Recommended Activities
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {recommendedActivities.map((activity) => (
              <Grid item xs={12} sm={6} md={6} key={activity.activityId}>
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    p: 2,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!selectedActivities[activity.activityId]}
                          onChange={handleActivitySelection(
                            activity.activityId
                          )}
                          color="primary"
                        />
                      }
                      label=""
                    />
                    <Typography variant="subtitle1" fontWeight={500}>
                      <strong>Activity Name: </strong>
                      {activity.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 5 }} // Offset to align with checkbox
                  >
                    <strong>Activity Time: </strong>
                    {activity.defaultDurationMinutes} min
                  </Typography>
                </Box>
              </Grid>
            ))}
            {recommendedActivities.length === 0 && (
              <Grid item xs={12}>
                <Typography
                  sx={{ p: 2, color: "text.secondary", textAlign: "center" }}
                >
                  No activities suggested yet
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <StyledButton
              variant="contained"
              color="success"
              onClick={handleApplyActivities}
              size="large"
            >
              Save & Apply Activities
            </StyledButton>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
}
