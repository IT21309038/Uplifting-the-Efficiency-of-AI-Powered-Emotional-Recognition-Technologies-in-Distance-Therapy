using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public Text scoreText;
    public Text timerText;
    public float gameTime = 30f;
    private StressCalculator stressCalculator;

    private int score = 0;
    private bool gameEnded = false;

    void Start()
    {
        stressCalculator = FindAnyObjectByType<StressCalculator>();


        if (stressCalculator == null)
        {
            Debug.LogError("StressCalculator not found in the scene!");
        }
    }

    void Update()
    {
        // Update Timer
        gameTime -= Time.deltaTime;
        timerText.text = "Time: " + Mathf.CeilToInt(gameTime);

        if (gameTime <= 0)
        {
            EndGame();
        }
    }

    public void UpdateScore(int points)
    {
        score += points;
        scoreText.text = "Score: " + score;
    }

    void EndGame()
    {
        if (gameEnded) return; // Prevent multiple calls
        gameEnded = true;

        Time.timeScale = 0f;
        Debug.Log("Game Over! Final Score: " + score);

        if (stressCalculator != null)
        {
            stressCalculator.CalculateStressScore();
            SceneManager.LoadScene("ResultsReflexCatch");
        }
    }


}

