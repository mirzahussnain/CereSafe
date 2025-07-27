from pydantic import BaseModel, Field
from typing import Literal

class PredictionInputMerged(BaseModel):
    Gender: Literal["Male", "Female"]
    Age: int = Field(ge=0, le=120)  
    Hypertension: Literal[0, 1]
    HeartDisease: Literal[0, 1]
    EverMarried: Literal["Yes", "No"]
    ResidenceType: Literal["Urban", "Rural"]
    AvgGlucoseLevel: float = Field(ge=0) 
    Bmi: float = Field(ge=0)  
    SmokingStatus: Literal["Yes", "No"]
    Diabetes: Literal[0, 1]
    IsWorking: Literal["Yes", "No"]
    Ethnicity: Literal["Caucasian", "African American", "Asian","Other"]  
    SystolicBp: int = Field(ge=0)  
    DiastolicBp:int=Field(ge=0)
    CholesterolTotal: float = Field(ge=0) 
    ActivityLevel: Literal["Low", "Moderate", "High"]
    AlcoholConsumptionLevel: Literal["None", "Low", "Moderate", "High"]
    DietQualityLevel: Literal["Poor", "Fair", "Good"]

class PredictionInputSingle(BaseModel):
    Gender: Literal["Male", "Female"]
    Age: int = Field(ge=0, le=120)  
    Hypertension: Literal[0, 1]
    HeartDisease: Literal[0, 1]
    EverMarried: Literal["Yes", "No"]
    ResidenceType: Literal["Urban", "Rural"]
    AvgGlucoseLevel: float = Field(ge=0) 
    Bmi: float = Field(ge=0)  
    SmokingStatus: Literal["Yes", "No"]
    Diabetes: Literal[0, 1]
    IsWorking: Literal["Yes", "No"]