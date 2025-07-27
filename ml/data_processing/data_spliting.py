from typing import Optional, Tuple
from utils.config_loader import get_config
from pandas import DataFrame
from sklearn.model_selection import train_test_split

def split_data(
    data: DataFrame,
    name: str,
    target: str,
    test_size: float = 0.3,
    random_state: Optional[int] = 42,
    stratify: bool = True,
    save_splits: bool = False,
) -> Tuple[DataFrame, DataFrame, DataFrame, DataFrame]:
    config=get_config()
    X = data.drop(columns=[target])
    y = data[target]
    
    stratify_y = y if stratify else None
    
     # Perform the split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify_y
    )
    
    if save_splits:
        X_train.to_csv(f'{config["data_path"]["train"][name]}/features.csv')
        X_test.to_csv(f'{config["data_path"]["test"][name]}/features.csv')
        y_train.to_csv(f'{config["data_path"]["train"][name]}/target.csv')
        y_test.to_csv(f'{config["data_path"]["test"][name]}/target.csv')
        
    if save_splits:
        print(f"\n {name.capitalize()} data splitted and saved into training and testing data ")
    else:
        print(f"\n {name.capitalize()} data splitted  into training and testing data ")
    return X_train, X_test, y_train, y_test