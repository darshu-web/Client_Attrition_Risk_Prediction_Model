import sys
import json
import logging
import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
import os
import diagnostics  # Assuming diagnostics.py is provided

# Load configuration from config.json
with open('config.json', 'r') as file:
    CONFIG = json.load(file)

# Define paths using the config file settings
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_PATH = os.path.join(BASE_DIR, CONFIG['output_folder_path'])
TEST_DATA_PATH = os.path.join(BASE_DIR, CONFIG['test_data_path'])
MODEL_PATH = os.path.join(BASE_DIR, CONFIG['output_model_path'])
PROD_DEPLOYMENT_PATH = os.path.join(BASE_DIR, CONFIG['prod_deployment_path'])

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

def generate_pdf_report():
    """
    Generates a PDF report with enhanced formatting, including the top 50 high-risk clients.
    """
    pdf_path = os.path.join(MODEL_PATH, 'summary_report.pdf')
    doc = SimpleDocTemplate(pdf_path, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    heading_style = styles["Heading2"]
    normal_style = styles["BodyText"]

    elements.append(Paragraph("Model Summary Report", title_style))
    elements.append(Spacer(1, 12))

    elements.append(Paragraph("Top 50 High-Risk Clients", heading_style))
    elements.append(Spacer(1, 6))
    
    try:
        test_df = pd.read_csv(os.path.join(TEST_DATA_PATH, 'testdata.csv'))
        X_df = test_df.drop(['Attrition_Risk', 'Client_ID'], axis=1)
        X_df = pd.get_dummies(X_df, drop_first=True)
        
        top_50_clients = diagnostics.model_predictions(X_df)
        
        if isinstance(top_50_clients, str):
            elements.append(Paragraph(top_50_clients.replace("\n", "<br />"), normal_style))
        else:
            data_table = [["Client ID", "Risk Probability", "Predicted Class", "Annual Revenue Loss ($)"]]
            data_table += top_50_clients
            table = Table(data_table)
            table.setStyle(TableStyle([
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('BACKGROUND', (0, 0), (-1, 0), colors.lavender),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ]))
            elements.append(table)
    except Exception as e:
        logging.error(f"Error generating high-risk clients list: {e}")
        elements.append(Paragraph("Error generating high-risk clients list.", normal_style))

    elements.append(Spacer(1, 12))
    
    doc.build(elements)
    logging.info("PDF report generated successfully.")

if __name__ == '__main__':
    logging.info("Running reporting.py")
    generate_pdf_report()
import sys
import json
import logging
import pandas as pd
import os
import matplotlib.pyplot as plt
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from pretty_confusion_matrix import plot_confusion_matrix_from_data
import diagnostics  # Assuming diagnostics.py is provided

# Load configuration from config.json
with open('config.json', 'r') as file:
    CONFIG = json.load(file)

# Define paths using the config file settings
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DATA_PATH = os.path.join(BASE_DIR, CONFIG['output_folder_path'])
TEST_DATA_PATH = os.path.join(BASE_DIR, CONFIG['test_data_path'])
MODEL_PATH = os.path.join(BASE_DIR, CONFIG['output_model_path'])
PROD_DEPLOYMENT_PATH = os.path.join(BASE_DIR, CONFIG['prod_deployment_path'])

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

def plot_confusion_matrix():
    try:
        test_df = pd.read_csv(os.path.join(TEST_DATA_PATH, 'testdata.csv'))
        y_true = test_df.pop('Attrition_Risk')
        X_df = pd.get_dummies(test_df.drop(['Client_ID'], axis=1), drop_first=True)

        model = diagnostics.load_deployed_model()
        model_columns = model.feature_names_in_
        for col in set(model_columns) - set(X_df.columns):
            X_df[col] = 0
        X_df = X_df[model_columns]

        y_pred = model.predict(X_df)

        fig, ax = plot_confusion_matrix_from_data(y_true, y_pred, columns=[0, 1], cmap='Blues')
        ax.set_title("Model Confusion Matrix")
        fig.savefig(os.path.join(MODEL_PATH, 'confusionmatrix.png'))
        logging.info("Confusion matrix saved.")
    except Exception as e:
        logging.error(f"Error generating confusion matrix: {e}")

def generate_pdf_report():
    pdf_path = os.path.join(MODEL_PATH, 'summary_report.pdf')
    doc = SimpleDocTemplate(pdf_path, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    heading_style = styles["Heading2"]
    normal_style = styles["BodyText"]

    elements.append(Paragraph("Model Summary Report", title_style))
    elements.append(Spacer(1, 12))

    # Ingested Data
    elements.append(Paragraph("Ingested Data", heading_style))
    try:
        with open(os.path.join(DATA_PATH, "ingestedfiles.txt")) as file:
            ingested_data = file.read()
        elements.append(Paragraph(ingested_data.replace("\n", "<br />"), normal_style))
    except Exception as e:
        logging.error(f"Error reading ingested files: {e}")
    elements.append(Spacer(1, 12))

    # Model Scoring
    elements.append(Paragraph("Model Score", heading_style))
    try:
        with open(os.path.join(MODEL_PATH, "latestscore.txt")) as file:
            elements.append(Paragraph(file.read(), normal_style))
    except Exception as e:
        logging.error(f"Error reading model score: {e}")
    elements.append(Spacer(1, 12))

    # Execution Time
    elements.append(Paragraph("Execution Time", heading_style))
    try:
        timings = diagnostics.execution_time()
        elements.append(Paragraph("<br />".join([f"{k}: {v:.4f} sec" for timing in timings for k, v in timing.items()]), normal_style))
    except Exception as e:
        logging.error(f"Error retrieving execution time: {e}")
    elements.append(Spacer(1, 12))

    # Missing Data
    elements.append(Paragraph("Missing Data Summary", heading_style))
    try:
        missing_data = diagnostics.missing_percentage()
        elements.append(Paragraph("<br />".join([f"{col}: {metrics['percentage']}%" for col, metrics in missing_data.items()]), normal_style))
    except Exception as e:
        logging.error(f"Error retrieving missing data: {e}")
    elements.append(Spacer(1, 12))

    # Confusion Matrix
    elements.append(Paragraph("Confusion Matrix", heading_style))
    try:
        img = Image(os.path.join(MODEL_PATH, 'confusionmatrix.png'), width=300, height=300)
        elements.append(img)
    except Exception as e:
        logging.error(f"Error loading confusion matrix image: {e}")
    elements.append(Spacer(1, 12))

    # Top 50 High-Risk Clients
    elements.append(Paragraph("Top 50 High-Risk Clients", heading_style))
    try:
        test_df = pd.read_csv(os.path.join(TEST_DATA_PATH, 'testdata.csv'))
        X_df = test_df.drop(['Attrition_Risk', 'Client_ID'], axis=1)
        X_df = pd.get_dummies(X_df, drop_first=True)
        top_50_clients = diagnostics.model_predictions(X_df)
        if isinstance(top_50_clients, str):
            elements.append(Paragraph(top_50_clients.replace("\n", "<br />"), normal_style))
        else:
            data_table = [["Client ID", "Risk Probability", "Predicted Class", "Annual Revenue Loss ($)"]]
            data_table += top_50_clients
            table = Table(data_table)
            table.setStyle(TableStyle([
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('BACKGROUND', (0, 0), (-1, 0), colors.lavender),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ]))
            elements.append(table)
    except Exception as e:
        logging.error(f"Error generating high-risk clients list: {e}")
    elements.append(Spacer(1, 12))

    doc.build(elements)
    logging.info("PDF report generated successfully.")

if __name__ == '__main__':
    logging.info("Running reporting.py")
    plot_confusion_matrix()
    generate_pdf_report()
