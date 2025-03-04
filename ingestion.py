import os
import pandas as pd
import logging
from datetime import datetime
from config import INPUT_FOLDER_PATH, DATA_PATH

# Configure logging
logging.basicConfig(level=logging.INFO)

def ingest_single_dataframe():
    """
    Function to ingest a single dataset.csv file from INPUT_FOLDER_PATH and save it to DATA_PATH.
    After saving the data, it adds an 'ingested.txt' file to the 'ingesteddata' folder.
    The file will include the dataset name and the time of ingestion.
    """
    dataset_name = 'dataset.csv'
    dataset_path = os.path.join(INPUT_FOLDER_PATH, dataset_name)
    
    if not os.path.exists(dataset_path):
        logging.error(f"Error: The file '{dataset_path}' does not exist.")
        return
    
    logging.info(f"Reading file from {dataset_path}")
    df = pd.read_csv(dataset_path)

    # Save to finaldata.csv in DATA_PATH
    output_path = os.path.join(DATA_PATH, 'finaldata.csv')
    os.makedirs(DATA_PATH, exist_ok=True)
    df.to_csv(output_path, index=False)
    logging.info(f"Data saved to {output_path}")
    
    # Add ingested.txt to ingesteddata folder
    ingested_data_folder = os.path.join(DATA_PATH, 'ingesteddata')
    os.makedirs(ingested_data_folder, exist_ok=True)
    
    # Get the current time
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Write the ingestion details to 'ingested.txt'
    ingested_file_path = os.path.join(ingested_data_folder, 'ingestedfiles.txt')
    with open(ingested_file_path, 'w') as f:
        f.write(f"Dataset Name: {dataset_name}\n")
        f.write(f"Ingestion Time: {current_time}\n")
        f.write("Data ingestion completed successfully.\n")
    
    logging.info(f"'ingestedfiles.txt' created in {ingested_data_folder}")

if __name__ == '__main__':
    ingest_single_dataframe()

