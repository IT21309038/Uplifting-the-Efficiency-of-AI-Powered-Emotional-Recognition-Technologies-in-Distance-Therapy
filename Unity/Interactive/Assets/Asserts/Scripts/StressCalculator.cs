using UnityEngine;
using System.Collections.Generic;

public class StressCalculator : MonoBehaviour
{
    public List<float> reactionTimes = new List<float>();
    public int greenCaught = 0;
    public int redCaught = 0;
    public int greenMissed = 0;
    public int missClicks = 0; // New field for miss clicks

    public void CalculateStressScore()
    {
        int totalInteractions = greenCaught + redCaught + missClicks;
        if (totalInteractions == 0) totalInteractions = 1; // Prevent division by zero

        // Calculate metrics
        float averageReactionTime = CalculateAverage(reactionTimes);
        float errorRate = (float)redCaught / totalInteractions;
        float accuracyScore = (float)greenCaught / Mathf.Max(greenCaught + greenMissed, 1);

        // Stress Score formula
        float stressScore = (0.4f * averageReactionTime) + // Reaction Time
                                   
                            (0.3f * greenMissed) +        // Missed Green Balls
                            (0.4f * redCaught) -          // Red Balls Clicked
                            (0.2f * accuracyScore);       // Accuracy reduces stress

        //(0.2f * missClicks) +  // Miss Clicks

        // Determine stress level
        string stressLevel = "Low Stress";
        if (stressScore > 0.7f)
        {
            stressLevel = "Highly Stressed";
        }
        else if (stressScore > 0.4f)
        {
            stressLevel = "Mildly Stressed";
        }

        // Store results in ResultsManager
        ResultsManager.ErrorRate = errorRate;
        ResultsManager.AverageReactionTime = averageReactionTime;
        ResultsManager.MissClicks = missClicks;
        ResultsManager.StressScore = stressScore;
        ResultsManager.StressLevel = stressLevel;

        Debug.Log($"Stress Score: {stressScore:F2} ({stressLevel})");
        Debug.Log($"Average Reaction Time: {averageReactionTime:F2}, Miss Clicks: {missClicks}");
    }

    private float CalculateAverage(List<float> values)
    {
        if (values.Count == 0) return 0;
        float sum = 0;
        foreach (float value in values)
        {
            sum += value;
        }
        return sum / values.Count;
    }
}