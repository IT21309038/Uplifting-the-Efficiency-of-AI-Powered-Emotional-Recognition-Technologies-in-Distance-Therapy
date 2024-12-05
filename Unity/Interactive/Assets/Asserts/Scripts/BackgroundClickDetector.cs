using UnityEngine;

public class BackgroundClickDetector : MonoBehaviour
{
    private StressCalculator stressCalculator;

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
        // Detect mouse click
        if (Input.GetMouseButtonDown(0)) // Left mouse button click
        {
            // Convert the mouse position to world space
            Vector2 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);

            // Check if the click overlaps any collider
            Collider2D hitCollider = Physics2D.OverlapPoint(mousePosition);

            // Check if the click hit a valid object with "Catchable" or "Avoidable" tag
            if (hitCollider != null && (hitCollider.CompareTag("Catchable") || hitCollider.CompareTag("Avoidable")))
            {
                Debug.Log($"Clicked on object: {hitCollider.gameObject.name} with tag: {hitCollider.tag}");
                // Valid click on "Catchable" or "Avoidable"
            }
            else
            {
                Debug.Log("Miss click detected!");
                if (stressCalculator != null)
                {
                    stressCalculator.missClicks++; // Increment miss click count
                }
            }
        }
    }
   }