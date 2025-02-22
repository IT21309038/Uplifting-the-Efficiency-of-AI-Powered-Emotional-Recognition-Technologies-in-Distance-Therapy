using UnityEngine;
using System.Collections.Generic;

public class StressCalculator : MonoBehaviour
{
    public List<float> reactionTimes = new List<float>();
    public int greenCaught = 0;
    public int redCaught = 0;
    public int greenMissed = 0;

    public void CalculateStressScore()
    {
        int totalInteractions = greenCaught + redCaught;
        if (totalInteractions == 0) totalInteractions = 1; // Prevent division by zero

        // Calculate metrics
        float averageReactionTime = CalculateAverage(reactionTimes);
        float reactionTimeVariance = CalculateVariance(reactionTimes, averageReactionTime);
        float errorRate = (float)redCaught / totalInteractions;
        float accuracyScore = (float)greenCaught / (greenCaught + greenMissed);

        // Stress Score formula
        float stressScore = (0.4f * averageReactionTime) + // Reaction Time
                             (0.3f * greenMissed) +        // Missed Green Balls
                             (0.4f * redCaught) -          // Red Balls Clicked
                             (0.2f * accuracyScore);       // Accuracy reduces stress

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
        ResultsManager.StressScore = stressScore;
        ResultsManager.StressLevel = stressLevel;

        Debug.Log($"Stress Score: {stressScore:F2} ({stressLevel})");
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

    private float CalculateVariance(List<float> values, float mean)
    {
        if (values.Count == 0) return 0;
        float variance = 0;
        foreach (float value in values)
        {
            variance += Mathf.Pow(value - mean, 2);
        }
        return variance / values.Count;
    }
}
