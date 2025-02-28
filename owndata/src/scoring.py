"""
Author: Ibrahim Sherif
Date: December, 2021
This script is used for evaluating a model on test data and saving evaluation metrics.
"""

import os
import sys
import pickle
import logging
import pandas as pd
from sklearn.metrics import f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.utils import resample
from config import MODEL_PATH, TEST_DATA_PATH

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

def preprocess_data(df):
    """
    Preprocesses the data by encoding categorical variables, handling imbalance, and scaling features.
    
    Parameters:
    - df (pd.DataFrame): The raw dataframe to preprocess.

    Returns:
    - X (pd.DataFrame): The preprocessed feature set.
    - y (pd.Series): The target variable.
    """
    # Encode the target column 'Attrition_Risk'
    le = LabelEncoder()
    df['Attrition_Risk_Encoded'] = le.fit_transform(df['Attrition_Risk'])
    y = df.pop('Attrition_Risk_Encoded')

    # Drop irrelevant columns and encode categorical features
    X = df.drop(['Attrition_Risk', 'Client_ID'], axis=1)
    X = pd.get_dummies(X, drop_first=True)  # One-hot encode categorical variables

    # Handle class imbalance through resampling (oversampling minority class)
    df_balanced = pd.concat([X, y], axis=1)
    minority_class = df_balanced[df_balanced['Attrition_Risk_Encoded'] == 1]
    majority_class = df_balanced[df_balanced['Attrition_Risk_Encoded'] == 0]
    minority_upsampled = resample(minority_class, replace=True, n_samples=len(majority_class), random_state=42)
    df_balanced = pd.concat([majority_class, minority_upsampled])

    # Split features and target variable after balancing
    X = df_balanced.drop('Attrition_Risk_Encoded', axis=1)
    y = df_balanced['Attrition_Risk_Encoded']

    # Standardize numerical features
    scaler = StandardScaler()
    X[X.columns] = scaler.fit_transform(X[X.columns])

    return X, y

def tune_and_train_model(X, y):
    """
    Perform hyperparameter tuning on a RandomForestClassifier to optimize recall, precision, and F1 score.

    Parameters:
    - X (pd.DataFrame): The feature set.
    - y (pd.Series): The target variable.

    Returns:
    - model (sklearn model): The trained model.
    """
    # Set up RandomForest model with GridSearch for hyperparameter tuning
    model = RandomForestClassifier(random_state=42, class_weight='balanced')
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    grid_search = GridSearchCV(model, param_grid, scoring='f1_weighted', cv=5, n_jobs=-1)
    grid_search.fit(X, y)

    # Return the best model from grid search
    best_model = grid_search.best_estimator_
    logging.info(f"Best model parameters: {grid_search.best_params_}")
    return best_model

def score_model():
    """
    Loads and preprocesses the test data, trains an optimized model, and calculates F1 score, precision, 
    and recall. Saves the results to the latestscore.txt file and prints them to the console.
    """
    logging.info("Loading testdata.csv")
    test_df = pd.read_csv(os.path.join(TEST_DATA_PATH, 'testdata.csv'))

    logging.info("Preparing test data")
    X, y = preprocess_data(test_df)

    logging.info("Tuning and training model")
    model = tune_and_train_model(X, y)

    logging.info("Predicting test data")
    y_pred = model.predict(X)

    # Calculate evaluation metrics
    f1 = f1_score(y, y_pred, average='weighted')
    precision = precision_score(y, y_pred, average='weighted')
    recall = recall_score(y, y_pred, average='weighted')

    logging.info(f"f1 score = {f1}")
    logging.info(f"precision = {precision}")
    logging.info(f"recall = {recall}")

    # Print metrics to console
    print(f"F1 Score: {f1}")
    print(f"Precision: {precision}")
    print(f"Recall: {recall}")

    # Save scores to text file
    logging.info("Saving scores to text file")
    with open(os.path.join(MODEL_PATH, 'latestscore.txt'), 'w') as file:
        file.write(f"f1 score = {f1}\n")
        file.write(f"precision = {precision}\n")
        file.write(f"recall = {recall}\n")

    # Save the model to disk
    with open(os.path.join(MODEL_PATH, 'trainedmodel.pkl'), 'wb') as model_file:
        pickle.dump(model, model_file)
    logging.info("Model saved successfully")

if __name__ == '__main__':
    logging.info("Running scoring.py")
    score_model()
