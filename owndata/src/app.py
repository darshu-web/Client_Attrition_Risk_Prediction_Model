import streamlit as st
import pandas as pd
import json
import os
import diagnostics  # Ensure diagnostics.py is available in your project
import joblib
import matplotlib.pyplot as plt
from PIL import Image
from reporting import generate_pdf_report  # Import the PDF report function

# Load configuration from config.json
with open('config.json', 'r') as file:
    CONFIG = json.load(file)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TEST_DATA_PATH = os.path.join(BASE_DIR, CONFIG['test_data_path'])
MODEL_PATH = os.path.join(BASE_DIR, CONFIG['output_model_path'])
CONFUSION_MATRIX_PATH = os.path.join(MODEL_PATH, 'confusionmatrix.png')
PDF_REPORT_PATH = os.path.join(MODEL_PATH, 'summary_report.pdf')

# Load the trained model
def load_model():
    return joblib.load(os.path.join(MODEL_PATH, 'trainedmodel.pkl'))

st.title("Dynamic Risk Assessment System")
st.sidebar.header("Navigation")
page = st.sidebar.radio("Go to", ["Home", "Upload Data & Predict", "Model Performance", "High-Risk Clients", "Generate Report"])

# 🏠 Home Page
if page == "Home":
    st.subheader("Welcome to the Dynamic Risk Assessment System")
    st.write("Use this app to assess client attrition risk based on your dataset.")

# 📂 Upload Data & Predict Page
elif page == "Upload Data & Predict":
    st.subheader("Upload Test Data for Prediction")
    uploaded_file = st.file_uploader("Choose a CSV file", type=["csv"])
    
    if uploaded_file is not None:
        test_df = pd.read_csv(uploaded_file)
        st.write("### Preview of Uploaded Data:")
        st.dataframe(test_df.head())
        
        if 'Attrition_Risk' in test_df.columns:
            y_true = test_df.pop('Attrition_Risk')
        else:
            y_true = None
        
        model = load_model()
        X_df = pd.get_dummies(test_df.drop(['Client_ID'], axis=1), drop_first=True)
        
        # Align columns with model expectations
        model_columns = model.feature_names_in_
        for col in set(model_columns) - set(X_df.columns):
            X_df[col] = 0
        X_df = X_df[model_columns]
        
        predictions = model.predict(X_df)
        test_df['Predicted Risk'] = predictions
        
        st.write("### Prediction Results:")
        st.dataframe(test_df[['Client_ID', 'Predicted Risk']].head(20))
        
        st.download_button("Download Predictions", test_df.to_csv(index=False).encode("utf-8"), "predictions.csv", "text/csv")

# 📊 Model Performance Page
elif page == "Model Performance":
    st.subheader("Model Performance Metrics")
    
    try:
        with open(os.path.join(MODEL_PATH, "latestscore.txt")) as file:
            model_score = file.read()
        st.write("### Model Score:")
        st.text(model_score)
    except:
        st.error("Error loading model score.")
    
    st.write("### Confusion Matrix:")
    try:
        image = Image.open(CONFUSION_MATRIX_PATH)
        st.image(image, caption="Confusion Matrix", use_column_width=True)
    except:
        st.error("Confusion Matrix image not found.")

# 🚨 High-Risk Clients Page
elif page == "High-Risk Clients":
    st.subheader("Top 50 High-Risk Clients")
    
    try:
        test_df = pd.read_csv(os.path.join(TEST_DATA_PATH, 'testdata.csv'))
        X_df = test_df.drop(['Attrition_Risk', 'Client_ID'], axis=1)
        X_df = pd.get_dummies(X_df, drop_first=True)
        
        high_risk_clients = diagnostics.model_predictions(X_df)

        if isinstance(high_risk_clients, str):  # Handle error messages
            st.error(f"Error: {high_risk_clients}")
        elif isinstance(high_risk_clients, pd.DataFrame):
            st.write("### Top 50 High-Risk Clients:")
            st.dataframe(high_risk_clients.head(50))
        else:
            st.error("Unexpected data format received from model_predictions.")
    except Exception as e:
        st.error(f"Error generating high-risk clients list: {e}")

# 📄 Generate Report Page
elif page == "Generate Report":
    st.subheader("Generate and Download Report")
    
    if st.button("Generate PDF Report"):
        generate_pdf_report()
        st.success("PDF Report generated successfully!")
        
    if os.path.exists(PDF_REPORT_PATH):
        with open(PDF_REPORT_PATH, "rb") as pdf_file:
            st.download_button("Download Report", pdf_file, "summary_report.pdf", "application/pdf")
    else:
        st.warning("Report not found. Please generate it first.")

st.sidebar.info("This app is powered by a Logistic Regression model.")
