using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public Text scoreText;
    public TMP_Text timerText;
    public float timeLimit = 30f;
    public ObjectSpawner spawner;  // Reference to ObjectSpawner script
    private StressCalculator stressCalculator; // Reference to StressCalculator
    private bool gameEnded = false;

    private float remainingTime;


    void Start()
    {
        remainingTime = timeLimit; // Initialize remaining time
        UpdateTimerUI();
        spawner.enabled = false;  // Disable ball spawning until game starts

        // Get the StressCalculator component
        stressCalculator = GetComponent<StressCalculator>();
        if (stressCalculator == null)
        {
            Debug.LogError("StressCalculator not found on GameManager!");
        }

    }

    void Update()
    {

            remainingTime -= Time.deltaTime; // Decrease timer
            UpdateTimerUI();
            

            if (remainingTime <= 0)
            {
                EndGame();
            }
    }

    
    void UpdateTimerUI()
    {
        // Format the timer as seconds with one decimal
        timerText.text = "Time: " + Mathf.Max(remainingTime, 0).ToString("F1");
    }

    void EndGame()
    {
        if (gameEnded) return; // Prevent multiple calls
        gameEnded = true;

        Debug.Log("Game Over!");
        
        spawner.enabled = false; // Stop ball spawning
        Time.timeScale = 0f; // Stop time

        // Calculate and log the stress score
        if (stressCalculator != null)
        {
            stressCalculator.CalculateStressScore();
            SceneManager.LoadScene("ResultsScene");
        }
    }
}

