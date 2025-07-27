from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.discriminant_analysis import StandardScaler
from sklearn.impute import KNNImputer
from sklearn.preprocessing import MinMaxScaler, OrdinalEncoder,LabelEncoder,RobustScaler
import pandas as pd



ordinal_cols = ["ActivityLevel", "AlcoholConsumptionLevel", "DietQualityLevel"]
ordinal_categories = [
    ["Low", "Moderate", "High"],
    ["None", "Low", "Moderate", "High"],
    ["Poor", "Fair", "Good", "Excellent"]
]

binary_cols = ["EverMarried", "SmokingStatus", "IsWorking"]

categorical_mappings = {
    "Gender": {"Male": 0, "Female": 1},
    "ResidenceType": {"Urban": 0, "Rural": 1},
    "Ethnicity":{"Caucasian":0,'African American':1,'Asian':2,'Other':3}
}
categorical_cols=["Gender","ResidenceType",'Ethnicity']

class OrdinalColumnEncoder(BaseEstimator, TransformerMixin):
    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.encoder = None

    def fit(self, X, y=None):
        self.encoder = OrdinalEncoder(categories=ordinal_categories)
        self.encoder.fit(X[ordinal_cols])
        return self

    def transform(self, X, y=None):
        data = X.copy()
        if self.verbose:
            print("\n==[Ordinal Encoding]==")
        encoded = self.encoder.transform(data[ordinal_cols])
        data[ordinal_cols] = pd.DataFrame(encoded, columns=ordinal_cols, index=data.index)
        return data
    
class BinaryColumnEncoder(BaseEstimator,TransformerMixin):
    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.encoders = {}

    def fit(self, X, y=None):
        for col in binary_cols:
            le = LabelEncoder()
            le.fit(X[col])
            self.encoders[col] = le
        return self

    def transform(self, X, y=None):
        data = X.copy()
        if self.verbose:
            print("\n==[Binary Encoding]==")
        for col in binary_cols:
            data[col] = self.encoders[col].transform(data[col])
        return data

class CategoricalColumnEncoder(BaseEstimator,TransformerMixin):
    def __init__(self, verbose: bool = True):
        self.verbose = verbose

    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        data = X.copy()
        if self.verbose:
            print("\n==[Categorical Mapping]==")
        for col in [c for c in categorical_cols if c in data.columns]:
            data[col] = data[col].map(categorical_mappings[col])
        return data


class PostSplitProcessingStroke(BaseEstimator, TransformerMixin):
    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.binary_encoder = BinaryColumnEncoder(verbose=verbose)
        self.categorical_encoder = CategoricalColumnEncoder(verbose=verbose)
        self.imputer=KNNImputer(n_neighbors=4, weights="uniform")
        # self.scaler1=MinMaxScaler()
        # self.scaler2=RobustScaler()
    def fit(self, X: pd.DataFrame, y=None):
        if self.verbose:
            print("\n==[Post-Split Stroke Dataset Feature Processing: FIT]==")
        self.binary_encoder.fit(X, y)
        self.categorical_encoder.fit(X, y)
        self.imputer.fit(X[['Bmi']])
        # self.scaler1.fit(X[['AvgGlucoseLevel']])
        # self.scaler2.fit(X[['Age','Bmi']])
        return self

    def transform(self, X: pd.DataFrame, y=None) -> pd.DataFrame:
        if self.verbose:
            print("\n==[Post-Split Stroke Dataset Feature Processing: TRANSFORM]==")
        X_transformed = X.copy()
        X_transformed = self.binary_encoder.transform(X_transformed)
        X_transformed = self.categorical_encoder.transform(X_transformed)
        X_transformed['Bmi']=self.imputer.transform(X_transformed[['Bmi']])
        # X_transformed['AvgGlucoseLevel']= self.scaler1.transform(X_transformed[['AvgGlucoseLevel']])
        # X_transformed[['Age','Bmi']]= self.scaler2.transform(X_transformed[['Age','Bmi']])
        if self.verbose:
            print("\n==[Post-Split Stroke Dataset Feature Processing: TRANSFORM DONE]==")
        return X_transformed
    
class PostSplitProcessingParkinsons(BaseEstimator, TransformerMixin):
    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.ordinal_encoder = OrdinalColumnEncoder(verbose=verbose)
        self.scaler1=MinMaxScaler()
        self.scaler2=RobustScaler()
    def fit(self, X: pd.DataFrame, y=None):
        if self.verbose:
            print("\n==[Post-Split Parkinsons Dataset Feature Processing: FIT]==")
        self.ordinal_encoder.fit(X, y)
        self.scaler1.fit(X[['SystolicBp','DiastolicBp','CholesterolTotal','GlucoseBPInteraction','VascularStress']])
        self.scaler2.fit(X[['Age','Bmi','AgeSquared','BMISquared']])
        return self

    def transform(self, X: pd.DataFrame, y=None) -> pd.DataFrame:
        if self.verbose:
            print("\n==[Post-Split Parkinsons Dataset Feature Processing: TRANSFORM]==")
        X_transformed = X.copy()
        X_transformed = self.ordinal_encoder.transform(X_transformed)
        X_transformed = self.binary_encoder.transform(X_transformed)
        X_transformed = self.categorical_encoder.transform(X_transformed)
        X_transformed[['SystolicBp','DiastolicBp','CholesterolTotal','GlucoseBPInteraction','VascularStress']]= self.scaler1.transform(X_transformed[['SystolicBp','DiastolicBp','CholesterolTotal','GlucoseBPInteraction','VascularStress']])
        X_transformed[['Age','Bmi','AgeSquared','BMISquared']]= self.scaler2.transform(X_transformed[['Age','Bmi','AgeSquared','BMISquared']])
        if self.verbose:
            print("\n==[Post-Split Parkinsons Dataset Feature Processing: TRANSFORM DONE]==")
        return X_transformed

class PostSplitProcessingMerged(BaseEstimator, TransformerMixin):
    def __init__(self,verbose: bool = False):
        self.verbose = verbose
        self.ordinal_encoder = OrdinalColumnEncoder(verbose=verbose)
        self.binary_encoder = BinaryColumnEncoder(verbose=verbose)
        self.categorical_encoder = CategoricalColumnEncoder(verbose=verbose)
        self.scaler1=MinMaxScaler()
        self.scaler2=StandardScaler()
    def fit(self, X: pd.DataFrame, y=None):
        if self.verbose:
            print("\n==[Post-Split Merged Dataset Feature Processing: FIT]==")
        self.ordinal_encoder.fit(X, y)
        self.binary_encoder.fit(X, y)
        self.categorical_encoder.fit(X, y)
        self.scaler1.fit(X[['AvgGlucoseLevel','SystolicBp','DiastolicBp','CholesterolTotal']])
        self.scaler2.fit(X[['Age','Bmi']])
        return self

    def transform(self, X: pd.DataFrame, y=None) -> pd.DataFrame:
        if self.verbose:
            print("\n==[Post-Split Merged Dataset Feature Processing: TRANSFORM]==")
        X_transformed = X.copy()
        X_transformed = self.ordinal_encoder.transform(X_transformed)
        X_transformed = self.binary_encoder.transform(X_transformed)
        X_transformed = self.categorical_encoder.transform(X_transformed)
        X_transformed[['AvgGlucoseLevel','SystolicBp','DiastolicBp','CholesterolTotal']]= self.scaler1.transform(X_transformed[['AvgGlucoseLevel','SystolicBp','DiastolicBp','CholesterolTotal']])
        X_transformed[['Age','Bmi']]= self.scaler2.transform(X_transformed[['Age','Bmi']])
        if self.verbose:
            print("\n==[Post-Split Merged Dataset Feature Processing: TRANSFORM DONE]==")
        return X_transformed