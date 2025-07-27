from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from dotenv import load_dotenv
import os
import numpy as np
from utils.config_loader import get_config
from utils.model_loader import load_model
from api.routes.routes import set_model,router
# Initialize FastAPI app
load_dotenv()
app = FastAPI(title="Stroke Risk Prediction", description="API for Stroke risk predictions")
raw_origins = os.getenv("FRONTEND_URLS", "")

origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST"],
    allow_headers=["*"],
)

config=get_config()


try:
    model_pipeline = load_model(config)
    set_model(model_pipeline)  
except Exception as e:
    raise Exception(f"Error loading model: {str(e)}")

app.include_router(router, prefix="/api")
# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Stroke Risk Prediction Prediction API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}