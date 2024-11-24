#importing the necessary libraries
import os
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split

train_dir = 'dataset/fer2013/train'
test_dir = 'dataset/fer2013/test'

#Visualizing the sample images
def display_sample_images(folder_path):
    emotions = os.listdir(folder_path)
    plt.figure(figsize=(15, 10))

    for index, emotion in enumerate(emotions):
        emotion_folder = os.path.join(folder_path, emotion)
        sample_image = os.listdir(emotion_folder)[0]
        sample_image_path = os.path.join(emotion_folder, sample_image)
        image = load_img(sample_image_path, color_mode='grayscale')

        image = img_to_array(image)

        plt.subplot(1, len(emotions), index+1)
        plt.imshow(image, cmap='gray')
        plt.title(emotion)
        plt.axis('off')

    plt.show()

#load the images and labels
def load_images_and_labels(data_dir):
    images_array = []
    labels_array = []

    emotion_labels = os.listdir(data_dir)

    for label, emotion in enumerate(emotion_labels):
        emotion_dir = os.path.join(data_dir, emotion)

        for image_file in os.listdir(emotion_dir):
            image_path = os.path.join(emotion_dir, image_file)
            image = load_img(image_path, color_mode='grayscale', target_size=(48, 48))
            image_array = img_to_array(image)
            images_array.append(image_array)
            labels_array.append(label)

    return np.array(images_array), np.array(labels_array)

#Visualizing the sample images as a grid
display_sample_images(train_dir)

#load the images and labels and preprocess them
x_train, y_train = load_images_and_labels(train_dir)
x_test, y_test = load_images_and_labels(test_dir)

#normalizing the images pixel values
x_train = x_train / 255.0
x_test = x_test / 255.0

#one-hot encoding the labels
num_classes = len(os.listdir(train_dir))
y_train = to_categorical(y_train, num_classes)
y_test = to_categorical(y_test, num_classes)

#splitting the training data into training and validation data
x_train, x_val, y_train, y_val = train_test_split(x_train, y_train, test_size=0.2, random_state=42)

#confirming the shape of the data
print("Training data shape: ", x_train.shape)
print("Validation data shape: ", x_val.shape)
print("Testing data shape: ", x_test.shape)
print("Number of classes: ", num_classes)

# Save the data in a directory

if not os.path.exists('data'):
    os.makedirs('data')

np.save('data/x_train.npy', x_train)
np.save('data/y_train.npy', y_train)
np.save('data/x_val.npy', x_val)
np.save('data/y_val.npy', y_val)
np.save('data/x_test.npy', x_test)
np.save('data/y_test.npy', y_test)

print("Data saved successfully!")
