# OnRooms AI — PG Recommendation & Price Intelligence

Three ML/AI services for a PG (paying-guest) listing platform:

| Service | What it does | Code |
|---|---|---|
| Price prediction | Predicts monthly rent from area, occupancy, amenities, distance | `src/train_price.py` |
| Recommendation | Ranks PGs with cosine similarity + budget/distance fit | `src/recommend.py` |
| AI search | Natural-language query -> structured filters -> ranked results | `src/search_parser.py` |

All three are served by FastAPI (`api/main.py`).

> **Data note:** the repo ships with a *synthetic* dataset (`src/generate_data.py`)
> so everything runs out of the box. Export real listings with
> `src/load_from_mongo.py` and retrain before quoting any metrics.

## Run it
```bash
python -m venv venv && venv\Scripts\activate      # Windows (source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
python -m src.generate_data        # or: python -m src.load_from_mongo
python -m src.train_price          # prints MAE / RMSE / R2 for each model
pytest -q
uvicorn api.main:app --reload      # docs at http://127.0.0.1:8000/docs
```

## API
```bash
curl -X POST localhost:8000/search -H "Content-Type: application/json" \
  -d '{"query": "boys PG near Pimpri under 9000 with food and wifi"}'

curl -X POST localhost:8000/predict-price -H "Content-Type: application/json" \
  -d '{"area":"Pimpri","gender":"Male","occupancy":"Double","wifi":1,"food":1,"laundry":1}'
```

## Roadmap (what to learn + add next)
1. Notebook `01_data_exploration`: EDA on real data (distributions, price by area, outliers).
2. Swap in real data; add lat/lng features; try XGBoost/LightGBM; tune with GridSearchCV.
3. Collaborative filtering once you log user clicks/bookings.
4. Semantic search: sentence-transformers embeddings + FAISS for free-text matching.
5. LLM-based query parser returning the same dict as `parse_query`.
6. Call the FastAPI service from the Node/React OnRooms app.
