"""Generate a SYNTHETIC PG listing dataset so the pipeline runs end to end.

Replace with real OnRooms data (see src/load_from_mongo.py) before you
report any numbers anywhere. Synthetic data only proves the code works.
"""
from pathlib import Path
import numpy as np
import pandas as pd

# area: (lat, lng, base monthly rent for a Double-sharing room)
AREAS = {
    "Pimpri": (18.6279, 73.8009, 6500),
    "Chinchwad": (18.6448, 73.7997, 6300),
    "Akurdi": (18.6476, 73.7711, 6000),
    "Wakad": (18.5988, 73.7600, 7800),
    "Hinjewadi": (18.5912, 73.7389, 8200),
    "Kothrud": (18.5074, 73.8077, 8500),
    "Viman Nagar": (18.5679, 73.9143, 9000),
    "Hadapsar": (18.5089, 73.9260, 7000),
}
OCC_ADJ = {"Single": 2500, "Double": 0, "Triple": -1200}


def generate(n: int = 600, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    areas = list(AREAS)
    rows = []
    for i in range(n):
        area = str(rng.choice(areas))
        lat0, lng0, base = AREAS[area]
        occ = str(rng.choice(["Single", "Double", "Triple"], p=[0.2, 0.5, 0.3]))
        gender = str(rng.choice(["Male", "Female", "Unisex"], p=[0.5, 0.4, 0.1]))
        wifi, food, laundry = (int(rng.random() < p) for p in (0.85, 0.6, 0.5))
        ac, parking, power, bath = (int(rng.random() < p) for p in (0.25, 0.35, 0.6, 0.4))
        dist = round(float(abs(rng.normal(1.5, 1.2)) + 0.2), 2)
        price = (base + OCC_ADJ[occ] + 600 * food + 250 * wifi + 300 * laundry
                 + 1500 * ac + 200 * parking + 150 * power + 500 * bath
                 - 250 * dist + rng.normal(0, 600))
        price = int(max(3000, round(price / 100) * 100))
        rows.append({
            "id": i + 1,
            "title": f"{gender} PG {area} #{i + 1}",
            "area": area,
            "lat": round(lat0 + rng.normal(0, 0.008), 5),
            "lng": round(lng0 + rng.normal(0, 0.008), 5),
            "gender": gender, "occupancy": occ,
            "wifi": wifi, "food": food, "laundry": laundry, "ac": ac,
            "parking": parking, "power_backup": power, "attached_bath": bath,
            "distance_to_college_km": dist,
            "deposit": int(price * rng.choice([1, 1.5, 2])),
            "price": price,
        })
    return pd.DataFrame(rows)


if __name__ == "__main__":
    out = Path(__file__).resolve().parents[1] / "data" / "raw" / "listings.csv"
    df = generate()
    df.to_csv(out, index=False)
    print(f"Wrote {len(df)} synthetic listings -> {out}")
