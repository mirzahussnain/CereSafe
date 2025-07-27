import pandas as pd
from imblearn.over_sampling import SMOTE,RandomOverSampler,ADASYN,BorderlineSMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.combine import SMOTEENN,SMOTETomek
def DataBalancer(name:str,feature: pd.DataFrame,target: pd.DataFrame,technique:str):
    if technique =="under":
        sampler=RandomUnderSampler(sampling_strategy="0.5",random_state=42)
    elif technique=="asad":
        sampler=ADASYN(random_state=42)
    elif technique =="ros":
        sampler=RandomOverSampler(sampling_strategy="0.3",random_state=42)
    elif technique =="bsmote":
        sampler=BorderlineSMOTE( sampling_strategy="0.3",  # Minority class to 50% of majority
    k_neighbors=5,          # Default but explicit
    random_state=42,
    kind='borderline-2'   )
    elif technique == "smote":
        sampler=SMOTE(sampling_strategy="0.3",random_state=42)
    elif technique=="hybrid":
        sampler=SMOTEENN(sampling_strategy="0.5",random_state=42)
    else:
        print("Balancing Technique is not provided")
    
    feature_resampled,target_resampled=sampler.fit_resample(feature,target)
    print(f"{name} training dataset has been resampled ")
    return feature_resampled,target_resampled