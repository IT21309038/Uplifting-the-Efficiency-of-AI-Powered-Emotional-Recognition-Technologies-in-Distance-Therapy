using UnityEngine;

public class BackgroundClickDetector : MonoBehaviour
{
    private StressCalculator stressCalculator;

    void Start()
    {
        stressCalculator = FindObjectOfType<StressCalculator>();
        if (stressCalculator == null)
        {
            Debug.LogError("StressCalculator not found in the scene!");
        }
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit2D hit = Physics2D.Raycast(ray.origin, ray.direction);

            if (hit.collider == null) // No object clicked
            {
                Debug.Log("Miss click detected!");
                if (stressCalculator != null)
                {
                    stressCalculator.missClicks++;
                }
            }
        }
    }
}