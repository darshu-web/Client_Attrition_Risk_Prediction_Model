"""
Author: Ibrahim Sherif
Date: December, 2021
This script is used for training a logistic regression model on the ingested data.
"""

import os
import sys
import pickle
import logging
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from config import MODEL_PATH, DATA_PATH

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

def train_model():
    """
    Train logistic regression model on ingested data and save the model.
    """
    # Load the data
    data_file = os.path.join(DATA_PATH, 'finaldata.csv')
    if not os.path.exists(data_file):
        logging.error(f"Error: The file '{data_file}' does not exist.")
        return

    logging.info("Loading and preparing finaldata.csv")
    data_df = pd.read_csv(data_file)

    # Check if necessary columns are in the dataset
    if 'Attrition_Risk' not in data_df.columns:
        logging.error("Required column 'Attrition_Risk' not found in data.")
        return

    # Drop the identifier column and prepare target variable
    X_df = data_df.drop(['Client_ID', 'Attrition_Risk'], axis=1)
    
    # Encode categorical variables
    X_df = pd.get_dummies(X_df, drop_first=True)
    y_df = LabelEncoder().fit_transform(data_df['Attrition_Risk'])

    # Define the Logistic Regression model
    model = LogisticRegression(
        C=1.0,
        class_weight=None,
        dual=False,
        fit_intercept=True,
        intercept_scaling=1,
        max_iter=100,
        multi_class='auto',
        penalty='l2',
        random_state=0,
        solver='liblinear',
        tol=0.0001,
        warm_start=False)

    # Train the model
    logging.info("Training model")
    model.fit(X_df, y_df)

    # Save the trained model
    model_path = os.path.join(MODEL_PATH, 'trainedmodel.pkl')
    os.makedirs(MODEL_PATH, exist_ok=True)
    with open(model_path, 'wb') as model_file:
        pickle.dump(model, model_file)
    
    logging.info(f"Model saved to {model_path}")

if __name__ == '__main__':
    logging.info("Running training.py")
    train_model()
