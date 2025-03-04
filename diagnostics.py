import os
import sys
import json
import pickle
import timeit
import logging
import numpy as np
import pandas as pd
import subprocess

# Import paths from config.py
from config import DATA_PATH, TEST_DATA_PATH, PROD_DEPLOYMENT_PATH

logging.basicConfig(stream=sys.stdout, level=logging.INFO)


def model_predictions(X_df, revenue_col='Monthly_Spend'):
    """
    Loads deployed model to predict on data provided, and outputs the top 50 clients most likely to leave,
    including their annual revenue loss.

    Args:
        X_df (pandas.DataFrame): Dataframe with features.
        revenue_col (str): Column name for monthly revenue data.

    Returns:
        str: A string containing the top 50 clients with their details formatted as requested.
    """
    logging.info("Loading deployed model")
    model = pickle.load(
        open(
            os.path.join(
                PROD_DEPLOYMENT_PATH,
                'trainedmodel.pkl'),
            'rb'))  # Loading the trained model

    logging.info("Running predictions on data")
    # Get predicted probabilities instead of just labels
    y_prob = model.predict_proba(X_df)

    # Get the probability of leaving (assuming binary classification, class 1 = leaving)
    probability_of_leaving = y_prob[:, 1]

    # Ensure the revenue column exists
    if revenue_col not in X_df.columns:
        logging.error(f"Column '{revenue_col}' not found in data.")
        return f"Error: Column '{revenue_col}' is missing from the dataset."

    # Create a DataFrame for easier sorting and filtering
    df_predictions = X_df.copy()
    df_predictions['probability_of_leaving'] = probability_of_leaving

    # Sort the clients by the probability of leaving in descending order and get the top 50
    top_50_clients = df_predictions.sort_values(by='probability_of_leaving', ascending=False).head(50)

    # Prepare output in set-by-set format
    output = ""
    for idx, row in top_50_clients.iterrows():
        client_id = idx  # Client ID (row index)
        risk_prob = row['probability_of_leaving']
        predicted_class = 1 if risk_prob >= 0.5 else 0  # Predicted class: 1 if likely to leave, else 0
        annual_revenue_loss = row[revenue_col] * 12 if predicted_class == 1 else 0
        output += (
            f"Client ID: {client_id}\n"
            f"Risk Probability: {risk_prob:.4f}\n"
            f"Predicted Class: {predicted_class}\n"
            f"Annual Revenue Loss: ${annual_revenue_loss:,.2f}\n\n"
        )

    if not output:
        logging.info("No clients predicted to leave.")
        return "No clients predicted to leave."

    return output






def dataframe_summary():
    """
    Loads finaldata.csv and calculates mean, median, and std on numerical data.

    Returns:
        dict: Contains column name, mean, median, and std for each numerical column.
    """
    logging.info("Loading and preparing finaldata.csv")
    data_df = pd.read_csv(os.path.join(DATA_PATH, 'finaldata.csv'))

    # Drop 'Client_ID' and keep only numerical columns
    data_df = data_df.drop(['Client_ID'], axis=1)
    data_df = data_df.select_dtypes(include=['float64', 'int64'])

    logging.info("Calculating statistics for data")
    statistics_dict = {}
    for col in data_df.columns:
        mean = data_df[col].mean()
        median = data_df[col].median()
        std = data_df[col].std()

        statistics_dict[col] = {'mean': mean, 'median': median, 'std': std}

    return statistics_dict


def missing_percentage():
    """
    Calculates percentage of missing data for each column in finaldata.csv.

    Returns:
        dict: Each key is a column name with the value being the actual percentage of missing data.
    """
    logging.info("Loading and preparing finaldata.csv")
    data_df = pd.read_csv(os.path.join(DATA_PATH, 'finaldata.csv'))

    logging.info("Calculating missing data percentage")
    missing_list = {
        col: {
            'missing_count': int(data_df[col].isna().sum()),  # Convert numpy.int64 to int
            'total_count': int(len(data_df)),  # Convert numpy.int64 to int
            'percentage': round((data_df[col].isna().sum() / len(data_df)) * 100, 2)
        }
        for col in data_df.columns
    }

    return missing_list




def _ingestion_timing():
    """
    Runs ingestion.py script and measures execution time.

    Returns:
        float: Execution time of ingestion script.
    """
    starttime = timeit.default_timer()
    _ = subprocess.run(['python', 'ingestion.py'], capture_output=True)
    timing = timeit.default_timer() - starttime
    return timing


def _training_timing():
    """
    Runs training.py script and measures execution time.

    Returns:
        float: Execution time of training script.
    """
    starttime = timeit.default_timer()
    _ = subprocess.run(['python', 'training.py'], capture_output=True)
    timing = timeit.default_timer() - starttime
    return timing


def execution_time():
    """
    Gets average execution time for data ingestion and model training
    by running each 20 times.

    Returns:
        list[dict]: Mean execution times for each script.
    """
    logging.info("Calculating time for ingestion.py")
    ingestion_time = []
    for _ in range(20):
        time = _ingestion_timing()
        ingestion_time.append(time)

    logging.info("Calculating time for training.py")
    training_time = []
    for _ in range(20):
        time = _training_timing()
        training_time.append(time)

    ret_list = [
        {'ingest_time_mean': np.mean(ingestion_time)},
        {'train_time_mean': np.mean(training_time)}
    ]

    return ret_list


if __name__ == '__main__':
    # Adjust test data to drop 'Attrition_Risk' and 'Client_ID' columns
    logging.info("Loading and preparing testdata.csv")
    test_df = pd.read_csv(os.path.join(TEST_DATA_PATH, 'testdata.csv'))
    
    # Drop 'Attrition_Risk' and 'Client_ID' for predictions
    X_df = test_df.drop(['Attrition_Risk', 'Client_ID'], axis=1)
    X_df = pd.get_dummies(X_df, drop_first=True)  # Encode categorical columns like 'Gender'

    print("Model predictions on testdata.csv:", model_predictions(X_df), end='\n\n')

    print("Summary statistics")
    print(json.dumps(dataframe_summary(), indent=4), end='\n\n')

    print("Missing percentage")
    print(json.dumps(missing_percentage(), indent=4), end='\n\n')

    print("Execution time")
    print(json.dumps(execution_time(), indent=4), end='\n\n')
