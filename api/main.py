"""OnRooms AI service.

Run from project root:
python -m uvicorn api.main:app --reload
"""

from pathlib import Path
from typing import List, Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.features import CATEGORICAL, NUMERIC
from src.recommend import Recommender
from src.search_parser import parse_query


# --------------------------------------------------
# Project paths
# --------------------------------------------------

ROOT = Path(__file__).resolve().parents[1]


# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------
# Hide developer documentation from normal users.
# /docs          -> disabled
# /redoc         -> disabled
# /openapi.json  -> disabled
# --------------------------------------------------

app = FastAPI(
    title="OnRooms AI",
    version="0.1.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Model / Data State
# --------------------------------------------------

_state = {}


def _load():
    if not _state:
        model_path = ROOT / "models" / "price_model.joblib"
        data_path = ROOT / "data" / "raw" / "listings.csv"

        if not model_path.exists() or not data_path.exists():
            raise HTTPException(
                status_code=503,
                detail=(
                    "Model/data missing. "
                    "Run generate_data and train_price first."
                ),
            )

        _state["model"] = joblib.load(model_path)

        _state["rec"] = Recommender(
            pd.read_csv(data_path)
        )

    return _state


# --------------------------------------------------
# Request Models
# --------------------------------------------------

class PriceRequest(BaseModel):
    area: str
    gender: str
    occupancy: str
    distance_to_college_km: float = 1.5

    wifi: int = 0
    food: int = 0
    laundry: int = 0
    ac: int = 0
    parking: int = 0
    power_backup: int = 0
    attached_bath: int = 0


class RecommendRequest(BaseModel):
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    area: Optional[str] = None
    gender: Optional[str] = None
    occupancy: Optional[str] = None

    amenities: List[str] = []

    k: int = Field(
        5,
        ge=1,
        le=20
    )


class SearchRequest(BaseModel):
    query: str

    k: int = Field(
        5,
        ge=1,
        le=20
    )


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# --------------------------------------------------
# Price Prediction
# --------------------------------------------------

@app.post("/predict-price")
def predict_price(req: PriceRequest):

    state = _load()

    row = pd.DataFrame(
        [req.model_dump()]
    )[CATEGORICAL + NUMERIC]

    prediction = state["model"].predict(row)[0]

    return {
        "predicted_monthly_rent": int(
            round(float(prediction), -2)
        )
    }


# --------------------------------------------------
# PG Recommendations
# --------------------------------------------------

@app.post("/recommend")
def recommend(req: RecommendRequest):

    state = _load()

    query = req.model_dump(
        exclude={"k"}
    )

    results = state["rec"].recommend(
        query,
        k=req.k
    )

    return {
        "results": results
    }


# --------------------------------------------------
# AI Natural Language Search
# --------------------------------------------------

@app.post("/search")
def search(req: SearchRequest):

    state = _load()

    # Convert user's natural-language query
    # into structured filters.
    parsed_query = parse_query(
        req.query
    )

    # Find PGs matching the parsed requirements.
    results = state["rec"].recommend(
        parsed_query,
        k=req.k
    )

    return {
        "query": req.query,
        "parsed_filters": parsed_query,
        "results": results
    }