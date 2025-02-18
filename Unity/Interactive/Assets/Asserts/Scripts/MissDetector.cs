using UnityEngine;

public class MissDetector : MonoBehaviour
{
    private StressCalculator stressCalculator;

    void Start()
    {
        // Find the StressCalculator in the scene
        stressCalculator = FindAnyObjectByType<StressCalculator>();
        if (stressCalculator == null)
        {
            Debug.LogError("StressCalculator not found in the scene!");
        }
    }

    void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Catchable"))
        {
            Debug.Log("Green ball missed!");
            if (stressCalculator != null)
            {
                stressCalculator.greenMissed++;
            }
        }

        // Destroy the object after detecting
        Destroy(collision.gameObject);
    }
}