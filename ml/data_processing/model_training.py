import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score,roc_curve
from sklearn.model_selection import StratifiedKFold, cross_val_score, RandomizedSearchCV
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier
import warnings
import matplotlib.pyplot as plt
import seaborn as sns
warnings.filterwarnings('ignore')

def get_default_models():
    """Returns dictionary of default models for binary classification."""
    return {
        'Logistic Regression': LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(class_weight='balanced', random_state=42),
        'XGBoost': XGBClassifier(scale_pos_weight=10, eval_metric='logloss', random_state=42),
        'LightGBM': LGBMClassifier(class_weight='balanced', verbose=-1, random_state=42),
    }


def plot_roc_curves(models, X_test, y_test):
    """
    Plot ROC curves for multiple trained models.
    
    Parameters:
        models (dict): Dictionary of {model_name: fitted_model}.
        X_test (pd.DataFrame or np.array): Test features.
        y_test (pd.Series or np.array): True test labels.
    """
    plt.figure(figsize=(10, 7))
    
    for name, model in models.items():
        if hasattr(model, "predict_proba"):
            y_probs = model.predict_proba(X_test)[:, 1]
        elif hasattr(model, "decision_function"):
            y_probs = model.decision_function(X_test)
        else:
            print(f"Skipping {name} (no probability output)")
            continue
        
        fpr, tpr, _ = roc_curve(y_test, y_probs)
        auc_score = roc_auc_score(y_test, y_probs)
        plt.plot(fpr, tpr, label=f"{name} (AUC = {auc_score:.3f})")
    
    # Plot reference line
    plt.plot([0, 1], [0, 1], linestyle='--', color='gray')
    plt.title('ROC Curves for All Models')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.legend(loc='lower right')
    plt.grid(True)
    plt.tight_layout()
    plt.show()


def plot_model_performance(results_df, metrics=('Test_Accuracy', 'Test_Recall', 'Test_F1', 'Test_ROC_AUC')):
    """
    Plot performance metrics from results dataframe.
    
    Parameters:
        results_df (pd.DataFrame): DataFrame with model evaluation results.
        metrics (tuple): Metrics to plot. Columns must exist in results_df.
    """
    # Only keep required columns
    plot_df = results_df[['Model'] + list(metrics)].copy()
    
    # Melt the DataFrame for seaborn compatibility
    plot_df = plot_df.melt(id_vars='Model', var_name='Metric', value_name='Score')

    # Plot
    plt.figure(figsize=(12, 6))
    sns.barplot(data=plot_df, x='Model', y='Score', hue='Metric', palette='Set2')
    plt.title('Model Performance Comparison')
    plt.xticks(rotation=15)
    plt.ylim(0, 1)
    plt.ylabel("Score")
    plt.legend(title="Metric", bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.tight_layout()
    plt.grid(axis='y', linestyle='--', linewidth=0.5)
    plt.show()
def train_models(models, X_train, y_train):
    """Train a dictionary of models and return fitted models."""
    fitted_models = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        fitted_models[name] = model
    return fitted_models

def tune_threshold(model, X_val, y_val, thresholds=np.linspace(0.1, 0.9, 17)):
    """Find the best threshold based on F1 score (can change to recall or precision if needed)."""
    probs = model.predict_proba(X_val)[:, 1]
    
    best = {'threshold': 0.5, 'f1': 0, 'recall': 0, 'precision': 0}
    for t in thresholds:
        preds = (probs >= t).astype(int)
        recall = recall_score(y_val, preds, zero_division=0)
        precision = precision_score(y_val, preds, zero_division=0)
        f1 = f1_score(y_val, preds, zero_division=0)
        if f1 > best['f1']:
            best = {'threshold': t, 'f1': f1, 'recall': recall, 'precision': precision}
    return best

def evaluate_models(models, X_train, y_train, X_test, y_test,tune_thresh=True):
    """Evaluate models using cross-validation and test set metrics."""
    
    print(f"Starting evaluation of {len(models)} models...")
    print("Performing 5-fold cross-validation and test set evaluation\n")
    
    results = []
    for i, (name, model) in enumerate(models.items(), 1):
        print(f"[{i}/{len(models)}] Evaluating {name}...")
        
        
        cv_scores = {
            'Accuracy': cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy').mean(),
            'Precision': cross_val_score(model, X_train, y_train, cv=5, scoring='precision').mean(),
            'Recall': cross_val_score(model, X_train, y_train, cv=5, scoring='recall').mean()
        }
        
        # Test set predictions
        print(f"  → Generating test set predictions...")
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        
       # Threshold tuning
        if tune_thresh:
            best_thresh = tune_threshold(model, X_test, y_test)
            threshold = best_thresh['threshold']
            y_pred = (y_pred_proba >= threshold).astype(int)
        else:
            threshold = 0.5
            y_pred = model.predict(X_test)

        test_precision = precision_score(y_test, y_pred, zero_division=0)
        test_recall = recall_score(y_test, y_pred, zero_division=0)
        test_f1 = f1_score(y_test, y_pred, zero_division=0)
        test_scores = {
            'Model': name,
            'CV_Accuracy': cv_scores['Accuracy'],
            'CV_Precision': cv_scores['Precision'],
            'CV_Recall': cv_scores['Recall'],
            'Test_Accuracy': accuracy_score(y_test, y_pred),
            'Test_Precision': test_precision,
            'Test_Recall': test_recall,
            'Test_F1': test_f1,
            'Test_ROC_AUC': roc_auc_score(y_test, y_pred_proba),
            'Fitted_Model': model
        }
        results.append(test_scores)
        
        print(f"  ✓ {name} completed - Test Precision: {test_precision:.4f}, Test Recall: {test_recall:.4f}, Test F1: {test_f1:.4f}")
        print()
    
    print("Model evaluation completed!")
    print("Results sorted by Test-Recall (descending) - balances precision and recall\n")
    
    return pd.DataFrame(results).sort_values('Test_Recall', ascending=False)

def tune_models(X_train, y_train, n_iter=10):
    """Perform hyperparameter tuning and return best estimators."""
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    param_grid = {
        'Logistic Regression': {
            'model': LogisticRegression(max_iter=1000, random_state=42),
            'params': {
                'C': [0.1, 1.0, 10.0],
                'class_weight': ['balanced', {0: 1, 1: 5}]
            }
        },
        'Random Forest': {
            'model': RandomForestClassifier(random_state=42),
            'params': {
                'n_estimators': [100, 200,300],
                'max_depth': [3,10, None],
                'class_weight': ['balanced', {0: 1, 1: 15}]
            },
            
        },
        'XGBoost': {
            'model': XGBClassifier(eval_metric='logloss', random_state=42),
            'params': {
                'max_depth': [3, 5],
                'learning_rate': [0.05, 0.1],
                'scale_pos_weight': [5, 10]
            }
        },
        'LightGBM': {
            'model': LGBMClassifier(random_state=42, verbose=-1),
            'params': {
                'n_estimators': [100, 200],
                'learning_rate': [0.05, 0.1],
                'class_weight': ['balanced', {0: 1, 1: 5}]
            }
        },
    }

    print(f"Starting hyperparameter tuning for {len(param_grid)} models...")
    print(f"Using {n_iter} iterations and {cv}-fold cross-validation\n")
    
    best_models = {}
    for i, (name, cfg) in enumerate(param_grid.items(), 1):
        print(f"[{i}/{len(param_grid)}] Tuning {name}...")
        
        search = RandomizedSearchCV(
            cfg['model'], cfg['params'], n_iter=n_iter, cv=cv, 
            scoring='recall', n_jobs=-1, random_state=42
        )
        search.fit(X_train, y_train)
        best_models[name] = search.best_estimator_
        
        print(f"  ✓ {name} completed - Best recall: {search.best_score_:.4f}")
    
    print("\nHyperparameter tuning completed for all models!")
    return best_models

def create_voting_classifier(results, X_train, y_train):
        """Create a VotingClassifier using the top two models based on test recall."""
        top_models = results.iloc[:3][['Model', 'Fitted_Model']].values
        if len(top_models) < 2:
            raise ValueError("Need at least two models for voting classifier.")
        
        # Display which models are being ensembled
        model1_name = top_models[0][0]
        model2_name = top_models[1][0]
        model3_name=top_models[2][0]
        print(f"Creating ensemble with the top 3 models:")
        print(f"  1. {model1_name} ")
        print(f"  2. {model2_name} ")
        print(f"  3. {model3_name} ")
        
        voting_classifier = VotingClassifier(
            estimators=[
                (model1_name, top_models[0][1]),
                (model2_name, top_models[1][1]),
                (model3_name, top_models[2][1]),
            ],
            voting='soft',
           
        )
        voting_classifier.fit(X_train, y_train)
        
        return {'Voting Classifier': voting_classifier}


def print_and_select_best_model(results, X_test, y_test, X_new_data=None):
    """Print model performance, select best model, and return predictions."""
    print("\nFinal Model Performance:")
    print("┌" + "─" * 80 + "┐")
    print(f"│{'Model':<18} {'CV_Acc':<8} {'CV_Rec':<8} {'Test_Acc':<9} {'Test_Rec':<9} {'Test_F1':<9} {'ROC_AUC':<8}│")
    print("├" + "─" * 80 + "┤")
    for _, row in results.round(4).iterrows():
        print(f"│{row['Model']:<18} {row['CV_Accuracy']:<8.4f} {row['CV_Recall']:<8.4f} "
              f"{row['Test_Accuracy']:<9.4f} {row['Test_Recall']:<9.4f} {row['Test_F1']:<9.4f} {row['Test_ROC_AUC']:<8.4f}│")
    print("└" + "─" * 80 + "┘")

    best_model = results.iloc[0]['Fitted_Model']
    print(f"\nBest Model: {results.iloc[0]['Model']} (Test Recall: {results.iloc[0]['Test_Recall']:.4f})")

    # Make predictions on test data
    test_predictions = best_model.predict(X_test)
    test_probabilities = best_model.predict_proba(X_test)[:, 1]

    # Make predictions on new data if provided
    new_predictions = None
    new_probabilities = None
    if X_new_data is not None:
        new_predictions = best_model.predict(X_new_data)
        new_probabilities = best_model.predict_proba(X_new_data)[:, 1]

    return {
        'best_model': best_model,
        'test_predictions': test_predictions,
        'test_probabilities': test_probabilities,
        'new_predictions': new_predictions,
        'new_probabilities': new_probabilities
    }
    


def model_trainer_and_evaluator(X_train, y_train, X_test, y_test, hpt=False, use_voting=False, X_new_data=None):
    """Train and evaluate models, with optional hyperparameter tuning and voting classifier."""
    print(f"\nTraining models (Hyperparameter tuning: {'Enabled' if hpt else 'Disabled'}, "
          f"Voting Classifier: {'Enabled' if use_voting else 'Disabled'})")
    print(f"Train samples: {len(X_train):,}, Test samples: {len(X_test):,}")
    
    # Get and train models
    models = tune_models(X_train, y_train) if hpt else get_default_models()
    fitted_models = train_models(models, X_train, y_train)
    plot_roc_curves(fitted_models, X_test, y_test)
    # Evaluate models
    results = evaluate_models(fitted_models, X_train, y_train, X_test, y_test)
    plot_model_performance(results)
    # Add voting classifier if requested
    if use_voting:
        voting_model = create_voting_classifier(results, X_train, y_train)
        voting_results = evaluate_models(voting_model, X_train, y_train, X_test, y_test)
        results = pd.concat([results, voting_results], ignore_index=True).sort_values('Test_Recall', ascending=False)
    
    # Print results and select best model
    output = print_and_select_best_model(results, X_test, y_test, X_new_data)
    print(output['best_model'])
    
    return output['best_model']