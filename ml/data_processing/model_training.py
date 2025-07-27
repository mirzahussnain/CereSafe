from pathlib import Path
from catboost import CatBoostClassifier
from lightgbm.sklearn import LGBMClassifier

from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, make_scorer, precision_score, recall_score
from sklearn.model_selection import RandomizedSearchCV
from sklearn.svm import SVC
from xgboost import XGBClassifier
from utils.config_loader import get_config



def model_evaluation(y_test, y_pred):
    cm = confusion_matrix(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    print("Confusion Matrix:\n", cm)
    print(f"Validation Accuracy: {accuracy:.2%}")
    print(f"Precision: {precision:.2%} | Recall: {recall:.2%} | F1: {f1:.2%}")
    print("Classification Report:\n", classification_report(y_test, y_pred, digits=2))


def model_selector(X_train, y_train, X_test, y_test):
    scoring = {
        'recall': make_scorer(recall_score, pos_label=1),
        'f1': make_scorer(f1_score, pos_label=1),
        'accuracy': make_scorer(accuracy_score)
    }

    models = {
        'LogisticRegression': {
            'model': LogisticRegression(max_iter=1000),
            'params': {
                'C': [0.001, 0.01, 0.1, 1.0, 10.0],
                'class_weight': [{0: 1, 1: 3}, {0: 1, 1: 5}, {0: 1, 1: 7}, 'balanced'],
                'solver': ['liblinear']
            }
        },
        'XGBClassifier': {
            'model': XGBClassifier(eval_metric='logloss', use_label_encoder=False),
            'params': {
                'max_depth': [3, 5, 7],
                'learning_rate': [0.01, 0.05, 0.1],
                'scale_pos_weight': [5, 10, 15],
                'reg_alpha': [0, 1.0, 2.0]
            }
        },
        'SVC': {
            'model': SVC(probability=True),
            'params': {
                'C': [0.1, 0.5, 1.0, 10.0],
                'gamma': ['scale', 'auto', 0.1, 1.0],
                'class_weight': [{0: 1, 1: 3}, {0: 1, 1: 5}, 'balanced'],
                'kernel': ['rbf']
            }
        },
        'CatBoostClassifier': {
            'model': CatBoostClassifier(logging_level='Silent'),
            'params': {
                'iterations': [50, 100, 200],
                'learning_rate': [0.01, 0.05, 0.1],
                'depth': [4, 6, 8],
                'class_weights': [[1, 3], [1, 4], [1, 5]]
            }
        },
        'LGBMClassifier': {
            'model': LGBMClassifier(objective='binary', random_state=42, verbose=-1),
            'params': {
                'n_estimators': [100, 200, 300],
                'learning_rate': [0.01, 0.05, 0.1],
                'num_leaves': [20, 31, 50],
                'class_weight': [{0: 1, 1: 3}, {0: 1, 1: 5}, 'balanced']
            }
        }
    }

    results = {}
    for model_name, config in models.items():
        print(f"Tuning {model_name}...")
        search = RandomizedSearchCV(
            estimator=config['model'],
            param_distributions=config['params'],
            n_iter=10,
            scoring=scoring,
            refit='recall',
            cv=5,
            n_jobs=-1,
            verbose=1,
            random_state=42
        )
        search.fit(X_train, y_train)
        y_pred = search.predict(X_test)
        results[model_name] = {
            'best_params': search.best_params_,
            'best_recall_cv': search.best_score_,
            'test_recall': recall_score(y_test, y_pred, pos_label=1),
            'test_precision': precision_score(y_test, y_pred, pos_label=1),
            'test_accuracy': accuracy_score(y_test, y_pred)
        }

    best_models = {
        'recall': {'model': None, 'score': 0},
        'precision': {'model': None, 'score': 0},
        'accuracy': {'model': None, 'score': 0}
    }

    for model_name, metrics in results.items():
        for metric in best_models:
            if metrics[f'test_{metric}'] > best_models[metric]['score']:
                best_models[metric] = {
                    'model': model_name,
                    'score': metrics[f'test_{metric}'],
                    'params': metrics['best_params'],
                    'precision': metrics['test_precision'],
                    'recall': metrics['test_recall'],
                    'accuracy': metrics['test_accuracy']
                }

    return best_models


def generate_recommendation(user_features):
    recommendations = []
    if user_features.get('SmokingStatus') == 'Yes':
        recommendations.append("Consider quitting smoking to reduce stroke risk.")
    if user_features.get('Bmi', 0) > 30:
        recommendations.append("Your BMI is high. Consider consulting a dietitian.")
    if user_features.get('Hypertension') == 1:
        recommendations.append("Blood pressure control is important. Follow up with your doctor.")
    if user_features.get('Age', 0) > 60:
        recommendations.append("Older age increases risk. Regular screening is advised.")
    return recommendations


def model_trainer(x_train, y_train, x_test, y_test, mode, index=0):
    config = get_config()
    lr = LogisticRegression(solver='liblinear', class_weight={0: 1, 1: 2}, C=10.0)
    svm = SVC(kernel='rbf', gamma=1.0, class_weight={0: 1, 1: 3}, C=1.0, probability=True)
    lgbm = LGBMClassifier(num_leaves=31, n_estimators=200, learning_rate=0.1, class_weight={0: 1, 1: 5}, max_depth=3)
    xgb = XGBClassifier(max_depth=3, learning_rate=0.1, scale_pos_weight=5, reg_alpha=2.0)

    if mode == 'single':
        lr=lr.fit(x_train, y_train)
        svm=svm.fit(x_train, y_train)
        xgb=xgb.fit(x_train, y_train)
        model = VotingClassifier(
            estimators=[('lr', lr), ('xgb', xgb), ('svm', svm)],
            voting='soft',
            weights=[4, 5, 3]
        )
        
        
    else:
        lgbm.fit(x_train, y_train)
        lr.fit(x_train,x_test)
        model = VotingClassifier(
            estimators=[('lr', lr), ('lgbm', lgbm)], # type: ignore
            voting='soft'
        )
        

    model.fit(x_train, y_train)
    y_pred = model.predict(x_test)
    model_evaluation(y_test, y_pred)
    return model
    
   
