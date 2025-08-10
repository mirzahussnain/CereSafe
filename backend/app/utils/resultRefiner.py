import shap
import pandas as pd






def get_risk_level(probability: float) -> str:
    """Categorize risk level based on probability."""
    if probability < 0.2:
        return "Low"
    elif probability < 0.5:
        return "Moderate"
    else:
        return "High"


def RefinePredictionResult(prediction: int, probability: float, model, features,background_data):
    """
    Refines the prediction result by adding risk level and top SHAP feature contributions.

    Args:
        prediction (int): Predicted class label.
        probability (float): Probability of the positive class.
        model: Trained model used for prediction.
        features (pandas.DataFrame or array-like): Feature values for explanation.

    Returns:
        dict: Dictionary containing the prediction, probability, SHAP top contributors, and risk level.
    """
    # Ensure features is a DataFrame to preserve column names for SHAP
    if not isinstance(features, pd.DataFrame):
        raise ValueError("Features must be a pandas DataFrame with column names.")
    
    print(background_data)
   
    risk_level = get_risk_level(probability)

    # Explain model prediction
    explainer = shap.LinearExplainer(model, background_data)
    shap_values = explainer(features.iloc[[0]])  # Only first row for single prediction

    # Extract and sort top features
    top_features = sorted(
        zip(
            shap_values.feature_names,
            shap_values.data[0],
            shap_values.values[0]
        ),
        key=lambda x: abs(x[2]),
        reverse=True
    )[:5]

    return {
        'success': 1,
        'prediction': int(prediction),
        'probability': float(probability),
        'top_contributors': [
            {'feature': name, 'value': float(val), 'impact': float(impact)}
            for name, val, impact in top_features
        ],
        'risk_level': risk_level,
    }
