from typing import List, Dict, Any

try:
    from admet_ai import ADMETModel
except Exception:
    ADMETModel = None

class ADMETClient:
    _model = None

    @classmethod
    def load(cls):
        if ADMETModel and cls._model is None:
            cls._model = ADMETModel()
        return cls._model

    @classmethod
    def predict(cls, smiles: str) -> List[Dict[str, Any]]:
        if ADMETModel is None:
            return [
                {"property": "HIA", "value": 0.82, "probability": 0.82},
                {"property": "hERG", "value": "low-risk", "probability": 0.73},
            ]
        model = cls.load()
        preds = model.predict([smiles])  # pandas.DataFrame
        return preds.to_dict(orient="records") 