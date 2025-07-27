import pandas as pd
from utils.config_loader import get_config
config=get_config()


def get_activity_level(hours, age):
    if age < 5:
        group = 'under_5'
    elif age <= 18:
        group = 'children'
    else:
        group = 'adults'
    
    try:
        thresholds = config['features']['activity_thresholds'][group]
        if hours < thresholds['low']:
            return 'Low'
        elif hours <= thresholds['moderate']:
            return 'Moderate'
        return 'High'
    except KeyError:
        return 'Unknown'
   



def create_features(name:str, data: pd.DataFrame,mode:bool=True,remove_org: bool=True):
   
    if(name.lower()=="parkinsons"):
        
         data = data.rename(columns={'Smoking': 'SmokingStatus'})
         if mode: print("\n==Feature Creation in Parkinsons Data....."
                        "\n...... PhysicalActivity*Age========>ActivityLevel .....")
         
         data['ActivityLevel'] = data.apply(
            lambda row: get_activity_level(row['PhysicalActivity'], row['Age']),
            axis=1
        )
    
         if mode: print("...... AlcoholConsumption========> ActivityLevel ......")
         data['AlcoholConsumptionLevel'] = data['AlcoholConsumption'].apply(
            lambda x: (
                "None" if x == 0 else
                "Low" if x <= 7 else
                "Moderate" if x <= 14 else
                "High"
            )
         )
         if mode: print("...... DietQuality========> DietQualityLevel......")
         data['DietQualityLevel'] = data['DietQuality'].apply(
                    lambda x: (
                    "Poor" if x <= 3 else
                    "Fair" if x <= 5 else
                    "Good" if x <= 7 else
                    "Excellent" if x <= 10 else
                    "Unknown"  # Handles NaN or outliers
                )
            )
         
         
         if mode: print("...... Ethnicity (Num)========> Ethnicity(Cat)......")
         
         if remove_org: data.drop(columns=["DietQuality","AlcoholConsumption","PhysicalActivity"],inplace=True)
   
         
    else:
        if mode: print("\n==Feature Creation in Stroke Dataset....."
                       "\n...... SmokingStatus (Ordinal)========>SmokingStatus (Binary) ......")
       
        data['SmokingStatus'] = data['SmokingStatus'].apply(
            lambda x: (
                "No" if x in ["Unknown","never smoked"]
                else "Yes"
            ))
        
        
        if mode: print("\n==Feature Creation in Stroke Dataset....."
                       "\n...... AvgGlucoseLevel ========> Diabetes ......")
       
        data['Diabetes'] = data['AvgGlucoseLevel'].apply(
            lambda x: (
                0 if x < 126
                else 1
            ))
        
        
        if mode: print("...... Gender (Ordinal)========>Gender (Binary) ......")
        data['Gender'] = data['Gender'].apply(
            lambda x: (
                "Male" if x in ["Male","Other"]
                else "Female"
            ))
        if mode: print("...... WorkType (Ordinal)========>IsWorking (Binary) ......")
        data['IsWorking'] = data['WorkType'].apply( lambda x: 'Yes' if x in ['Private', 'Govt_job', 'Self-employed'] else 'No')
        
        if remove_org: data.drop(columns=["WorkType"],inplace=True)
    if mode: print(f"\nNew Features have been created for {name} dataset")  
    return data



    
    
    