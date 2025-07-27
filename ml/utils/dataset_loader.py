from pathlib import Path
import pandas as pd

from .config_loader import get_config


def load_dataset(name:str,dataType:str):
    config=get_config()
    try:
       if dataType == "raw":
            file_path = Path(config["data_path"]["raw"][name])
       elif "train" in dataType:
            if "features" in dataType:
                 file_path = Path(config["data_path"]["train"][name]) / "features.csv"
            else:
                 file_path = Path(config["data_path"]["train"][name]) / "target.csv"
       else:
           
                if "features" in dataType:
                    file_path = Path(config["data_path"]["test"][name]) / "features.csv"
                else:
                    file_path = Path(config["data_path"]["test"][name]) / "target.csv"
      

       if not file_path.exists():
            print(f"Error: File '{file_path}' does not exist.")
            return None

       if("train" in dataType or "test" in dataType):
            df = pd.read_csv(file_path,index_col=0)
       else:
          df = pd.read_csv(file_path)
       return df
    except FileNotFoundError as e:
        print(f"Error loading dataset: {e}")
        return None