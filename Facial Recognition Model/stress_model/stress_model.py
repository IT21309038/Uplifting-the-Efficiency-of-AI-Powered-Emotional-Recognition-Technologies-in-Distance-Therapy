# Importing Necessary Libraries
import os
import numpy as np
import tensorflow as tf
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Model
from keras.layers import Input, Conv2D, BatchNormalization, ReLU, Add, MaxPooling2D, GlobalAveragePooling2D, Dense, Dropout
from keras.optimizers import Adam
from keras.callbacks import ReduceLROnPlateau, EarlyStopping
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Path to the dataset
dataset_train_dir = '../dataset/fer2013/train'
dataset_test_dir = '../dataset/fer2013/test'

# Emotion-to-Stress Mapping
emotion_to_stress = {
    "Anger": 1.0,
    "Contempt": 0.8,
    "Disgust": 0.7,
    "Fear": 0.9,
    "Happy": -0.5,
    "Neutral": 0.0,
    "Sad": 0.5,
    "Surprise": -0.2
}

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

# Custom SE Block
def se_block(input_tensor, reduction=16):
    channels = input_tensor.shape[-1]
    se = GlobalAveragePooling2D()(input_tensor)
    se = Dense(channels // reduction, activation='relu')(se)
    se = Dense(channels, activation='sigmoid')(se)
    return tf.keras.layers.Multiply()([input_tensor, se])

# Residual Block
def residual_block(input_tensor, filters, stride=1):
    shortcut = input_tensor
    if stride > 1 or input_tensor.shape[-1] != filters:
        shortcut = Conv2D(filters, kernel_size=1, strides=stride, padding='same')(shortcut)
        shortcut = BatchNormalization()(shortcut)

    x = Conv2D(filters, kernel_size=3, strides=stride, padding='same')(input_tensor)
    x = BatchNormalization()(x)
    x = ReLU()(x)
    x = Conv2D(filters, kernel_size=3, strides=1, padding='same')(x)
    x = BatchNormalization()(x)

    x = Add()([x, shortcut])
    return ReLU()(x)

# Building the Model
input_layer = Input(shape=(48, 48, 1))

x = Conv2D(64, (3, 3), padding='same', activation='relu')(input_layer)
x = BatchNormalization()(x)
x = MaxPooling2D(pool_size=(2, 2))(x)

x = Conv2D(128, (3, 3), padding='same', activation='relu')(x)
x = BatchNormalization()(x)
x = MaxPooling2D(pool_size=(2, 2))(x)

x = Conv2D(256, (3, 3), padding='same', activation='relu')(x)
x = BatchNormalization()(x)
x = MaxPooling2D(pool_size=(2, 2))(x)

x = se_block(x)

x = residual_block(x, 512, stride=2)
x = residual_block(x, 1024, stride=2)
x = residual_block(x, 2048, stride=2)

x = GlobalAveragePooling2D()(x)

x = Dense(256, activation='relu')(x)
x = Dropout(0.4)(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.4)(x)

# Outputs
output_emotion = Dense(8, activation='softmax', name='emotion_output')(x)
output_stress = Dense(1, activation='linear', name='stress_output')(x)

# Model Definition
model = Model(inputs=input_layer, outputs=[output_emotion, output_stress])

model.summary()

# Compile the Model
model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss={
        'emotion_output': 'categorical_crossentropy',  # For emotion classification
        'stress_output': 'mse'                        # For stress prediction
    },
    metrics={
        'emotion_output': 'accuracy',                 # For emotion classification
        'stress_output': 'mae'                        # For stress prediction
    }
)

# Callbacks
early_stopping = EarlyStopping(
    monitor='val_emotion_output_accuracy',  # Monitor emotion accuracy
    min_delta=0.0001,
    patience=10,
    verbose=1,
    restore_best_weights=True
)

lr_scheduler = ReduceLROnPlateau(
    monitor='val_emotion_output_accuracy',
    factor=0.5,
    patience=5,
    min_lr=1e-7,
    verbose=1
)

callbacks = [early_stopping, lr_scheduler]

# Training and Validation
train_steps = training_data.samples // training_data.batch_size
test_steps = test_data.samples // test_data.batch_size

history = model.fit(
    training_data,
    steps_per_epoch=train_steps,
    epochs=100,
    validation_data=test_data,
    validation_steps=test_steps,
    callbacks=callbacks
)

# Evaluate the Model
evaluation_results = model.evaluate(test_data, steps=test_steps, verbose=1)

# Unpacking the results
total_loss = evaluation_results[0]
loss_emotion = evaluation_results[1]
loss_stress = evaluation_results[2]
emotion_accuracy = evaluation_results[3]
stress_mae = evaluation_results[4]

# Print evaluation metrics
print(f"Total Loss: {total_loss:.4f}")
print(f"Loss (Emotion): {loss_emotion:.4f}")
print(f"Loss (Stress): {loss_stress:.4f}")
print(f"Validation Accuracy (Emotion): {emotion_accuracy * 100:.2f}%")
print(f"Validation MAE (Stress): {stress_mae:.4f}")

# Plot Training vs Validation Metrics
plt.figure(figsize=(8, 6))
plt.plot(history.history['emotion_output_accuracy'], label='Training Accuracy (Emotion)')
plt.plot(history.history['val_emotion_output_accuracy'], label='Validation Accuracy (Emotion)')
plt.title('Training vs Validation Accuracy (Emotion)')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()
plt.show()

plt.figure(figsize=(8, 6))
plt.plot(history.history['emotion_output_loss'], label='Training Loss (Emotion)')
plt.plot(history.history['val_emotion_output_loss'], label='Validation Loss (Emotion)')
plt.title('Training vs Validation Loss (Emotion)')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()

plt.figure(figsize=(8, 6))
plt.plot(history.history['stress_output_loss'], label='Training Loss (Stress)')
plt.plot(history.history['val_stress_output_loss'], label='Validation Loss (Stress)')
plt.title('Training vs Validation Loss (Stress)')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()

# Confusion Matrix
y_true = test_data.classes
y_pred = np.argmax(model.predict(test_data)[0], axis=-1)  # Predict emotions

# Generate confusion matrix
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
model.save('emotion_stress_model.h5')
print('Model saved successfully!')
