using UnityEngine;
using UnityEngine.SceneManagement;

public class StartGameButton : MonoBehaviour
{

    public void StartGame()
    {
        // Debug statement to confirm button click is working
        Debug.Log("Start button clicked, attempting to load game scene.");

        // Check if the game scene is loaded correctly
        try
        {
            SceneManager.LoadScene("ReflexCatch"); // Ensure this matches your game scene's exact name
            Debug.Log("Game scene loaded successfully.");
        }
        catch (System.Exception e)
        {
            Debug.LogError("Error loading scene: " + e.Message);
        }
    }
}
