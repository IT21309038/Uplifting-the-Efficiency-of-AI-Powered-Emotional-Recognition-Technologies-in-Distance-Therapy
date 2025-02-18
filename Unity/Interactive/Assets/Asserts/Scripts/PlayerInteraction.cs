using UnityEngine;

public class PlayerInteraction : MonoBehaviour
{
    public int score = 0;
    private StressCalculator stressCalculator;

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        stressCalculator = FindAnyObjectByType<StressCalculator>();
        if (stressCalculator == null)
        {
            Debug.LogError("StressCalculator not found in the scene!");
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    void OnMouseDown()
    {
        BallBehaviorReaction ballBehaviorReaction = GetComponent<BallBehaviorReaction>();

        if (ballBehaviorReaction != null)
        {
            float reactionTime = Time.time - ballBehaviorReaction.spawnTime; // Calculate reaction time
            Debug.Log($"Reaction Time: {reactionTime:F2} seconds");

            if (gameObject.CompareTag("Catchable"))
            {
                Debug.Log("Green ball caught!");
                if (stressCalculator != null)
                {
                    stressCalculator.greenCaught++;
                    stressCalculator.reactionTimes.Add(reactionTime); // Add to reaction times
                }
            }
            else if (gameObject.CompareTag("Avoidable"))
            {
                Debug.Log("Red ball caught!");
                if (stressCalculator != null)
                {
                    stressCalculator.redCaught++;
                    stressCalculator.reactionTimes.Add(reactionTime); // Add to reaction times
                }
            }

            Destroy(gameObject); // Destroy the ball
        }

    }
}
