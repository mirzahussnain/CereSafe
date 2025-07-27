import joblib
from pathlib import Path

def load_model(config):
    model_path = Path(config["model"]["single_data"])
    return joblib.load(model_path)
