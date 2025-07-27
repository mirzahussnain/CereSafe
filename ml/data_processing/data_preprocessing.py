import re
import numpy as np
import pandas as pd

def handle_duplicates(name:str, data: pd.DataFrame,mode:bool=True) -> pd.DataFrame:
    
    duplicate_count = data.duplicated().sum()
    if duplicate_count > 0:
        data = data.drop_duplicates()
        if mode:
            print(
                f"\n== {name} Duplicates Removal ==\n"
                f"Removed {duplicate_count} duplicate rows."
            )
    elif mode:
        print(f"\n== {name} Duplicates Removal ==\nNo duplicates found.")
    return data
def drop_columns(name:str,data: pd.DataFrame,mode:bool=True)->pd.DataFrame:

    if name.lower() == "stroke":
        columns_to_drop = ["id"]
    else:
        columns_to_drop = ["PatientID", "DoctorInCharge", "Diagnosis", "SleepDisorders", 
                        "EducationLevel", "Depression", "CholesterolLDL", 
                        "CholesterolHDL", "CholesterolTriglycerides", "UPDRS", "MoCA", 
                        "FunctionalAssessment", "Tremor", "Rigidity", "Bradykinesia",
                        "PosturalInstability", "SpeechProblems", "Constipation", 
                        "TraumaticBrainInjury","FamilyHistoryParkinsons","SleepQuality"]
    
    existing_columns = [col for col in columns_to_drop if col in data.columns]
    
    if existing_columns:
        data = data.drop(columns=existing_columns)
        if mode:
            print(
                f"\n== {name} Columns Removal ==\n"
                f"Removed {len(existing_columns)} unnecessary columns from {name}")
    elif mode:
        print(
             f"\n== {name} Columns Removal ==\n"
            f"No unnecessary columns found in {name}")
    
    return data
def modify_column_type(name:str,data: pd.DataFrame,mode:bool=True)->pd.DataFrame:
    if name.lower()=="parkinsons":
        return data
    
    data['age'] = np.ceil(data['age'])
    data['age']=data['age'].astype(int)
    if mode:
        print(
            f"\n== {name} Data Type Conversion ==\n"
            f"Age column of {name} dataset have been converted from float to int")
    return data
def standarized_columns(name:str,data:pd.DataFrame,mode:bool=True)->pd.DataFrame:
    new_columns = []
    for col in data.columns:
        col=str(col)
        if name.lower()=="parkinsons":
                # Split camelCase and PascalCase
            col = re.sub('([a-z])([A-Z])', r'\1 \2', col)
            # Split before capital letters following numbers
            col = re.sub('([0-9])([A-Z])', r'\1 \2', col)
        # Convert to lowercase and replace special characters with spaces
        col = ''.join(c if c.isalnum() else ' ' for c in str(col).lower())
        # Capitalize first letter of each word and remove spaces
        col = ''.join(word.capitalize() for word in col.split())
        if name=="parkinsons" and col=="Smoking":
            col="SmokingStatus"
        new_columns.append(col)

    data.columns = new_columns
    if mode:
        print(
             f"\n== {name} Columns Standarization ==\n"
            f"{name} dataset's columns names have been standarized")
    return data

