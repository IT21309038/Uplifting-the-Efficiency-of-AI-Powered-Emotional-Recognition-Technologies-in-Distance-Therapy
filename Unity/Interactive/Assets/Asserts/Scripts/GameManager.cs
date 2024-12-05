using UnityEngine;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public Text scoreText;
    public Text timerText;
    public float gameTime = 30f;

    private int score = 0;

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
        Time.timeScale = 0f;
        Debug.Log("Game Over! Final Score: " + score);
    }
}

