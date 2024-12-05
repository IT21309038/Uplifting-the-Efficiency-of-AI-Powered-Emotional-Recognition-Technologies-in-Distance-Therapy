using UnityEngine;
using UnityEngine.UI;

public class ResultsDisplay : MonoBehaviour
{
    public Text errorRateText;
    public Text averageReactionTimeText;
    public Text missClicksText;
    public Text stressScoreText;
    public Text stressLevelText;

    void Start()
    {
        // Populate UI elements with results
        errorRateText.text = $"Error Rate: {ResultsManager.ErrorRate * 100:F2}%";
        averageReactionTimeText.text = $"Average Reaction Time: {ResultsManager.AverageReactionTime:F2}s";
        missClicksText.text = $"Miss Clicks: {ResultsManager.MissClicks}";
        stressScoreText.text = $"Stress Score: {ResultsManager.StressScore:F2}";
        stressLevelText.text = $"Stress Level: {ResultsManager.StressLevel}";
    }
}
