Week 6: DEVOPS LAB  |  ML MODEL → FLASK → ANGULAR → GITHUB CI/CD

LABORATORY Manual

From a Trained ML Model to a Full-Stack Research Application

Windows • Visual Studio Code • Python • Flask • Angular 22 • Git • GitHub Actions • GitHub Pages

General instructions for each student’s own dataset and saved model; colorectal cancer (CRC) is a running example only.

# Learning outcomes

• Package a trusted, fitted model and its exact preprocessing and input schema.

• Build and test a local Flask REST API.

• Create an Angular application with a validated feature form and response display.

• Manage terminals and local development in VS Code without stopping required servers.

• Create one root Git repository and publish it to GitHub.

• Automate backend tests, frontend build, and GitHub Pages deployment using GitHub Actions.

• Distinguish locally executable predictions from a publicly hosted static interface.

# How to use this Manual

Complete steps in order. Execute commands in the stated terminal, from the stated folder. Do not paste Python code into PowerShell: create the named .py file and paste it there. Do not paste PowerShell commands into Python. **Whenever the manual says “keep running,” leave that terminal open**. All paths use **D:\ml_project as a teaching example**; replace the root consistently with your own folder name. If a command fails, do not proceed to the next checkpoint.

Prompt convention: when the **Angular CLI asks “Would you like to share pseudonymous usage data?” type N and press Enter**. For GitHub browser prompts, choose the exact selections described. An instruction to press 

# 15-stage roadmap

| Stage | Activity | Status for student |
| --- | --- | --- |
| 1 | Project plan, prerequisites and model inventory | To complete and verify |
| 2 | Install and verify developer tools | To complete and verify |
| 3 | Create local workspace, folders and Python environment | To complete and verify |
| 4 | Export or adapt saved model and preprocessing | To complete and verify |
| 5 | Create sample payload and verify direct inference | To complete and verify |
| 6 | Build Flask REST API | To complete and verify |
| 7 | Run local API tests and manage terminals | To complete and verify |
| 8 | Install Angular CLI and generate frontend | To complete and verify |
| 9 | Build complete Angular feature form | To complete and verify |
| 10 | Connect Angular to Flask and verify end-to-end | To complete and verify |
| 11 | Prepare root Git repository and .gitignore | To complete and verify |
| 12 | Create GitHub remote and push source | To complete and verify |
| 13 | Automate Python and Angular checks with GitHub Actions | To complete and verify |
| 14 | Deploy Angular static frontend to GitHub Pages | To complete and verify |
| 15 | Validate, troubleshoot, document and submit | To complete and verify |

# Architecture and deployment boundary

Browser / Angular form (http://localhost:4200)

      |   POST /api/predict (JSON)

      v

Angular dev proxy  -> Flask API (http://127.0.0.1:5000)

      | validation -> fitted preprocessing -> trained model

      v

JSON prediction -> Angular result panel

 

Git repository -> GitHub Actions (tests + Angular build)

               -> GitHub Pages (STATIC ANGULAR ONLY)

CRC running example: the local Flask API accepts 24 features, performs the saved transformations, obtains Logistic Regression and XGBoost probabilities, computes SHAP magnitude and invokes a meta-learner. This is NOT the generic student implementation. Students must preserve their own real prediction pipeline and output meaning.

# STAGE 1 — Project plan and inventory

## 1.1. Choose a model and record its provenance

Write down your project name, problem type (binary/multiclass classification or regression), training notebook/script, target meaning, Python version, exact library versions, license/permission, and known successful prediction. The model must be a trusted file created by you or your team.

## 1.2. Decide whether your saved artifact includes preprocessing

Preferred: a fitted sklearn Pipeline saved with joblib. If you have only an estimator .pkl, you must recover the original fitted encoders, imputers and scalers from training and assemble an equivalent fitted pipeline. Do NOT fit a fresh scaler on a single prediction record. If custom model classes are used, they must be importable when loading the artifact.

## 1.3. Choose the student input schema

Record exact feature names, order, type (number/category), allowed categories, valid ranges, and one non-sensitive sample record. If the model expects engineered features, document how raw form values become engineered features. A CSV may include a target column; never send the target as a predictor.

## 1.4. Understand deployment scope

The local Flask server will execute the model; GitHub Pages will host only a static Angular interface. Public visitors cannot invoke your local Flask instance. The manual will use a static demo/explanation state on Pages. Never claim that Pages hosts Python.

# STAGE 2 — Install and verify software

## 2.1. Install Visual Studio Code

Open https://code.visualstudio.com/ in a browser, download Windows installer, run it, accept license, and finish installation. Launch VS Code. Install Microsoft Python and Pylance extensions from Extensions (Ctrl+Shift+X).

## 2.2. Install Python compatible with your model

Visit https://www.python.org/downloads/windows/ and select a version compatible with your saved model. Python 3.12 is the worked baseline; an older pickle may require older scikit-learn/XGBoost. During Windows setup enable “Add python.exe to PATH” if offered. Open PowerShell and verify:

```
py -3.12 --version
py -3.12 -m pip --version
```

**CHECKPOINT / IMPORTANT:** If Python 3.12 is not installed, use your verified compatible interpreter and adjust commands consistently.

## 2.3. Install Git for Windows

Download from https://git-scm.com/downloads/win, run installer with normal defaults, close/reopen VS Code after installation, then run:

```
git --version
```

## 2.4. Install Node.js LTS with npm

Download the Windows LTS installer at https://nodejs.org/en/download. Install using defaults including PATH. CLOSE ALL VS CODE WINDOWS and reopen if the new terminal cannot find node. Verify:

```
node --version
npm --version
```

**CHECKPOINT / IMPORTANT:** Both must print version numbers. Example CRC environment: Node 24.22.0, npm 11.19.1; these are examples, not required exact versions.

## 2.5. Create GitHub account and sign in

Open https://github.com/, select Sign up if needed, confirm email, then sign in. Keep your GitHub username available. Do not paste account passwords into terminal commands.

## 2.6. Verify the browser and VS Code terminal

In VS Code choose Terminal → New Terminal; PowerShell prompt should show PS. Use Terminal → Split Terminal or the plus (+) icon to create more terminals later. If a new terminal activates .venv automatically, that is acceptable for Node/npm.

## 2.7. Write down your installed versions

In a new terminal execute the following and copy the output into docs/environment.txt later:

```
git --version
node --version
npm --version
py -3.12 --version
```

# STAGE 3 — Create workspace and Python environment

## 3.1. Create project root and open in VS Code

Open Windows PowerShell (or VS Code terminal) and run. If your project is already present, skip mkdir and open the existing folder.

```
New-Item -ItemType Directory -Force D:\ml_project
cd D:\ml_project
code .
```

**CHECKPOINT / IMPORTANT:** If code is not recognized, open VS Code → File → Open Folder → D:\ml_project.

## 3.2. Create required folders (NOT frontend yet)

From PS D:\ml_project> run:

```
New-Item -ItemType Directory -Force backend, backend\models, backend\tests, data, notebooks, docs, .github, .github\workflows
```

**CHECKPOINT / IMPORTANT:** Check in VS Code Explorer (Ctrl+Shift+E) that each folder appears. Angular CLI will generate frontend later; do not create it manually.

## 3.3. Create a Python virtual environment

From project root:

```
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**CHECKPOINT / IMPORTANT:** Expected prefix: (.venv) PS D:\ml_project>. If activation is blocked, run Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned and retry; or call .\.venv\Scripts\python.exe directly.

## 3.4. Install backend dependencies

From the activated environment, install a compatible set. For old model artifacts, pin the training versions before running these commands.

```
python -m pip install --upgrade pip
python -m pip install flask pandas numpy joblib scikit-learn requests pytest
```

**CHECKPOINT / IMPORTANT:** Add xgboost, shap, lightgbm, torch etc. ONLY when your model requires them. Flask-CORS is not needed for the dev-proxy method used here.

## 3.5. Create initial project metadata and record dependencies

In VS Code Explorer right-click project root → New File → README.md; type your project title. In terminal run:

```
python -m pip freeze > backend\requirements.txt
python -m pip --version
Get-ChildItem backend
```

**CHECKPOINT / IMPORTANT:** The CI workflow will use backend/requirements.txt. Review it; remove machine-specific or unrelated packages if needed. Keep versions compatible with your artifact.

# STAGE 4 — Package student model and fitted preprocessing

## 4.1. Copy your trusted model and input data

Copy your own fitted .pkl/.joblib into backend/models and a non-sensitive representative CSV into data. In Explorer, right-click backend/models → Reveal in File Explorer, then paste. The manual uses the filename model_bundle.joblib for the final deployable artifact.

## 4.2. Preferred: export a fitted pipeline from your training notebook

Open your training notebook. AFTER fitting the preprocessor and estimator, save a fitted Pipeline or your already-fitted Pipeline. Replace the example variable names with your real training variables. Save to the project root-relative path shown:

```
from pathlib import Path
import joblib
from sklearn.pipeline import Pipeline

# In YOUR training notebook: these objects must already be fitted.
# If your trained object is already a fitted Pipeline, use it directly.
trained_pipeline = Pipeline([
    ("preprocess", fitted_preprocessor),
    ("model", fitted_estimator),
])
feature_names = list(X_train.columns)  # EXACT training input order
bundle = {
    "pipeline": trained_pipeline,
    "features": feature_names,
    "task": "classification",  # or "regression"
    "model_version": "1.0",
}
Path("backend/models").mkdir(parents=True, exist_ok=True)
joblib.dump(bundle, "backend/models/model_bundle.joblib")
```

**CHECKPOINT / IMPORTANT:** Do not execute the example verbatim unless fitted_preprocessor, fitted_estimator and X_train exist in your training notebook. If your model was trained with a fitted Pipeline, use bundle["pipeline"] = your_fitted_pipeline.

## 4.3. Alternative: package a model that already contains preprocessing

If your existing saved artifact is a fitted sklearn Pipeline, create a new file backend/package_existing.py and paste the code below. Set SOURCE to your trusted file, and replace FEATURES with exact original input names:

```
from pathlib import Path
import joblib

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "models" / "my_existing_pipeline.pkl"
FEATURES = ["feature_1", "feature_2"]  # REPLACE EXACTLY
TASK = "classification"  # or "regression"

pipeline = joblib.load(SOURCE)  # trusted artifact only
assert hasattr(pipeline, "predict"), "Artifact must implement predict"
assert FEATURES and all(isinstance(x, str) for x in FEATURES)
bundle = {"pipeline": pipeline, "features": FEATURES,
          "task": TASK, "model_version": "1.0"}
joblib.dump(bundle, ROOT / "models" / "model_bundle.joblib")
print("Saved model bundle:", len(FEATURES), "features")
```

**CHECKPOINT / IMPORTANT:** Run python backend\package_existing.py ONLY after editing SOURCE and FEATURES. A bare estimator with missing preprocessing cannot be fixed merely by wrapping it in a dictionary; return to original training pipeline.

## 4.4. Special case: non-sklearn/custom ensemble

If you have (CRC is example use case used in this manual) **XGBoost**** + SHAP + meta-learner (CRC) or PyTorch**, create a model-specific inference adapter that accepts a DataFrame and returns a JSON-compatible prediction. This workbook’s generic **app.py** expects a fitted object with predict(); replace only its prediction block for your architecture. Record the custom dependencies and test against known training-time predictions.

## 4.5. Check the bundle exists and loads

From project root:

```
python -c "import joblib; b=joblib.load('backend/models/model_bundle.joblib'); print(b.keys()); print(b['features']); print(type(b['pipeline']))"
```

**CHECKPOINT / IMPORTANT:** If loading fails, check trusted source path, model serialization version, custom class imports and fitted preprocessing. Do not continue until it loads.

# STAGE 5 — Sample payload and independent inference

## 5.1. Create a safe sample CSV

In data folder create sample_inputs.csv containing ONE header row of exact model input feature names and at least one representative non-sensitive record. You can export a row from the original model input DataFrame using X_test.head(1).to_csv("data/sample_inputs.csv", index=False). Do not include the target column.

## 5.2. Create backend/make_payload.py

Right-click backend → New File → make_payload.py. Paste:

```
from pathlib import Path
import json
import joblib
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
bundle = joblib.load(ROOT / "backend/models/model_bundle.joblib")
features = bundle["features"]
df = pd.read_csv(ROOT / "data/sample_inputs.csv", nrows=1)
missing = [f for f in features if f not in df.columns]
if missing:
    raise ValueError(f"Sample CSV missing columns: {missing}")
row = df.loc[0, features]
payload = {}
for key, value in row.items():
    payload[key] = (None if pd.isna(value) else
                    value.item() if hasattr(value, "item") else value)
out = ROOT / "backend/test_payload.json"
out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
print(f"Created {out} with {len(payload)} features")
```

## 5.3. Generate backend/test_payload.json

In Terminal 2 (or your current terminal) from root:

```
python backend\make_payload.py
Get-Content backend\test_payload.json
```

**CHECKPOINT / IMPORTANT:** Verify JSON keys exactly match your feature list and the record contains no sensitive information.

## 5.4. Create backend/test_pipeline.py

Right-click backend → New File → test_pipeline.py; paste:

```
from pathlib import Path
import json
import joblib
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
bundle = joblib.load(ROOT / "backend/models/model_bundle.joblib")
with (ROOT / "backend/test_payload.json").open(encoding="utf-8") as f:
    payload = json.load(f)
features = bundle["features"]
assert set(features) == set(payload), "Payload keys must match features"
frame = pd.DataFrame([[payload[f] for f in features]], columns=features)
model = bundle["pipeline"]
print("Prediction:", model.predict(frame).tolist())
if hasattr(model, "predict_proba"):
    print("Probabilities:", model.predict_proba(frame).tolist())
print("PASS: local inference")
```

## 5.5. Run direct inference and compare known result

From root:

```
python backend\test_pipeline.py
```

**CHECKPOINT / IMPORTANT:** Expect PASS: local inference. Confirm the prediction agrees with your original training notebook for the SAME sample. If not, fix preprocessing or schema BEFORE building Flask.

# STAGE 6 — Build the Flask REST API

## 6.1. Create backend/app.py

In Explorer right-click backend → New File → app.py. Paste the entire file below. This generic API uses your saved fitted sklearn pipeline; for a custom model replace the marked inference block:

```
from pathlib import Path
import joblib
import pandas as pd
from flask import Flask, jsonify, request

BASE = Path(__file__).resolve().parent
BUNDLE = joblib.load(BASE / "models/model_bundle.joblib")
MODEL = BUNDLE["pipeline"]
FEATURES = BUNDLE["features"]
TASK = BUNDLE.get("task", "classification")
app = Flask(__name__)

@app.get("/health")
def health():
    return jsonify(status="ok", features=len(FEATURES), task=TASK)

@app.post("/predict")
def predict():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Expected a JSON object"), 400
    missing = [f for f in FEATURES if f not in data]
    extra = [f for f in data if f not in FEATURES]
    if missing or extra:
        return jsonify(error="Input schema mismatch",
                       missing=missing, extra=extra), 400
    frame = pd.DataFrame([[data[f] for f in FEATURES]], columns=FEATURES)
    try:
        # CUSTOM MODELS: replace this block with YOUR saved inference steps.
        prediction = MODEL.predict(frame)[0]
        prediction = (prediction.item() if hasattr(prediction, "item")
                      else prediction)
        result = {"prediction": prediction, "task": TASK,
                  "disclaimer": "Research/teaching prototype only."}
        if TASK == "classification" and hasattr(MODEL, "predict_proba"):
            result["probabilities"] = MODEL.predict_proba(frame)[0].tolist()
        return jsonify(result)
    except (ValueError, TypeError) as exc:
        return jsonify(error="Invalid input", detail=str(exc)), 400
    except Exception:
        app.logger.exception("Prediction failed")
        return jsonify(error="Prediction processing failed"), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
```

## 6.2. Check Flask installation and route names

From root run:

```
python -c "import flask; print(flask.__version__ if hasattr(flask, '__version__') else 'Flask imported')"
```

**CHECKPOINT / IMPORTANT:** Endpoints are GET /health and POST /predict. Use JSON, not form-data. For actual applications add numeric range checks and allowed-category validation according to your model.

## 6.3. Start Terminal 1: Flask

In VS Code choose Terminal → New Terminal. Click its dropdown and rename terminal to “1 - Flask” if desired. From project root activate .venv and run:

```
cd D:\ml_project
.\.venv\Scripts\Activate.ps1
python backend\app.py
```

**CHECKPOINT / IMPORTANT:** Expect “Running on http://127.0.0.1:5000”. KEEP TERMINAL 1 OPEN. Do not type another command into this terminal while Flask is running.

## 6.4. Verify health endpoint in browser

Open browser at http://127.0.0.1:5000/health. Expected JSON contains status: ok and features equal to your model’s number of input features. The root / may show 404; that is normal.

## 6.5. Explain Flask restart and stopping

After changing backend/app.py, stop Flask in Terminal 1 with Ctrl+C, then rerun python backend\app.py. If the server reports port 5000 in use, confirm an older Flask process is not still running. Never stop the Angular terminal when only Flask needs restarting.

# STAGE 7 — Test API using Terminal 2

## 7.1. Open a separate testing terminal

VS Code → Terminal → New Terminal. Keep Terminal 1 Flask running. In Terminal 2 enter:

```
cd D:\ml_project
.\.venv\Scripts\Activate.ps1
```

## 7.2. Test GET /health using curl

In Terminal 2:

```
curl.exe --noproxy "*" -i http://127.0.0.1:5000/health
```

**CHECKPOINT / IMPORTANT:** Expected HTTP/1.1 200 OK and JSON. If not, check Flask Terminal 1 and verify port 5000.

## 7.3. Test POST /predict using curl

In Terminal 2, from project root:

```
curl.exe --noproxy "*" -i -X POST "http://127.0.0.1:5000/predict" -H "Content-Type: application/json" --data-binary "@backend/test_payload.json"
```

**CHECKPOINT / IMPORTANT:** Expected HTTP 200 and JSON prediction. Confirm Terminal 1 logs a POST /predict 200.

## 7.4. Create backend/test_api.py with direct Requests session

Right-click backend → New File → test_api.py; paste:

```
from pathlib import Path
import json
import requests

BASE = Path(__file__).resolve().parent
payload = json.loads((BASE / "test_payload.json").read_text(encoding="utf-8"))
with requests.Session() as session:
    session.trust_env = False  # avoids inherited proxy for localhost
    response = session.post("http://127.0.0.1:5000/predict",
                            json=payload, timeout=60)
    print("HTTP Status:", response.status_code)
    print("Response:", response.text)
    response.raise_for_status()
print("PASS: API request")
```

## 7.5. Execute Requests API test

In Terminal 2:

```
python backend\test_api.py
```

**CHECKPOINT / IMPORTANT:** Expected HTTP Status: 200 and PASS: API request. If a campus proxy intercepts localhost, trust_env=False helps Requests use a direct local connection. Do not disable security software.

## 7.6. Create automated negative and positive API tests

Create backend/tests/test_api.py and paste:

```
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))
from app import app, FEATURES

PAYLOAD = json.loads((ROOT / "backend/test_payload.json").read_text(encoding="utf-8"))

def test_health():
    response = app.test_client().get("/health")
    assert response.status_code == 200
    assert response.get_json()["features"] == len(FEATURES)

def test_predict_valid():
    response = app.test_client().post("/predict", json=PAYLOAD)
    assert response.status_code == 200, response.get_json()
    assert "prediction" in response.get_json()

def test_predict_missing_feature():
    incomplete = dict(PAYLOAD)
    incomplete.pop(FEATURES[0])
    response = app.test_client().post("/predict", json=incomplete)
    assert response.status_code == 400

def test_predict_invalid_json():
    response = app.test_client().post("/predict", data="not-json",
                                      content_type="application/json")
    assert response.status_code == 400
```

## 7.7. Run automated tests

In Terminal 2:

```
python -m pytest -q backend\tests
```

**CHECKPOINT / IMPORTANT:** Expected 4 passed (assuming your sample record is valid). If CI later lacks a model artifact, the model-dependent tests cannot run there; follow Stage 13’s artifact decision.

# STAGE 8 — Install Angular CLI and generate frontend

## 8.1. Check Node and npm

In Terminal 2 (Flask may continue in Terminal 1):

```
node --version
npm --version
```

**CHECKPOINT / IMPORTANT:** If node is not recognized after installing, CLOSE VS CODE COMPLETELY, reopen project and a fresh terminal, then repeat. If you close VS Code, restart Flask in Terminal 1 afterward.

## 8.2. Install Angular CLI

In Terminal 2:

```
npm install -g @angular/cli
ng version
```

**CHECKPOINT / IMPORTANT:** Example CLI 22.2.3. If ng.ps1 is blocked by PowerShell, use ng.cmd version and ng.cmd new instead.

## 8.3. Generate frontend from project root

In Terminal 2:

```
cd D:\ml_project
ng new frontend --routing --style=css --skip-git --defaults
```

**CHECKPOINT / IMPORTANT:** If prompted “Would you like to share pseudonymous usage data?” type N then press Enter. Wait for “Packages installed successfully.” Do not create a second Git repository in frontend.

## 8.4. Run Angular in Terminal 2

From Terminal 2:

```
cd D:\ml_project\frontend
ng serve --open
```

**CHECKPOINT / IMPORTANT:** Expected http://localhost:4200 and Angular welcome page. KEEP TERMINAL 2 RUNNING. Terminal 1 should still run Flask; open Terminal 3 for edits/commands.

## 8.5. Open Terminal 3 for file operations

VS Code → Terminal → New Terminal; run:

```
cd D:\ml_project
```

**CHECKPOINT / IMPORTANT:** Keep Terminal 1 = Flask, Terminal 2 = Angular, Terminal 3 = commands/Git/tests. Angular watches files and reloads when they change.

# STAGE 9 — Implement the complete Angular input form

## 9.1. Choose a feature metadata file for student-specific fields

Create frontend/src/assets? Angular 22 uses public/ for static assets. Instead create frontend/src/app/feature-schema.ts. Replace example fields with YOUR exact feature names/types; values must match your model’s raw input schema. This template includes two illustrative fields ONLY:

```
export type Feature = {
  name: string;
  label: string;
  kind: 'number' | 'category';
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
};

// REPLACE with EVERY raw input field expected by your model.
export const FEATURES: Feature[] = [
  { name: 'feature_1', label: 'Feature 1', kind: 'number', required: true },
  { name: 'feature_2', label: 'Feature 2', kind: 'category',
    required: true, options: ['No', 'Yes'] },
];
```

**CHECKPOINT / IMPORTANT:** IMPORTANT: The sample names feature_1/feature_2 are placeholders, NOT universal data. For a 24-feature model, write 24 entries. For category fields, options must match the original fitted encoder’s expected raw labels.

## 9.2. Configure Angular dev proxy

Create frontend/proxy.conf.json with EXACT content:

```
{
  "/api": {
    "target": "http://127.0.0.1:5000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" }
  }
}
```

**CHECKPOINT / IMPORTANT:** The Angular browser will call /api/predict; Angular dev server forwards it to Flask /predict. This avoids local CORS configuration. Restart ng serve after changing proxy settings.

## 9.3. Enable HttpClient in app.config.ts

Open frontend/src/app/app.config.ts. Preserve its existing imports/providers. Add import { provideHttpClient } from "@angular/common/http"; and include provideHttpClient() inside providers. A complete Angular 22 example is:

```
import { ApplicationConfig, provideBrowserGlobalErrorListeners,
         provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

**CHECKPOINT / IMPORTANT:** If the generated app.config.ts differs, retain its generated providers and only add provideHttpClient().

## 9.4. Create frontend/src/app/prediction.service.ts

Paste:

```
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionResponse {
  prediction: string | number;
  task: string;
  probabilities?: number[];
  disclaimer?: string;
}
@Injectable({ providedIn: 'root' })
export class PredictionService {
  private http = inject(HttpClient);
  predict(payload: Record<string, string | number>): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>('/api/predict', payload);
  }
}
```

**CHECKPOINT / IMPORTANT:** Using relative /api/predict works in LOCAL development through the proxy. On GitHub Pages there is no backend; Stage 14 will disable live prediction there.

## 9.5. Replace frontend/src/app/app.ts

Paste the following complete standalone component:

```
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FEATURES, Feature } from './feature-schema';
import { PredictionService, PredictionResponse } from './prediction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly fields = FEATURES;
  readonly deployedStatic = !['localhost', '127.0.0.1']
    .includes(window.location.hostname);
  values: Record<string, string | number | null> = {};
  loading = false;
  error = '';
  result: PredictionResponse | null = null;
  private api = inject(PredictionService);

  constructor() {
    for (const field of this.fields) this.values[field.name] = null;
  }
  trackField(_index: number, field: Feature) { return field.name; }
  submit() {
    this.error = ''; this.result = null;
    if (this.deployedStatic) {
      this.error = 'Static GitHub Pages demo: start Angular + Flask locally for predictions.';
      return;
    }
    const payload: Record<string, string | number> = {};
    for (const field of this.fields) {
      const value = this.values[field.name];
      if (value === null || value === '') {
        this.error = `Enter a value for ${field.label}`; return;
      }
      if (field.kind === 'number') {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
          this.error = `Invalid number for ${field.label}`; return;
        }
        if ((field.min !== undefined && numeric < field.min) ||
            (field.max !== undefined && numeric > field.max)) {
          this.error = `Out-of-range value for ${field.label}`; return;
        }
        payload[field.name] = numeric;
      } else {
        payload[field.name] = String(value);
      }
    }
    this.loading = true;
    this.api.predict(payload).subscribe({
      next: result => { this.result = result; this.loading = false; },
      error: err => {
        this.error = `API error ${err.status || ''}: ` +
          (err.error?.error || err.message || 'Check Flask terminal');
        this.loading = false;
      },
    });
  }
}
```

## 9.6. Replace frontend/src/app/app.html

Paste:

```
<main class="shell">
  <header><h1>ML Research Prediction Dashboard</h1>
    <p>Teaching prototype • Your own fitted model and features</p></header>
  @if (deployedStatic) {
    <aside class="notice">Static GitHub Pages demonstration only.
      Predictions require Flask and Angular running locally.</aside>
  }
  <form (ngSubmit)="submit()">
    <h2>Model input features ({{fields.length}})</h2>
    <div class="grid">
      @for (field of fields; track field.name) {
        <label>{{field.label}}
          @if (field.kind === 'number') {
            <input type="number" step="any" [name]="field.name"
              [min]="field.min ?? null" [max]="field.max ?? null"
              [(ngModel)]="values[field.name]" [required]="field.required" />
          } @else {
            <select [name]="field.name" [(ngModel)]="values[field.name]"
              [required]="field.required">
              <option [ngValue]="null">Select a value</option>
              @for (option of field.options ?? []; track option) {
                <option [ngValue]="option">{{option}}</option>
              }
            </select>
          }
        </label>
      }
    </div>
    <button type="submit" [disabled]="loading || deployedStatic">
      {{loading ? 'Predicting…' : 'Run local prediction'}}
    </button>
  </form>
  @if (error) { <p class="error" role="alert">{{error}}</p> }
  @if (result) {
    <section class="result"><h2>Prediction result</h2>
      <p><strong>{{result.prediction}}</strong></p>
      @if (result.probabilities) {
        <p>Class probabilities: {{result.probabilities.join(', ')}}</p>
      }
      <p>{{result.disclaimer}}</p>
    </section>
  }
</main>
```

## 9.7. Replace frontend/src/app/app.css

Paste:

```
* { box-sizing: border-box; }
.shell { max-width: 960px; margin: 32px auto; padding: 24px;
  font-family: Arial, sans-serif; color: #19304a; }
header { border-bottom: 3px solid #2a6a9c; margin-bottom: 24px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px; margin: 20px 0; }
label { display: grid; gap: 7px; font-weight: 600; }
input, select { padding: 11px; border: 1px solid #a8b9c7; border-radius: 6px; }
button { background: #17659a; color: white; border: 0; border-radius: 7px;
  padding: 12px 20px; cursor: pointer; }
button:disabled { opacity: .55; cursor: not-allowed; }
.notice { background: #fff4d6; padding: 14px; border-radius: 6px; }
.error { color: #a01728; font-weight: bold; }
.result { margin-top: 24px; background: #edf6fc; padding: 18px; border-radius: 8px; }
```

## 9.8. Verify the frontend compiles

In Terminal 3 from root:

```
cd D:\ml_project\frontend
npm run build
```

**CHECKPOINT / IMPORTANT:** If the compiler reports a TypeScript or template error, inspect the exact file/line and compare pasted code. Verify Angular 22 standalone file names: app.ts, app.html, app.css.

# STAGE 10 — Connect Angular and Flask

## 10.1. Restart Angular with the proxy configuration

In Terminal 2 (Angular) press Ctrl+C. If prompted “Terminate batch job (Y/N)?” type Y then Enter. Then run:

```
cd D:\ml_project\frontend
ng serve --open --proxy-config proxy.conf.json
```

**CHECKPOINT / IMPORTANT:** KEEP TERMINAL 2 RUNNING. Keep Terminal 1 running Flask. Terminal 3 remains free.

## 10.2. Check proxy routing

In Terminal 3 run:

```
curl.exe --noproxy "*" -i http://localhost:4200/api/health
```

**CHECKPOINT / IMPORTANT:** Expected HTTP 200 and Flask JSON, routed via Angular. If 404, restart Angular with --proxy-config; if 502, verify Flask Terminal 1.

## 10.3. Submit a valid student record

Open http://localhost:4200. Fill EVERY feature using the same values as backend/test_payload.json (names must match feature-schema.ts). Click “Run local prediction.” Compare result with python backend/test_api.py. If fields do not match, correct feature-schema.ts rather than changing the saved model.

## 10.4. Test validation and server failure

Try submitting a blank required field: browser should block or show error. Stop Flask temporarily with Ctrl+C in Terminal 1, submit again and confirm the Angular API error is visible. Restart Flask in Terminal 1 and retest.

## 10.5. Document model-specific adaptation

If your model is regression, display numeric value and unit. If multiclass, map probability indices to saved class labels. If a custom ensemble, adapt the Flask output and TypeScript PredictionResponse interface. Do not label a research score as a clinical diagnosis.

# STAGE 11 — Root Git repository and exclusions

## 11.1. Create root .gitignore BEFORE git add

From VS Code Explorer, right-click project root → New File → .gitignore (include leading dot). Paste:

```
# Python and local environments
.venv/
__pycache__/
*.py[cod]
.pytest_cache/
.env
.env.*
!.env.example
# Angular dependencies and build outputs
frontend/node_modules/
frontend/dist/
frontend/.angular/
# OS / editor
.DS_Store
Thumbs.db
# Private data and unapproved artifacts
# Uncomment the next two lines if your data/models cannot be published:
# data/
# backend/models/
# Local logs
*.log
```

**CHECKPOINT / IMPORTANT:** DO NOT blindly commit private datasets or model files. If backend/models is excluded, Stage 13’s CI tests need a safe test artifact or a secure artifact retrieval strategy.

## 11.2. Initialize Git from project root

In Terminal 3:

```
cd D:\ml_project
git init
git branch -M main
git status
```

**CHECKPOINT / IMPORTANT:** If Git reports “not a git repository,” verify you are at the root. Never run git init inside frontend.

## 11.3. Configure author identity if needed

Run only if git commit later reports missing identity:

```
git config --global user.name "YOUR REAL NAME"
git config --global user.email "YOUR_GITHUB_EMAIL"
```

**CHECKPOINT / IMPORTANT:** Replace placeholders. Do not include quotation marks in your actual email value beyond shell syntax.

## 11.4. Review what Git will track

From root:

```
git status --short
git add .
git status --short
```

**CHECKPOINT / IMPORTANT:** Review staged files. If .venv, node_modules, secrets or unapproved model/dataset files appear, STOP, fix .gitignore, and unstage with git restore --staged <path>.

## 11.5. Create first commit

From root:

```
git commit -m "Initial full-stack ML application"
git log --oneline -1
```

**CHECKPOINT / IMPORTANT:** Expected one commit hash. Subsequent changes should use meaningful commits such as “Add Angular form” and “Add CI workflow”.

# STAGE 12 — Create GitHub remote and push

## 12.1. Create empty GitHub repository in browser

Sign in at https://github.com/. Click + (top-right) → New repository. Enter Repository name (e.g. ml-project). Select Public if you intend to use public GitHub Pages; check model/data privacy first. DO NOT check “Add a README file”, “Add .gitignore”, or “Choose a license” for an existing local repo. Click Create repository.

## 12.2. Copy remote HTTPS URL

On the new GitHub repository page select HTTPS and copy the URL, e.g. https://github.com/YOUR_USERNAME/ml-project.git. Replace placeholders with your actual GitHub username/repository.

## 12.3. Connect local repo to remote

In Terminal 3 from root:

```
git remote add origin https://github.com/YOUR_USERNAME/ml-project.git
git remote -v
```

**CHECKPOINT / IMPORTANT:** If origin already exists, use git remote set-url origin <YOUR_ACTUAL_URL> rather than adding a duplicate.

## 12.4. Push to GitHub

In Terminal 3:

```
git push -u origin main
```

**CHECKPOINT / IMPORTANT:** If a GitHub browser sign-in window opens, complete authentication and return to VS Code. Do not enter account passwords in commands. Refresh GitHub repository page and verify backend/, frontend/, docs/, README.md and .github/ are visible.

## 12.5. Practice repeatable changes and push

After any later file edit:

```
git status
git add .
git commit -m "Describe the completed change"
git push
```

**CHECKPOINT / IMPORTANT:** Confirm the new commit appears under GitHub → Commits. Do not use force push in this lab.

# STAGE 13 — GitHub Actions automated CI

## 13.1. Decide whether CI can load your model

GitHub Actions runs on a fresh Linux runner, NOT your local Windows PC. If backend/models/model_bundle.joblib and sample payload are approved and tracked, model-dependent pytest tests can run. If private/large/Windows-specific, use a separate small CI-safe fixture or skip model-dependent tests with an explicit explanation. Never pretend unrun tests passed.

## 13.2. Create a portable smoke test that does not load the model

Create backend/tests/test_structure.py; paste:

```
from pathlib import Path

def test_source_files_exist():
    root = Path(__file__).resolve().parents[2]
    assert (root / "backend/app.py").exists()
    assert (root / "frontend/package.json").exists()
    assert (root / "README.md").exists()
```

## 13.3. Create .github/workflows/ci.yml

Right-click .github/workflows → New File → ci.yml; paste:

```
name: Full-stack CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: pip
          cache-dependency-path: backend/requirements.txt
      - run: python -m pip install -r backend/requirements.txt
      - run: python -m pytest -q backend/tests/test_structure.py
      # Enable model-dependent tests ONLY if approved model artifacts
      # and their compatible dependencies are available on the runner.
      # - run: python -m pytest -q backend/tests/test_api.py

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: angular-build
          path: frontend/dist/
```

**CHECKPOINT / IMPORTANT:** Note: GitHub YAML `on:` must remain a key exactly as written. GitHub may update official action major versions; review official documentation before future use.

## 13.4. Commit and push the workflow

In Terminal 3 from project root:

```
git add .github/workflows/ci.yml backend/tests/test_structure.py
git commit -m "Add backend and Angular CI"
git push
```

**CHECKPOINT / IMPORTANT:** If Git says nothing to commit, verify files were saved and are not ignored.

## 13.5. Inspect automated trigger on GitHub

Open repository → Actions → Full-stack CI → latest run. Wait for jobs backend and frontend. Click each job to inspect logs. Green check means success; red X means inspect failing step and fix locally, commit, push again.

## 13.6. Explain caching and artifacts

setup-python cache pip and setup-node cache npm speed repeated installs; caching is NOT a substitute for requirements/package-lock. The angular-build artifact is downloadable from a successful Actions run; it is not yet the GitHub Pages deployment.

# STAGE 14 — Deploy static Angular on GitHub Pages

## 14.1. Set GitHub Pages source to GitHub Actions

GitHub repository → Settings → Pages → Build and deployment → Source → GitHub Actions. If GitHub asks to save, click Save. For a project repository, deployed URL typically https://YOUR_USERNAME.github.io/YOUR_REPO/.

## 14.2. Create .github/workflows/pages.yml

Paste the full workflow below. Replace YOUR_REPO with the ACTUAL repository name in base-href:

```
name: Deploy Angular to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: github-pages
  cancel-in-progress: true
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
        working-directory: frontend
      - run: npx ng build --configuration production --base-href /YOUR_REPO/
        working-directory: frontend
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/dist/frontend/browser
      - id: deployment
        uses: actions/deploy-pages@v4
```

**CHECKPOINT / IMPORTANT:** For Angular 22, browser output commonly appears under frontend/dist/frontend/browser. Check frontend/angular.json outputPath or local build output and adjust the workflow path if different. For username.github.io root sites, base-href is /.

## 14.3. Verify local production build path

In Terminal 3:

```
cd D:\ml_project\frontend
ng build --configuration production --base-href /YOUR_REPO/
Get-ChildItem dist -Recurse -Filter index.html
```

**CHECKPOINT / IMPORTANT:** Replace YOUR_REPO. The printed index.html location must match the Pages upload path. Return to root with cd .. before Git commands.

## 14.4. Push Pages workflow and inspect deployment

From root:

```
cd D:\ml_project
git add .github/workflows/pages.yml
git commit -m "Deploy Angular static frontend to Pages"
git push
```

**CHECKPOINT / IMPORTANT:** GitHub → Actions → Deploy Angular to GitHub Pages → latest run. Wait for green check. Then Settings → Pages → Visit site, or open the URL from deployment job.

## 14.5. Confirm static-site behavior

On public GitHub Pages, the Angular page and fields should render, but the Run local prediction button is disabled with a clear notice. This is expected. GitHub Pages does NOT host Flask, model files, or inference. To provide live public predictions later, a separate secure hosted backend and HTTPS API would be required.

# STAGE 15 — Final validation, documentation and submission

## 15.1. Verify local end-to-end execution

Terminal 1 Flask running; Terminal 2 Angular running with proxy; Terminal 3 for commands. Open http://localhost:4200; submit your valid sample; compare to Python smoke test and Flask API output. Capture screenshots with NO personal/sensitive records.

## 15.2. Verify Git and GitHub Actions

From root run git status, git log --oneline -5 and git remote -v. In GitHub check latest CI and Pages workflow runs. Record run URLs and screenshots in docs/.

## 15.3. Create a complete README.md

Include project title, problem/task, trusted model provenance, features/schema, compatible Python/Node versions, exact installation commands, Terminal 1 and Terminal 2 startup commands, local test commands, GitHub repo URL, Pages URL, deployment limitations, and research/ethics disclaimer.

## 15.4. Record troubleshooting evidence

If a step fails, record command, current working directory (pwd), error text, expected vs actual output, and correction. Common causes: wrong directory, missing .venv activation, missing training-time dependencies, schema mismatch, Angular proxy not enabled, port 5000 unavailable, ignored model in CI, incorrect Pages base href.

## 15.5. Submit student deliverables

Submit: (1) working trusted model bundle and documented preprocessing; (2) Flask API and local test outputs; (3) Angular form and local result screenshot; (4) GitHub repository URL and clean commit history; (5) passing GitHub Actions run URLs and build artifact; (6) static Pages URL with limitations; (7) README and technical report.

# Reference project structure — generated over the stages

```
D:\ml_project\
├── .venv\                         (Stage 3; NEVER commit)
├── .gitignore                       (Stage 11)
├── README.md                        (Stages 3 and 15)
├── backend\
│   ├── app.py                       (Stage 6)
│   ├── requirements.txt             (Stage 3)
│   ├── make_payload.py              (Stage 5)
│   ├── test_pipeline.py             (Stage 5)
│   ├── test_payload.json            (Stage 5; non-sensitive)
│   ├── test_api.py                  (Stage 7)
│   ├── models\model_bundle.joblib  (Stage 4)
│   └── tests\
│       ├── test_api.py              (Stage 7)
│       └── test_structure.py        (Stage 13)
├── data\sample_inputs.csv          (Stage 5; non-sensitive)
├── notebooks\                     (optional training notebooks)
├── docs\                          (environment and evidence)
├── frontend\                      (generated in Stage 8)
│   ├── proxy.conf.json             (Stage 9)
│   ├── package.json / package-lock.json
│   ├── angular.json
│   └── src\app\
│       ├── feature-schema.ts        (Stage 9)
│       ├── prediction.service.ts    (Stage 9)
│       ├── app.ts / app.html / app.css
│       └── app.config.ts
└── .github\workflows\
    ├── ci.yml                       (Stage 13)
    └── pages.yml                    (Stage 14)
```

# Terminal responsibility matrix

| Terminal | Working folder | Runs | Keep open? |
| --- | --- | --- | --- |
| 1 — Flask | D:\ml_project | python backend\app.py | Yes during API/browser testing |
| 2 — Angular | D:\ml_project\frontend | ng serve --open --proxy-config proxy.conf.json | Yes during UI testing |
| 3 — Commands | D:\ml_project | Git, pytest, build, curl | Use freely |

# Local vs GitHub responsibility matrix

| Capability | Local PC | GitHub repository | GitHub Actions | GitHub Pages |
| --- | --- | --- | --- | --- |
| Python/Flask | Runs server | Stores source | Temporary CI runner | Cannot run |
| Model inference | Runs locally | Approved artifact only | Only if artifact available | Cannot run |
| Angular | Dev server | Stores source | Builds | Static browser app |
| Secrets | Local excluded files | Never commit | Secrets if needed | Never embed |
| Datasets | Private by default | Only if permitted | Only if available | Never expose private data |

# CRC running example — original user-specific project note

The instructor’s CRC walkthrough currently has D:\git_crc, final_crc.py, data/colorectal_cancer_dataset_1_kaggle (2).csv, backend/app.py, backend/models/N_TRAINED_MODELS_ALL.pkl, backend/models/recovered_preprocessing.joblib, local test scripts, and generated frontend/. The Angular welcome page, integration, GitHub remote, CI workflows and Pages deployment were NOT completed in that walkthrough at the point this workbook was drafted. The student steps in this manual are forward-looking instructions, not claims of completed CRC testing.

CRC research caution retained from the original manual: dataset stages Localized, Regional, Metastatic differed from the original rule checking Regional and Distant. This can label Metastatic incorrectly. The reproduced score is NOT a clinically validated cancer-risk estimate; scientific conclusions require correction and independent evaluation.

# Troubleshooting quick reference

| Symptom | Check / fix |
| --- | --- |
| node / ng not recognized | Restart all VS Code windows; verify Node LTS install and PATH; try ng.cmd. |
| PowerShell activation blocked | Use process-scoped RemoteSigned or .venv\Scripts\python.exe directly. |
| Flask 500 / wrong prediction | Check fitted preprocessing, feature order, saved versions and Terminal 1 trace. |
| Requests HTTP 502 localhost | Use Session(trust_env=False); compare curl.exe --noproxy "*". |
| Angular cannot call Flask | Keep both servers running; restart ng serve with proxy.conf.json; check /api/health. |
| Angular build fails | Inspect compiler file/line; use generated Angular 22 standalone structure. |
| Git push rejected | Check origin URL, authentication and whether remote was created empty. |
| CI backend fails missing model | Model excluded from repo: provide approved CI artifact or only run explicit structure tests. |
| GitHub Pages blank / 404 | Check base-href, workflow upload path, Pages source, and deployment logs. |

# Student verification checklist

☐ All software versions recorded

☐ Own fitted model + original preprocessing load and predict correctly

☐ Sample JSON keys match exact input feature schema

☐ Flask /health and /predict return expected HTTP codes

☐ Four local pytest API tests pass

☐ Angular form renders all real student features and validates inputs

☐ Terminal 1 Flask + Terminal 2 Angular proxy work together

☐ Git root repository contains no secrets, venv, node_modules or unapproved data

☐ GitHub remote contains code and meaningful commits

☐ CI jobs pass with clearly documented model-test coverage

☐ GitHub Pages site renders and clearly discloses static-only mode

☐ README, evidence screenshots, and technical report completed

# Official reference links

VS Code: https://code.visualstudio.com/

Python: https://www.python.org/downloads/

Flask: https://flask.palletsprojects.com/

Angular installation: https://angular.dev/installation

Angular HTTP: https://angular.dev/guide/http

Node.js: https://nodejs.org/en/download

Git: https://git-scm.com/doc

GitHub Actions: https://docs.github.com/en/actions

GitHub Pages: https://docs.github.com/en/pages

scikit-learn persistence: https://scikit-learn.org/stable/model_persistence.html

END OF WORKBOOK — Do not advance past a failed checkpoint. Replace ALL student placeholders before execution.

Week 6: DevOps Lab Manual  •  Independent student’s Activity  •  1