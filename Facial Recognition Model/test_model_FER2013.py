# Importing Necessary Libraries
import os
import numpy as np
import tensorflow as tf
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization, GlobalAveragePooling2D
from keras.optimizers import Adam
from keras.callbacks import ReduceLROnPlateau, EarlyStopping
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Path to the dataset
dataset_train_dir = 'dataset/fer2013/train'
dataset_test_dir = 'dataset/fer2013/test'

# Data Generators
data_generator = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.15,
    zoom_range=0.15,
    horizontal_flip=True
)

# Load Training and Testing Data
training_data = data_generator.flow_from_directory(
    dataset_train_dir,
    target_size=(48, 48),
    batch_size=64,
    color_mode='grayscale',
    class_mode='categorical',
    shuffle=True
)

test_data = data_generator.flow_from_directory(
    dataset_test_dir,
    target_size=(48, 48),
    batch_size=64,
    color_mode='grayscale',
    class_mode='categorical',
    shuffle=False
)

print(training_data.class_indices)

# Model Architecture
model = Sequential([
    Conv2D(64, (3, 3), activation='elu', padding='same', kernel_initializer='he_normal', input_shape=(48, 48, 1)),
    BatchNormalization(),
    Conv2D(64, (3, 3), activation='elu', padding='same', kernel_initializer='he_normal'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.3),

    Conv2D(128, (3, 3), activation='elu', padding='same', kernel_initializer='he_normal'),
    BatchNormalization(),
    Conv2D(128, (3, 3), activation='elu', padding='same', kernel_initializer='he_normal'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.3),

    Conv2D(256, (3, 3), activation='elu', padding='same', kernel_initializer='he_normal'),
    BatchNormalization(),
    Conv2D(256, (3, 3), activation='elu', padding='same', kernel_initializer='he_normal'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),
    Dropout(0.4),

    GlobalAveragePooling2D(),
    Dense(128, activation='elu', kernel_initializer='he_normal'),
    BatchNormalization(),
    Dropout(0.4),
    Dense(8, activation='softmax')  # Adjust output classes if needed
])

model.compile(
    loss='categorical_crossentropy',
    optimizer=Adam(learning_rate=0.0001),
    metrics=['accuracy']
)

model.summary()

# Callbacks
early_stopping = EarlyStopping(
    monitor='val_accuracy',
    min_delta=0.0001,
    patience=10,
    verbose=1,
    restore_best_weights=True
)

lr_scheduler = ReduceLROnPlateau(
    monitor='val_accuracy',
    factor=0.5,
    patience=5,
    min_lr=1e-7,
    verbose=1
)

callbacks = [early_stopping, lr_scheduler]

# Training and Validation
train_steps = training_data.samples // training_data.batch_size
test_steps = test_data.samples // test_data.batch_size

print("Training on Single Dataset...")
history = model.fit(
    training_data,
    steps_per_epoch=train_steps,
    epochs=60,
    validation_data=test_data,
    validation_steps=test_steps,
    callbacks=callbacks
)

# Evaluate on Test Data
loss, accuracy = model.evaluate(test_data, steps=test_steps, verbose=1)
print(f"Validation Loss: {loss}")
print(f"Validation Accuracy: {accuracy * 100:.2f}%")

# Plotting Training vs. Validation Metrics
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Training vs. Validation Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()
plt.show()

plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Training vs. Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()

# Predict on Test Data
y_true = test_data.classes
y_pred = np.argmax(model.predict(test_data), axis=-1)

# Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=test_data.class_indices.keys(), yticklabels=test_data.class_indices.keys())
plt.xlabel('Predicted')
plt.ylabel('True')
plt.title('Confusion Matrix')
plt.show()

# Classification Report
print(classification_report(y_true, y_pred, target_names=test_data.class_indices.keys()))

# Save the Model
model.save('fer2013_model.h5')