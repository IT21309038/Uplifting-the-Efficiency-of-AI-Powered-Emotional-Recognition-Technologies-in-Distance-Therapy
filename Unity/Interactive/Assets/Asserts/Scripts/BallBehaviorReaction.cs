using UnityEngine;

public class BallBehaviorReaction : MonoBehaviour
{
    public float spawnTime; // Stores the time when the ball was spawned

    void Start()
    {
        spawnTime = Time.time; // Record the spawn time
    }

}
