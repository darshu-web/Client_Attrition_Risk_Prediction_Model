import os
import json

# Load config.json and set paths based on configuration
with open('config.json', 'r') as file:
    CONFIG = json.load(file)

# Define base directory of the project
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# Define paths using os.path.join for compatibility
INPUT_FOLDER_PATH = os.path.join(BASE_DIR, CONFIG['input_folder_path'])
DATA_PATH = os.path.join(BASE_DIR, CONFIG['output_folder_path'])
TEST_DATA_PATH = os.path.join(BASE_DIR, CONFIG['test_data_path'])
MODEL_PATH = os.path.join(BASE_DIR, CONFIG['output_model_path'])
PROD_DEPLOYMENT_PATH = os.path.join(BASE_DIR, CONFIG['prod_deployment_path'])

# Print paths for verification (optional)
print("Input Folder Path:", INPUT_FOLDER_PATH)
print("Data Path:", DATA_PATH)
print("Test Data Path:", TEST_DATA_PATH)
print("Model Path:", MODEL_PATH)
print("Production Deployment Path:", PROD_DEPLOYMENT_PATH)
