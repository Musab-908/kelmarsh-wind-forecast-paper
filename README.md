# ﻿# Kelmarsh Wind Power Forecast

This project forecasts wind-turbine power with the fitted XGBoost regression
pipeline in `backend/models/model_bundle.joblib`. The bundle contains 12 raw
input features, the fitted pipeline, task `regression`, and model version
`1.0`. The Angular form uses the feature order from the bundle and bounds from
`data/feature_ranges.csv`.

## Local setup

PowerShell:

```powershell
py -3.14 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python backend\make_payload.py
```

The bundle currently requires `xgboost==2.1.4` and `scikit-learn==1.9.1`.
Use the Python version and dependencies that created the artifact if those
versions are changed during retraining.

## Run and test the backend

In Terminal 1:

```powershell
python backend\app.py
```

In another terminal:

```powershell
curl.exe --noproxy "*" http://127.0.0.1:5000/health
python backend\test_pipeline.py
python backend\test_api.py
python -m pytest -q backend\tests
```

The API exposes `GET /health` and `POST /predict`. Predictions are a numeric
regression value and are marked as a research/teaching prototype.

## Run the Angular app

```powershell
cd frontend
npm ci
ng serve --open --proxy-config proxy.conf.json
```

Open `http://localhost:4200`. The proxy forwards `/api` requests to Flask.
The GitHub Pages build is a static demonstration; its prediction button is
disabled because Pages does not host Flask or the model API.

## CI and Pages

`.github/workflows/ci.yml` runs the portable structure check and Angular build.
`.github/workflows/pages.yml` deploys the Angular production build to GitHub
Pages using the repository name as its base path. Enable GitHub Pages with
**GitHub Actions** as the source in repository settings.
