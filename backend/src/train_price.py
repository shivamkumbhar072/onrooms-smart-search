"""Train + compare rent prediction models, save the best one."""
import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline

from src.features import CATEGORICAL, NUMERIC, TARGET, build_preprocessor

ROOT = Path(__file__).resolve().parents[1]


def main():
    df = pd.read_csv(ROOT / "data" / "raw" / "listings.csv")
    X, y = df[CATEGORICAL + NUMERIC], df[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    models = {
        "LinearRegression (baseline)": LinearRegression(),
        "RandomForest": RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1),
        "GradientBoosting": GradientBoostingRegressor(random_state=42),
    }
    results, fitted = {}, {}
    for name, est in models.items():
        pipe = Pipeline([("prep", build_preprocessor()), ("model", est)])
        cv_r2 = cross_val_score(pipe, X_train, y_train, cv=5, scoring="r2").mean()
        pipe.fit(X_train, y_train)
        pred = pipe.predict(X_test)
        results[name] = {
            "MAE": round(mean_absolute_error(y_test, pred), 1),
            "RMSE": round(float(np.sqrt(mean_squared_error(y_test, pred))), 1),
            "R2": round(r2_score(y_test, pred), 3),
            "CV_R2": round(float(cv_r2), 3),
        }
        fitted[name] = pipe

    print(pd.DataFrame(results).T.to_string())
    best = min(results, key=lambda k: results[k]["RMSE"])
    print(f"\nBest by RMSE: {best}")

    (ROOT / "models").mkdir(exist_ok=True)
    joblib.dump(fitted[best], ROOT / "models" / "price_model.joblib")
    (ROOT / "models" / "metrics.json").write_text(json.dumps({"best": best, "results": results}, indent=2))


if __name__ == "__main__":
    main()
