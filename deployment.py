"""
Author: Ibrahim Sherif
Date: December, 2021
This script is used to deploy the trained model.
"""

import os
import sys
import shutil
import logging

# Importing paths from the configuration file
from config import INPUT_FOLDER_PATH, MODEL_PATH, PROD_DEPLOYMENT_PATH

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

def deploy_model():
    """
    Copies the latest model pickle file, the latestscore.txt file,
    and the ingestedfiles.txt file into the production deployment directory.
    """
    logging.info("Deploying trained model to production")
    
    # Paths to the files being deployed
    ingested_files = os.path.join(INPUT_FOLDER_PATH, 'ingestedfiles.txt')
    model_file = os.path.join(MODEL_PATH, 'trainedmodel.pkl')
    score_file = os.path.join(MODEL_PATH, 'latestscore.txt')

    # List of required files and their paths
    required_files = {
        'ingestedfiles.txt': ingested_files,
        'trainedmodel.pkl': model_file,
        'latestscore.txt': score_file
    }

    # Check for missing files
    missing_files = [name for name, path in required_files.items() if not os.path.exists(path)]

    if missing_files:
        logging.error(f"One or more files are missing: {', '.join(missing_files)}. Deployment aborted.")
        return

    # Copy files to the production deployment path
    for name, path in required_files.items():
        shutil.copy(path, PROD_DEPLOYMENT_PATH)
        logging.info(f"Copied {name} to production deployment path.")

    logging.info("Deployment completed successfully!")

if __name__ == '__main__':
    logging.info("Running deployment.py")
    deploy_model()
