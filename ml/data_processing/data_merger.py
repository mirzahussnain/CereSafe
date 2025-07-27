from datetime import datetime
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import euclidean_distances
import matplotlib.pyplot as plt
from utils.config_loader import get_config
from .feature_engineering import create_features
# import s
def align_features(stroke_df, parkinsons_df):
   
    stroke_df['gender_numeric'] = stroke_df['Gender'].map({'Female': 1, 'Male': 0})
    
    # Rename Parkinson's dataset columns to match stroke dataset
    parkinsons_df = parkinsons_df.rename(columns={
        'Gender': 'gender_numeric',
    })
    
    # Ensure consistent data types
    for col in ['Age', 'Hypertension', 'Bmi', 'Stroke','Diabetes']:
        stroke_df[col] = stroke_df[col].astype(float)
        parkinsons_df[col] = parkinsons_df[col].astype(float)
    
    # Handle missing values (fill with mean for numeric columns)
        stroke_df['Bmi']=stroke_df['Bmi'].fillna(stroke_df['Bmi'].median())
        
    return stroke_df,parkinsons_df
        
# Step 3: Probabilistic Matching
def match_patients(stroke_df, parkinsons_df):
    """
    Match patients between datasets using Euclidean distance on common features.
    """
    # Common features for matching
    common_features = ['Age', 'gender_numeric', 'Hypertension', 'Bmi', 'Stroke','Diabetes']
    
    # Extract feature sets
    stroke_features = stroke_df[common_features].copy()
    parkinsons_features = parkinsons_df[common_features].copy()
    
    # Normalize features for distance calculation
    for col in common_features:
        mean_val = stroke_features[col].mean()
        std_val = stroke_features[col].std()
        if std_val > 0:  # Avoid division by zero
            stroke_features[col] = (stroke_features[col] - mean_val) / std_val
            parkinsons_features[col] = (parkinsons_features[col] - mean_val) / std_val
    
    # Calculate Euclidean distances
    distances = euclidean_distances(stroke_features.fillna(0), parkinsons_features.fillna(0))
    
    # Assign ethnicity based on closest match
    ethnicity_map = {0: 'Caucasian', 1: 'African American', 2: 'Asian', 3: 'Other'}
    stroke_df['Ethnicity'] = stroke_df.index.map(
        lambda i: ethnicity_map.get(parkinsons_df.iloc[distances[i].argmin()]['Ethnicity'], 'Unknown')
    )
    
    return stroke_df

# Step 4: Add Additional Features (Optional)
def add_additional_features(stroke_df, parkinsons_df, additional_features=None):
    """
    Optionally add additional features from Parkinson's dataset to stroke dataset.
    """
    if additional_features:
        # Map Parkinson's patient to stroke patient based on closest match
        distances = euclidean_distances(
            stroke_df[['Age', 'gender_numeric', 'Hypertension', 'Bmi', 'Stroke','Diabetes']].fillna(0),
            parkinsons_df[['Age', 'gender_numeric', 'Hypertension', 'Bmi', 'Stroke','Diabetes']].fillna(0)
        )
        
        # Add additional features
        for feature in additional_features:
            stroke_df[feature] = stroke_df.index.map(
                lambda i: parkinsons_df.iloc[distances[i].argmin()][feature]
            )
    
    return stroke_df

def remove_temp_columns(df):
    data=df.copy()
    for col in ['Age', 'Hypertension', 'Stroke','Diabetes']:
        data[col] = data[col].astype(int)
    data=data.drop(columns=['gender_numeric']) 
    return data

# Step 5: Validate Merged Dataset
def validate_merged_dataset(stroke_df):
    """
    Validate the merged dataset by checking ethnicity distribution and stroke prevalence.
    """
    print("\nEthnicity Distribution in Merged Dataset:")
    print(stroke_df['ethnicity'].value_counts(normalize=True))
    
    print("\nStroke Prevalence by Ethnicity:")
    stroke_prevalence = stroke_df.groupby('ethnicity')['stroke'].mean()
    print(stroke_prevalence)
    
    return stroke_prevalence

# Step 6: Visualize Results
def visualize_stroke_prevalence(stroke_prevalence):
    """
    Create a bar chart of stroke prevalence by ethnicity.
    """
    plt.figure(figsize=(8, 6))
    # sns.barplot(x=stroke_prevalence.index, y=stroke_prevalence.values)
    plt.title('Stroke Prevalence by Ethnicity', fontsize=14)
    plt.xlabel('Ethnicity', fontsize=12)
    plt.ylabel('Stroke Prevalence (Proportion)', fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    # Save the plot
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    plt.savefig(f'stroke_prevalence_by_ethnicity_{timestamp}.png')
    plt.close()

# Main Function to Execute All Steps
def merge_datasets(stroke_data, parkinsons_data):
    additional_features=["SystolicBp","DiastolicBp","CholesterolTotal","ActivityLevel","AlcoholConsumptionLevel","DietQualityLevel"]
    stroke_df=stroke_data.copy()
    parkinsons_df=parkinsons_data.copy()
    config=get_config()
    merged_data_path=config["saved_data_path"]["processed_data"]["merged"]
    # Step 2: Align features
    stroke_df, parkinsons_df = align_features(stroke_df, parkinsons_df)
    
    # Step 3: Probabilistic matching to assign ethnicity
    merged_df = match_patients(stroke_df, parkinsons_df)
    
    # Step 4: Add additional features (optional)
    merged_df = add_additional_features(stroke_df, parkinsons_df, additional_features)
    
    merged_df=remove_temp_columns(merged_df)
    
    
    # Step 5: Validate merged dataset
    # stroke_prevalence = validate_merged_dataset(stroke_df)
    
    # Step 6: Visualize results
    # visualize_stroke_prevalence(stroke_prevalence)
    
    # Save merged dataset
    # timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    merged_df.to_csv(merged_data_path, index=False)
    print(f"\n Stroke Data Enriched with Parkinsons data and saved successfully")
    return merged_df