using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class ResultsDisplay : MonoBehaviour
{
    public TMP_Text errorRateText;
    public TMP_Text averageReactionTimeText;
    public TMP_Text stressScoreText;
    public TMP_Text stressLevelText;

    void Start()
    {
        // Populate UI elements with results
        errorRateText.text = $"Error Rate: {ResultsManager.ErrorRate * 100:F2}%";
        averageReactionTimeText.text = $"Average Reaction Time: {ResultsManager.AverageReactionTime:F2}s";
        stressScoreText.text = $"Stress Score: {ResultsManager.StressScore:F2}";
        stressLevelText.text = $"Stress Level: {ResultsManager.StressLevel}";
    }
}
