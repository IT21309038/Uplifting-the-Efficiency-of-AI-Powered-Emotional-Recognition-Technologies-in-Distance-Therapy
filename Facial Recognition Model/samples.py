import os
import matplotlib.pyplot as plt
from PIL import Image

# Path to the FER2013 dataset folder
dataset_path = "dataset/fer2013/train"  # Update with the correct path to your dataset folder

# Emotion labels (folder names)
emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

# Function to load one sample image from each emotion folder
def load_sample_images(dataset_path, emotion_labels):
    sample_images = []
    for label in emotion_labels:
        label_path = os.path.join(dataset_path, label)
        if os.path.isdir(label_path):
            image_files = os.listdir(label_path)
            if image_files:  # Ensure folder is not empty
                img_path = os.path.join(label_path, image_files[0])
                img = Image.open(img_path).convert("L")  # Convert to grayscale
                sample_images.append((img, label))
    return sample_images

# Load one sample image for each emotion
sample_images = load_sample_images(dataset_path, emotion_labels)

# Display the images in a single row
fig, axes = plt.subplots(1, len(sample_images), figsize=(15, 5))

for i, (img, label) in enumerate(sample_images):
    axes[i].imshow(img, cmap="gray")
    axes[i].axis("off")
    axes[i].set_title(label, fontsize=10)

# Adjust layout
plt.tight_layout()
plt.show()
