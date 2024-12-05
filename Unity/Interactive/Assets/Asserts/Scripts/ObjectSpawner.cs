using UnityEngine;

public class ObjectSpawner : MonoBehaviour
{
    private GameObject catchableObject;
    private GameObject avoidableObject;

    public float spawnInterval = 1f;
    public Vector2 spawnRange = new Vector2(-8f, 8f);

    void Start()
    {
        // Load prefabs from Resources folder
        catchableObject = Resources.Load<GameObject>("CatchableObject");
        avoidableObject = Resources.Load<GameObject>("AvoidableObject");

        // Check if prefabs are loaded correctly
        if (catchableObject == null || avoidableObject == null)
        {
            Debug.LogError("Failed to load prefabs from Resources folder!");
            return;
        }

        // Spawn the first object with a slight random delay
        float initialDelay = Random.Range(0.5f, 1.5f);
        InvokeRepeating("SpawnObject", initialDelay, spawnInterval);
    }

    void SpawnObject()
    {
        // Randomly decide whether to spawn a green (catchable) or red (avoidable) object
        GameObject objectToSpawn = Random.value > 0.5f ? catchableObject : avoidableObject;

        // Check if the selected object is valid
        if (objectToSpawn != null)
        {
            Vector2 spawnPosition = new Vector2(Random.Range(spawnRange.x, spawnRange.y), 6f);
            Instantiate(objectToSpawn, spawnPosition, Quaternion.identity);
        }
        else
        {
            Debug.LogWarning("Object to spawn is null!");
        }
    }
}
