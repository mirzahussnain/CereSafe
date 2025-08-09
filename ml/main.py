from pathlib import Path
from joblib import dump, load
import pandas as pd
from sklearn.pipeline import Pipeline
from imblearn.pipeline import Pipeline as ImbPipeline
from utils.dataset_loader import load_dataset
from utils.config_loader import get_config
from pipelines.post_split_processing import PostSplitProcessingMerged, PostSplitProcessingStroke
from pipelines.pre_split_processing import PreSplitProcessing
from data_processing.data_analysis import display_individual_datasets_information
from data_processing.data_spliting import split_data
from data_processing.data_balancing import DataBalancer
from data_processing.model_training import model_trainer_and_evaluator
from data_processing.data_merger import merge_datasets
from imblearn.over_sampling import RandomOverSampler
from imblearn.combine import SMOTEENN
from imblearn.under_sampling import RandomUnderSampler
import sys


def main():
    config = get_config()

    raw_sd = load_dataset("stroke", "raw")
    # Load datasets
    if raw_sd is not None and not raw_sd.empty:
        choice = int(input("Press 1 for working with merged dataset and 2 for individual datasets: "))
        sd_pipeline = Pipeline([('preprocess', PreSplitProcessing(name=config["dataset_names"]["stroke"], remove_org=True, verbose=False))])
        cleaned_sd = sd_pipeline.fit_transform(raw_sd)
        
       
        if not isinstance(cleaned_sd, pd.DataFrame):
            cleaned_sd = pd.DataFrame(cleaned_sd, columns=raw_sd.columns, index=raw_sd.index)
       
        sX_train, sX_test, sy_train, sy_test = split_data(name="stroke", data=cleaned_sd, save_splits=True, target="Stroke")
        
        if (choice == 1):
            raw_pd = load_dataset("parkinsons", "raw")
            merged_sd = load_dataset("merged", "raw")
            
            if(merged_sd is None or merged_sd.empty):
                if (raw_pd is not None and not raw_pd.empty):
                    # Preprocessing pipelines
                    pd_pipeline = Pipeline([('preprocess', PreSplitProcessing(name=config["dataset_names"]["parkinsons"], remove_org=True, verbose=False))])

                    cleaned_pd = pd_pipeline.fit_transform(raw_pd)
                    merged_data = merge_datasets(cleaned_sd, cleaned_pd)
            else:
                # X_train = load_dataset("merged", "train_features")
                # X_test = load_dataset("merged", "test_features")
                # y_train = load_dataset("merged", "train_target")
                # y_test = load_dataset("merged", "test_target")
                # if any([df is None or df.empty for df in [X_train, X_test, y_train, y_test]]):
                X_train, X_test, y_train, y_test = split_data(name="merged", data=merged_sd, save_splits=True, target="Stroke")
                pipeline_path = Path(config["artifacts"]["pipelines"])
                pipeline_file = pipeline_path / 'sp.joblib'
                mpost_pipeline = PostSplitProcessingMerged(verbose=False)
                X_train = pd.DataFrame(mpost_pipeline.fit_transform(X_train), columns=X_train.columns, index=X_train.index)
                X_test = pd.DataFrame(mpost_pipeline.transform(X_test), columns=X_test.columns, index=X_test.index)
                

                X_train_resampled, y_train_resampled = DataBalancer("Stroke", X_train, y_train, "ros")
                model = model_trainer(X_train_resampled, y_train_resampled, X_test, y_test,"merged")
                model_path=Path(config["artifacts"]["models"]) / "sp_model.pkl"
                dump(model,model_path)
                stroke_pred_pipeline = ImbPipeline([
                    
                    ('preprocessing', mpost_pipeline),
                    ('resample', RandomOverSampler(sampling_strategy="0.3",random_state=42)),
                    ('classifier', model)
                ])

                dump(stroke_pred_pipeline, pipeline_path / "sp.joblib")
                print("Pipeline and model saved successfully.")
                
        else:
            #Stroke Prediction
           
            spost_pipeline = PostSplitProcessingStroke()
            sX_train =pd.DataFrame(spost_pipeline.fit_transform(sX_train), columns=sX_train.columns,index=sX_train.index)
            sX_test = spost_pipeline.transform(sX_test)
           
            
            sX_train_resampled, sy_train_resampled = DataBalancer("Stroke", sX_train, sy_train, "ros")
            
            model=model_trainer_and_evaluator(sX_train_resampled,sy_train_resampled,sX_test,sy_test,True,True)
           
            sP_pipeline=ImbPipeline([
                ('preprocessor',spost_pipeline),
                ('resample',RandomOverSampler(sampling_strategy=0.3,random_state=42)),
                ('classifier',model)])
            pipeline_path=Path(config["artifacts"]['pipelines']) / "stp.joblib"
            dump(sP_pipeline,pipeline_path)

    
           


if __name__ == "__main__":
    main()
