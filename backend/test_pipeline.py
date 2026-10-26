from pathlib import Path
import json

import joblib
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
bundle = joblib.load(ROOT / "backend/models/model_bundle.joblib")
with (ROOT / "backend/test_payload.json").open(encoding="utf-8") as file:
    payload = json.load(file)

features = bundle["features"]
assert set(features) == set(payload), "Payload keys must match features"
frame = pd.DataFrame([[payload[feature] for feature in features]], columns=features)
model = bundle["pipeline"]
print("Prediction:", model.predict(frame).tolist())
print("PASS: local inference")
