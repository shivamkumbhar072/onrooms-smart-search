"""Export REAL OnRooms listings from MongoDB into data/raw/listings.csv.

Set MONGO_URI (and optionally DB_NAME / COLLECTION) then run:
    python -m src.load_from_mongo
Adjust the FIELD MAPPING in to_row() to match your actual Mongoose schema.
"""
import os
from pathlib import Path
import pandas as pd
from pymongo import MongoClient

AMENITIES = {  # csv column -> names used in your amenities array
    "wifi": ["wifi"], "food": ["food", "meals"], "laundry": ["laundry"],
    "ac": ["ac"], "parking": ["parking"],
    "power_backup": ["power backup", "backup"], "attached_bath": ["attached bathroom"],
}


def to_row(doc: dict) -> dict:
    am = {str(a).lower() for a in doc.get("amenities", [])}
    coords = (doc.get("location") or {}).get("coordinates", [None, None])
    row = {
        "id": str(doc["_id"]), "title": doc.get("title"),
        "area": doc.get("area") or doc.get("locality"),                   # <- adjust
        "lat": coords[1], "lng": coords[0],
        "gender": doc.get("gender"),
        "occupancy": doc.get("occupancy"),            # <- values must be Single/Double/Triple
        "distance_to_college_km": doc.get("distanceFromCollege"),         # <- adjust / compute
        "deposit": doc.get("deposit"), "price": doc.get("price"),
    }
    for col, names in AMENITIES.items():
        row[col] = int(any(n in am for n in names))
    return row


if __name__ == "__main__":
    client = MongoClient(os.environ["MONGO_URI"])
    coll = client[os.getenv("DB_NAME", "onrooms")][os.getenv("COLLECTION", "properties")]
    df = pd.DataFrame(to_row(d) for d in coll.find({}))
    df = df.dropna(subset=["price", "area", "gender", "occupancy"])
    out = Path(__file__).resolve().parents[1] / "data" / "raw" / "listings.csv"
    df.to_csv(out, index=False)
    print(f"Wrote {len(df)} listings -> {out}")
