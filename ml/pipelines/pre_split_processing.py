import re
from pandas import DataFrame
from sklearn.base import BaseEstimator, TransformerMixin
from data_processing.data_preprocessing import handle_duplicates,modify_column_type,drop_columns,standarized_columns
from data_processing.feature_engineering import create_features
class PreSplitProcessing(BaseEstimator, TransformerMixin):
    def __init__(self, name: str, verbose: bool = True,remove_org:bool=True):
        
        self.name = name
        self.verbose = verbose
        self.remove_org_cols=remove_org
    
    def fit(self, X: DataFrame, y=None) -> "PreSplitProcessing":
        """No fitting required for pre-split ops (returns self)."""
        return self
    
    def transform(self, X: DataFrame) -> DataFrame:
        """Applies pre-split transformations (e.g., deduplication)."""
        data = X.copy()
        if self.verbose:
            print("\n==[Data Cleaning...]")
        data = handle_duplicates(self.name,data,self.verbose)
        data=modify_column_type(self.name,data,self.verbose)
        data= drop_columns(self.name,data,self.verbose)
        data=standarized_columns(self.name,data,self.verbose)
        if self.verbose:
            print("\n==[Feature Creation...]")
        data=create_features(self.name,data,self.verbose,self.remove_org_cols)
        return data
    
    
