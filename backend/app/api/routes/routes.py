from fastapi import APIRouter
import shap

from app.utils.resultRefiner import RefinePredictionResult
router= APIRouter()
from fastapi import APIRouter, HTTPException
import pandas as pd
from models.InputModel import PredictionInputMerged, PredictionInputSingle

# Create a router instance
router = APIRouter()

# Store model_pipeline as a global variable (set in main.py)
model_pipeline = None

def set_model(model):
    global model_pipeline
    model_pipeline = model

@router.get("/health")
async def health():
    return {"status": "healthy"}

@router.post("/predict")
async def predict(input_data: PredictionInputSingle):
    try:
        # Convert input to numpy array in the correct order
        
        features = pd.DataFrame([input_data.model_dump()])  
        if model_pipeline is None:
            raise ValueError("Model pipeline is not initialized")

       
        processed_features = model_pipeline.named_steps['preprocessor'].transform(features)

        classifier = model_pipeline.named_steps['classifier']
        prediction = classifier.predict(processed_features)[0]
        probability = classifier.predict_proba(processed_features)[0][1]

        # Access base model for SHAP/explainability
        model = None
        if hasattr(classifier, 'named_estimators_'):
            model = classifier.named_estimators_.get('xgb')
        else:
            model = classifier  # fallback if it's not an ensemble

        # Optional: Feature importance or SHAP could go here

        result = RefinePredictionResult(
            prediction=prediction,
            probability=probability,
            model=model,
            features=processed_features
        )
        return result
    except Exception as e:
        
        # return {"success":0,
        #         "message":f'Failed to predicit:{str(e)}'}
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")