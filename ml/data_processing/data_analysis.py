import pandas as pd

def get_column(df, column_name):
    for col in df.columns:
        if column_name.lower() in col.lower():
            return df[col]
    raise KeyError(f"Column '{column_name}' not found in dataframe.")

def get_common_columns(df1, df2):
    stroke_cols=df1.columns.str.lower()
    parkinsons_cols = df2.columns.str.lower()
    common_cols = stroke_cols.intersection(parkinsons_cols).tolist()
    return common_cols

def display_column_distribution(df_col,data):
    col_values = df_col.value_counts()
    print(f"Unique values: {col_values.unique()}")
    print(f"Count: {len(col_values.unique())} different entries")
    for value, count in col_values.items():
        percentage = (count / len(data)) * 100
        print(f"  {value}: {count} ({percentage:.1f}%)")
    

    
def display_gender_distribution(df1, df2=None):
    stroke_column=get_column(df1,"gender")
    print(f"\nStroke Dataset:")
    display_column_distribution(stroke_column,df1)
    if df2 is not None: 
        parkinsons_column=get_column(df2,"gender")
        print(f"\nParkinson Dataset:")
        display_column_distribution(parkinsons_column,df2)
    
    

def display_hypertension_distribution(df1, df2=None):
    stroke_hp_column=get_column(df1,"hypertension")
    print(f"\nStroke Dataset:")
    display_column_distribution(stroke_hp_column,df1)
    if df2 is not None: 
          parkinson_hp_column=get_column(df2,"hypertension")
          print(f"\nParkinson Dataset:")
          display_column_distribution(parkinson_hp_column,df2)
    


def display_stroke_distribution(df1, df2=None):
    
    stroke_st_column=get_column(df1,"stroke")
    print(f"\nStroke Dataset:")
    display_column_distribution(stroke_st_column,df1)
    
    if df2 is not None:
        parkinson_st_column=get_column(df2,"stroke")
        print(f"\nParkinsons Dataset:")
        display_column_distribution(parkinson_st_column,df2)
   

   

def display_smoking_distribution(df1,df2=None):
    stroke_sm_column=get_column(df1,"smoking")
    print(f"\nStroke Dataset Smoking Status:")
    display_column_distribution(stroke_sm_column,df1)
    
    if df2 is not None:
        parkinson_sm_column=get_column(df2,"smoking")
        print(f"\nParkinson Dataset Smoking Status:")
        display_column_distribution(parkinson_sm_column,df2)
    
    

def display_worktype_distribution(df1):
    stroke_wt_column=get_column(df1,"work")
    print(f"\nStroke Dataset WorkType:")
    display_column_distribution(stroke_wt_column,df1)

def display_residencetype_distribution(df1):
    stroke_rt_column=get_column(df1,"residence")
    print(f"\nStroke Dataset ResidenceType:")
    display_column_distribution(stroke_rt_column,df1) 
def display_activitylevel_distribution(df1):
    stroke_rt_column=get_column(df1,"activity")
    print(f"\nStroke Dataset Activity Level:")
    display_column_distribution(stroke_rt_column,df1)
def display_alcoholconsumption_distribution(df1):
    stroke_rt_column=get_column(df1,"alcohol")
    print(f"\nStroke Dataset Alcohol Consumption Level:")
    display_column_distribution(stroke_rt_column,df1)    

def display_dietquality_distribution(df1):
    stroke_rt_column=get_column(df1,"diet")
    print(f"\nStroke Dataset Diet Quality Level:")
    display_column_distribution(stroke_rt_column,df1) 

def display_ethnicity_distribution(df1):
    stroke_rt_column=get_column(df1,"diet")
    print(f"\nStroke Dataset Ethnicity:")
    display_column_distribution(stroke_rt_column,df1)  
    
def display_missing_values(name, df):
    
    missing_info = df.isnull().sum()[df.isnull().sum() > 0]
    missing_columns = list(missing_info.index)

    if len(missing_columns) > 0:
        print(
            f"{name} Dataset has {df.isnull().sum().sum()} missing values and these values are from {missing_columns}")
    else:
        print(f"{name} Dataset has no missing values")


def display_individual_datasets_information(df1:pd.DataFrame, df2:pd.DataFrame):
    sd=df1.copy()
    pd=df2.copy()
    print(f"Stroke Dataset Has {len(df1.columns)} features as follows:")
    print(df1.columns.tolist())
    print(f"\nParkinsons Dataset Has {len(df2.columns)} features as follows:")
    print(df2.columns.tolist())
    
    sd=sd.rename(columns=lambda x:x.lower())
    pd=pd.rename(columns=lambda x:x.lower())
    # Missing Values
    print("\nMissing Values:")
    display_missing_values("Stroke", sd)
    display_missing_values("Parkinsons", pd)

    # Data Types
    print("\nData Types:")
    print("Stroke Dataset has features of following datatypes:")
    print(sd.dtypes)
    print("\nParkinsons Dataset has features of following datatypes:")
    print(pd.dtypes)

    print("\nBoth Datasets has following common features:")
    print(get_common_columns(sd, pd))

    print("\n=== Gender Distribution Analysis ===")
    display_gender_distribution(sd, pd)

    print("\n=== Hypertension Distribution Analysis ===")
    display_hypertension_distribution(sd, pd)
    
    print("\n=== Smoking Distribution Analysis ===")
    display_smoking_distribution(sd, pd)
    
    print("\n=== WorkType Distribution Analysis ===")
    display_worktype_distribution(sd)
    
    print("\n=== ResidenceType Distribution Analysis ===")
    display_residencetype_distribution(sd)

    print("\n=== Stroke Distribution Analysis ===")
    display_stroke_distribution(sd, pd)
    
    
def display_combined_dataset_information(df:pd.DataFrame):
    md=df.copy()
    print(f"Merged Stroke Dataset Has {len(df.columns)} features as follows:")
    print(df.columns.tolist())
    
    md=md.rename(columns=lambda x:x.lower())
    # Missing Values
    print("\nMissing Values:")
    display_missing_values("Merged Stroke", md)

    # Data Types
    print("\nData Types:")
    print("Merged Stroke Dataset has features of following datatypes:")
    print(md.dtypes)

    print("\n=== Gender Distribution Analysis ===")
    display_gender_distribution(md)

    print("\n=== Hypertension Distribution Analysis ===")
    display_hypertension_distribution(md)
    
    print("\n=== Smoking Distribution Analysis ===")
    display_smoking_distribution(md)
    
    print("\n=== WorkType Distribution Analysis ===")
    display_worktype_distribution(md)
    
    print("\n=== ResidenceType Distribution Analysis ===")
    display_residencetype_distribution(md)
    
    print("\n=== ActivityLevel Distribution Analysis ===")
    display_activitylevel_distribution(md)
    
    print("\n=== Alcohol Consumption Distribution Analysis ===")
    display_alcoholconsumption_distribution(md)
    
    print("\n=== Diet Quality Level Distribution Analysis ===")
    display_dietquality_distribution(md)
    
    print("\n=== Ethnicity Distribution Analysis ===")
    display_ethnicity_distribution(md)


    print("\n=== Stroke Distribution Analysis ===")
    display_stroke_distribution(md)
    