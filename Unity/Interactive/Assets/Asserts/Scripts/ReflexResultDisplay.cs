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
        errorRateText.text = $" {ResultsManager.ErrorRate * 100:F2}%";
        averageReactionTimeText.text = $" {ResultsManager.AverageReactionTime:F2}s";
        //missClicksText.text = $" {ResultsManager.MissClicks}";
        stressScoreText.text = $" {ResultsManager.StressScore:F2}";
        stressLevelText.text = $" {ResultsManager.StressLevel}";

        Debug.Log($"Results Displayed!: { ResultsManager.StressScore}");
    }
}
