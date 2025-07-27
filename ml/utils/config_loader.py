import yaml
from pathlib import Path

def get_config():
    # Get the base directory (ml/)
    ml_dir = Path(__file__).resolve().parent.parent

    # Path to the YAML config file
    config_path = ml_dir / "config" / "config.yaml"
    

    # Load YAML config
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
        
        
        
       

    # Convert all relative paths in "data_path" to absolute paths
    if "data_path" in config:
        for key, rel_path in config["data_path"].items():
           if isinstance(rel_path, str):
                config["data_path"][key] = str((ml_dir / rel_path).resolve())
           else:
                # You can log or handle nested paths here if needed
                config["data_path"][key] = rel_path  
                
    if "artifacts" in config:
        for key, rel_path in config["artifacts"].items():
           if isinstance(rel_path, str):
                config["artifacts"][key] = str((ml_dir / rel_path).resolve())
           else:
                # You can log or handle nested paths here if needed
                config["artifacts"][key] = rel_path  

    return config
