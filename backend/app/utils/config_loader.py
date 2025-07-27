import yaml
from pathlib import Path

def get_config():
    config_path = Path(__file__).resolve().parent.parent.parent / "config" / "config.yaml"
    
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    # Get the backend directory (3 levels up from utils/config_loader.py)
    backend_dir = Path(__file__).resolve().parent.parent.parent
    
    
    
    # Also fix model path if needed
    config["model"]["merged_data"] = str(backend_dir / config["model"]["merged_data"])
    config["model"]["single_data"] = str(backend_dir /  config["model"]["single_data"])
    return config