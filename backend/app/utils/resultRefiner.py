import shap


def get_risk_level(probability):
        """Categorize risk level based on probability"""
        if probability < 0.3:
            return "Low"
        elif probability < 0.6:
            return "Moderate"
        else:
            return "High"


def RefinePredictionResult(prediction, probability,model,features):
    """
    Refines the prediction result by formatting it into a dictionary.

    Args:
        prediction (int): The predicted class label.
        probability (float): The probability of the predicted class.
        top_features (list): A list of tuples containing feature names and their SHAP values.

    Returns:
        dict: A dictionary containing the prediction, probability, and top features.
    """
    riskLevel= get_risk_level(probability)
    explainer = shap.Explainer(model)
    shap_values = explainer(features)
    top_features = sorted(
            zip(
                shap_values[0].feature_names,  # Feature names
                shap_values[0].data,            # Original values
                shap_values[0].values           # SHAP values
            ),
            key=lambda x: abs(x[2]),            # Sort by absolute impact
            reverse=True
        )[:5]  # Get top 5 features with largest absolute SHAP values
    results = {
        'success':1,
        'prediction': int(prediction),
        'probability': float(probability),
        'top_contributors': [
            {'feature': name, 'value': float(val), 'impact': float(shap_val)}
            for name, val, shap_val in top_features
        ],
        'risk_level': riskLevel,
    }
    return results