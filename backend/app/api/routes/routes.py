from fastapi import APIRouter
from utils.resultRefiner import RefinePredictionResult
router= APIRouter()
from fastapi import APIRouter, HTTPException
import pandas as pd
from models.InputModel import PredictionInputMerged, PredictionInputSingle
from utils.config_loader import get_config
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
        if model_pipeline is None:
            raise ValueError("Model pipeline is not initialized")
        config = get_config()
        preprocessor=model_pipeline.named_steps['preprocessor']
       
        
        train_data=pd.read_csv(config["data"]["train"]["stroke"])
        if 'Unnamed: 0' in train_data.columns:
            train_data = train_data.drop(columns=['Unnamed: 0'])
        train_data_processed=preprocessor.transform(train_data)
        train_data_processed=pd.DataFrame(train_data_processed,columns=train_data.columns,index=train_data.index)
       
        features = pd.DataFrame([input_data.model_dump()])  
        processed_features = model_pipeline.named_steps['preprocessor'].transform(features)
        processed_features = pd.DataFrame(processed_features, columns=train_data.columns)
        classifier = model_pipeline.named_steps['classifier']
        prediction = classifier.predict(processed_features)[0]
        probability = classifier.predict_proba(processed_features)[0][1]
        
        
        # Access base model for SHAP/explainability
        model = None
        if hasattr(classifier, 'named_estimators_'):
            model = classifier.named_estimators_.get('xgb')
        else:
            model = classifier  # fallback if it's not an ensemble
            

        result = RefinePredictionResult(
            prediction=prediction,
            probability=probability,
            model=model,
            features=processed_features,
            background_data=train_data_processed
        )
        
        return result
    except Exception as e:
        
        # return {"success":0,
        #         "message":f'Failed to predicit:{str(e)}'}
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")